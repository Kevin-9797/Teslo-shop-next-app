import { ICartProduct, ShippingAddress } from '@/interfaces';
import { createContext } from 'react';


interface ContextProps{
   isLoaded: boolean;
   cart: ICartProduct[];
   numberOfItems: number;
   subTotal: number;
   tax: number;
   total: number;

   shippingAddress?: ShippingAddress ;
   addProductCart: ( productCart: ICartProduct ) => void;
   updateCartQuantity: (product: ICartProduct) => void;
   removeProductCart: (product: ICartProduct) => void;
   updateAddress:( address: ShippingAddress ) => void; 
   createOrder : () => Promise<{ hasError:boolean; message: string }>;
}

export const CartContext = createContext({} as ContextProps);