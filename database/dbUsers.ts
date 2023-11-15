import { User } from "@/models";
import { db } from "."
import bcrypt from 'bcryptjs';
import { IUser } from "@/interfaces";


export const checkUserEmailPassword = async( email:string,password: string ) => {

    await db.connect();
    const user = await User.findOne({ email });

    console.log(user + ' el usuario')
    await db.disconnect();
    if( !user ){
        return null;
    }

    if( !bcrypt.compareSync(password,user.password!)){
        return null;
    }
    const { role,name,_id } = user;

    return {
        id : _id.toString(),
        email: email.toLowerCase(),
        name,
        role
    }

}


export const oAuthToDbUser = async( oAuthEmail: string,oAuthName: string ) => {

    await db.connect();
    const user = await User.findOne({ email: oAuthEmail });
    
    if( user ){
        await db.disconnect();
        const { _id,name,email,role } = user as any ; 
        console.log(_id)
        return {
            id: _id,
            name,
            email,
            role
        }
    } 
    
    const newUser = new User ({ email: oAuthEmail,name: oAuthName,password:'@',role: 'client'})
    
        console.log({newUser}) 
        await newUser.save();
        await db.disconnect();
        const { _id, name, email, role } = newUser;
        return { id: _id.toString(), name, email, role };
 

}

export const getUserByEmail = async( email:string ) => {
    await db.connect();
    const user = User.findOne( { email });
    await db.disconnect();
    if(!user){
        return null;
    }
    return JSON.parse(JSON.stringify(user));

    
    

}