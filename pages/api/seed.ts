
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db, seeDatabase } from '@/database';
import { Product, User } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

    if( process.env.NODE_ENV === 'production'){
        return res.status(401).json({ message: 'Not access a database'})
    }

    await db.connect();
    await User.deleteMany();

    await User.insertMany(seeDatabase.initialData.users);
    
    await Product.deleteMany();
    
    await Product.insertMany(seeDatabase.initialData.products)
    await db.disconnect();
  res.status(200).json({ message: 'Process result valid' })
}
