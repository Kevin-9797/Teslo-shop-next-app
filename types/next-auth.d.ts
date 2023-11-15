import { IUser } from "@/interfaces";
import NextAuth ,{ User } from "next-auth"
     
declare module "next-auth" {
  interface Session {
    user: UserConvert
    accessToken?: string;
  }

  interface UserConvert extends User{
    role?: string
  }
  
} 

declare module "next-auth/jwt"{
  
  interface JWT{
    user: UserConvert
  }
  interface UserConvert extends User{
    role?: string
  }
  
}