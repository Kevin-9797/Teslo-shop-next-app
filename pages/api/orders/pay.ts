import { db } from "@/database";
import { IPaypal } from "@/interfaces";
import { Order } from "@/models";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { isValidObjectId } from "mongoose";

type Data = {
    message: string;
}


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return payOrder(req, res);

        default:
            return res.status(400).json({ message: 'Not confirm order' })

    }
}
const getPaypalBearerToken = async (): Promise<string | null> => {
    const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET

    const base64Token = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`, 'utf-8').toString('base64');
    const body = new URLSearchParams('grant_type=client_credentials');

    try {
        const { data } = await axios.post(process.env.PAYPAL_OAUTH_URL || '', body, {
            headers: {
                'Authorization': `Basic ${base64Token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return data.access_token
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error.response?.data);
        } else {
            console.log(error)

        }
        return null;
    }


}

export const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const paypalBearerToken = await getPaypalBearerToken();
    const session: any = await getServerSession(req,res,authOptions); 
    if (!paypalBearerToken) {
        return res.status(400).json({ message: 'Not confirm order' })

    }
    const { transactionId = '', orderId = '' } = req.body;
    const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(`${process.env.PAYPAL_ORDERS_URL}/${ transactionId}`, {
        headers: {
            'Authorization' : `Bearer ${ paypalBearerToken }`
        }
    })
    if( data.status !== 'COMPLETED'){
        return res.status(401).json({ message: 'Order not recogniz'})
    }
    if(!isValidObjectId(orderId)){
        return res.status(401).json({ message: 'Order ID not valid mongo Id'})

    }
    await db.connect();

    const dbOrder = await Order.findById(orderId);

    if(!dbOrder){
        await db.disconnect();
        return res.status(400).json({ message: 'Order not exist in database'})

    }

    if( dbOrder.total !== Number(data.purchase_units[0].amount.value) ){
        await db.disconnect();
        return res.status(400).json({ message: 'The paypal amounts and the order amounts are not the same'})

    }

    if( session.user.id !== dbOrder.user?.toString() ){
        await db.disconnect();

        return res.status(400).json({ message: 'This order does not belong to the authenticated user'})

    }
    dbOrder.transactionId = transactionId;
    dbOrder.isPaid = true;
    await dbOrder.save();

    await db.disconnect();

    return res.status(200).json({ message: 'Order paid' })

}