import { db } from "@/database";
import { Order, Product, User } from "@/models";
import { NextApiRequest, NextApiResponse } from "next"


type Data = {
    message?: string
    numberOfOrders: number;
    paidOrders: number; //isPaid true
    numberOfProducts: number;
    numberOfClients: number; // role: client
    notPaidOrders: number;
    producstWithNoInventory: number; 
    lowInventory: number;//productos con menos de 10
}


export default async function  handler ( req: NextApiRequest,res:NextApiResponse<Data>) {


    await db.connect();
    const [numberOfOrders,numberOfProducts,paidOrders,numberOfClients,notPaidOrders,producstWithNoInventory,lowInventory] = await Promise.all([
        Order.countDocuments(),
        Product.countDocuments(),
        Order.countDocuments({ isPaid: true }),
        User.countDocuments({ role: 'client'}),
        Order.countDocuments({ isPaid: false}),
        Product.countDocuments({ inStock: 0 }),
        Product.countDocuments({ inStock: { $lte: 10 }})

    ]);

    await db.disconnect();


    return res.status(200).json({
        numberOfOrders,
        numberOfProducts,
        paidOrders,
        numberOfClients,
        notPaidOrders,
        producstWithNoInventory,
        lowInventory
    })

}