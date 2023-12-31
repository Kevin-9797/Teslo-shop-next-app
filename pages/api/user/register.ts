

import type { NextApiRequest, NextApiResponse } from 'next'
import { IProduct } from '../../../interfaces/products';
import { IUser } from '@/interfaces';
import { db } from '@/database';
import { User } from '@/models';
import bcrypt from 'bcryptjs'
import { jwt, validations } from '@/utils';

type Data = 
    { message: string }
   |  { 
    token:string,
    user: {
        email: string,
        name: string,
        role: string
    }
    }
  


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

    switch (req.method) {
        case 'POST':
            
           return registerUser( req, res);     
            
        
        default:
            return res.status(400).json({ message: 'Bad request' })
            
    }

}

const registerUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { email = '',password = '',name = '' } = req.body as { email:string,password:string, name: string };
    
    if( password.length < 6 ){
        
        return res.status(400).json({ message: 'The password must be greater than 6 characters' })
    }
    if( name.length < 2 ){
        
        return res.status(400).json({ message: 'The name must be greater than 2 characters' })
    }

    if( !validations.isValidEmail(email)){
        return res.status(400).json({ message: 'Email format invalid' })
        
    }
    await db.connect();
    const user = await User.findOne({ email });

    if( user ){

        return res.status(400).json({ message: 'Email registered' })

    }
    const newUser = new User({
        email: email.toLocaleLowerCase(),
        password: bcrypt.hashSync( password ),
        role: 'client',
        name
    })
 
    try {
        await newUser.save({ validateBeforeSave: true });
        await db.disconnect();
    } catch (error) {
        await db.disconnect();
        console.log(error)
        return res.status(500).json({ message: 'Review server logs' })
        
    }
    const { role,_id } = newUser;

    const token = jwt.signToken(_id.toString(),email);
    return res.status(200).json({
        token,
        user: {
            email,
            role,
            name
        }
    })

}
