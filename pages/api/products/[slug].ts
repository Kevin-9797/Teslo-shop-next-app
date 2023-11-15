import { db } from "@/database";
import { IProduct } from "@/interfaces";
import { Product } from "@/models";
import { NextApiRequest, NextApiResponse } from "next";


type Data = { message: string }
            | IProduct
            | IProduct[]


export default function handler(  req:NextApiRequest ,res:NextApiResponse<Data>){


    switch (req.method) {
        case 'GET':
            return getProductSlug(req,res)            
    
        default:
            return res.status(400).json({ message: 'Bad request' })

    }


}

const getProductSlug = async(req:NextApiRequest ,res:NextApiResponse<Data> ) => {

    const { slug } = req.query;
    
    await db.connect();
    const product = await Product.find({ slug }  ).lean();
    
    if (!product) {
        await db.disconnect();
        return res.status(404).json({ message: 'Not slug product' + product })
    }
    await db.disconnect();
        return res.status(200).json(product)
        
    
}