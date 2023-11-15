import { NextApiRequest,NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { IOrder } from '@/interfaces';
import { db } from '@/database';
import { Order, Product, User } from '@/models';
import mongoose from 'mongoose'
type Data = { message: string;}
| IOrder

export default function handler( req:NextApiRequest,res:NextApiResponse<Data>){
    switch (req.method) {
        case 'POST':
            return createOrder(req,res);
    
        default:
        return res.status(400).json({ message: 'Bad request'});

    }

}


export const createOrder = async(req:NextApiRequest,res:NextApiResponse<Data>) => {
    const { orderItems, total } = req.body as IOrder;
    const session: any = await getServerSession(req, res, authOptions);
    console.log(session);
    if(!session) {
        return res.status(401).json({ message: 'You must be authenticated to perform this action'})
    }

    const productsIds = orderItems.map( p => p._id );
    await db.connect();
    const dbProducts = await Product.find({ _id: { $in: productsIds }});
    try {
        const subTotal =  orderItems.reduce( (prev,current) => {
            const currentPrice = dbProducts.find( prod => new mongoose.Types.ObjectId(prod._id).toString() === current._id )?.price;
            console.log(currentPrice)
            if( !currentPrice ){
                throw new Error ('Product not exist')
            }

            return (currentPrice * current.quantity) + prev
        } ,0); // el 0 es para decirle que el valor anterior al iniciar es un 0
 
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
        const backendTotal = subTotal * ( taxRate + 1);

        if( total !== backendTotal ){
            throw new Error('Total is not equal to backend total')
        }
        const newOrder = new Order({ ...req.body, isPaid:false,user: session.user.id });
        newOrder.total = Math.round( newOrder.total * 100 ) / 100;
        await newOrder.save();
        console.log(newOrder)
        await db.disconnect();
        return res.status(201).json(newOrder)
    } catch (error:any ) {
        await db.disconnect();
        console.log(error);
        res.status(400).json({
            message : error.message || 'Check logs server' 
        })
    }
    return res.status(200).json({ message: 'Bad request'});

}