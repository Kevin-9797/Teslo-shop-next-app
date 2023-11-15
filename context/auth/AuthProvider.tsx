import { FC, useEffect, useReducer } from "react";
import { AuthContext, authReducer } from "./";
import { IUser } from "@/interfaces";
import { tesloApi } from "@/api";
import Cookies from 'js-cookie'
import axios from "axios";
import { useRouter } from "next/router";
import { signOut, useSession } from 'next-auth/react';
import { User } from "next-auth";

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}
interface Props {
  children: JSX.Element;
}

export const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

export const AuthProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
  const { data ,status } = useSession();
  console.log(data)
  const router = useRouter();
  // useEffect(() => {
  //   checkToken()
    
  // }, []) // si no hay dependecia se ejecuta una sola vez
 
  useEffect(() => {
    if(status === 'authenticated'){
      dispatch({ type: '[Auth] - Login',payload: {
        _id: data.user.id,
        name: data.user.name!,
        email:data.user.email!,
        role: data.user.role!

      } })
    }
  
    return () => {
    }
  }, [status,data])
  
  // const checkToken = async( ) => {
  //   if(!Cookies.get('token')){
  //     return;
  //   }
  //   try {
  //     const { data } = await  tesloApi.get('/user/validate-token');
  //     const { user ,token } = data;
  //     Cookies.set('token', token);

  //     dispatch({ type: '[Auth] - Login',payload: user})

  //   } catch (error) {
  //     Cookies.remove('token');
  //   }
  // }

  const loginUser = async( email:string, password: string ):Promise<boolean> => {

    try {
        const {data} = await tesloApi.post('/user/login', { email, password});
        const { token,user } = data;
        Cookies.set('token', token);
        dispatch({ type: '[Auth] - Login', payload: user });
        return true;
    } catch (error) {
        return false;
    }
  }

  const registerUser = async( name:string,email:string,password: string):Promise<{ hasError:boolean, message?:string }> => {

    try {
      const {data} = await tesloApi.post('/user/register', {name, email, password});
      const { token,user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user });
      return{
        hasError: false
      }
    } catch (error) {
      
      if( axios.isAxiosError(error)){
        return {
          hasError: true,
          message: error.response?.data.message
        }
      }
      return {
        hasError: true,
        message: 'Not user create '
      }
    }
  }

  const  logout = ( ) => {
    Cookies.remove('cart');
    Cookies.remove('firstName');
    Cookies.remove('lastName');
    Cookies.remove('address');
    Cookies.remove('address2');
    Cookies.remove('zip');
    Cookies.remove('city');
    Cookies.remove('country');
    Cookies.remove('phone');



    // router.reload(); //fuerzo a que se recarge la pagina web y le sacamos el contexto
    // Cookies.remove('token');
    signOut();
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loginUser,
        registerUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
