import { IProduct } from "@/interfaces";
import { NextApiRequest, NextApiResponse } from "next";
import { connect, disconnect } from '../../../database/db';
import { Product } from "@/models";
import { db } from "@/database";



type Data = { message: string }
            | IProduct
            | IProduct[]


export default function handler( req: NextApiRequest,res: NextApiResponse<Data>){

    
    switch (req.method) {
        case 'GET':
            return searchProducts(req,res)            
    
        default:
    }

} 

const searchProducts = async(req: NextApiRequest,res: NextApiResponse<Data>) => {

    let { q = ''} = req.query;

    if( q.length === 0){
        return res.status(404).json({ message: 'You must specify a search query' + q })

    }
    q = q.toString().toLocaleLowerCase()

    await db.connect();
    const products = await Product.find({
        $text: { $search: q }
    }).lean()
    
    await db.disconnect();

        return res.status(200).json({ message: 'Ok', ...products })


}