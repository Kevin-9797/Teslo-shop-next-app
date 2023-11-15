import { FC, useReducer, useEffect } from "react";
import { CartContext, cartReducer } from "./";
import { ICartProduct, IOrder, ShippingAddress } from "@/interfaces";
import Cookie from "js-cookie";
import { tesloApi } from "@/api";
import { stat } from "fs";
import axios from "axios";

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  shippingAddress?: ShippingAddress | undefined;
}


interface Props {
  children: JSX.Element;
}

export const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: Cookie.get("cart") ? JSON.parse(Cookie.get("cart")!) : [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined ,
};

export const CartProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffect(() => {
    const getCartProducts = Cookie.get("cart")
      ? JSON.parse(Cookie.get("cart")!)
      : [];

    dispatch({
      type: "[Cart] - LoadCart from cookies | storage",
      payload: getCartProducts,
    });
  }, []);
  
  useEffect(() => {

    if ( Cookie.get('firstName')){
        const shippingAddress = {
            firstName : Cookie.get('firstName') || '',
            lastName  : Cookie.get('lastName') || '',
            address   : Cookie.get('address') || '',
            address2  : Cookie.get('address2') || '',
            zip       : Cookie.get('zip') || '',
            city      : Cookie.get('city') || '',
            country   : Cookie.get('country') || '',
            phone     : Cookie.get('phone') || '',
        }
        
        dispatch({ type:'[Cart] - LoadAddress from Cookies', payload: shippingAddress })
    }
}, [])

  useEffect(() => {
    
    const numberOfItems =  state.cart.reduce( (prev,current) => current.quantity + prev ,0)
    const subTotal =  state.cart.reduce( (prev,current) => (current.price * current.quantity) + prev ,0)
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
    const orderSummary = {
      numberOfItems,
      subTotal,
      tax:  subTotal * taxRate,
      total: subTotal * ( taxRate  + 1 )
    }
    dispatch({ type: '[Cart] - Update Order Summary', payload: orderSummary})

  }, [state.cart])
  

  useEffect(() => {
    if (state.cart.length > 0) Cookie.set("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  const addProductCart = (productCart: ICartProduct) => {
    const productInCart = state.cart.some((p) => p._id === productCart._id);
    if (!productInCart) {
      return dispatch({
        type: "[Cart] - Updated Product In cart",
        payload: [...state.cart, productCart],
      });
    }
    const productInCartButDifferentSize = state.cart.some(
      (p) => p._id === productCart._id && p.size === productCart.size
    );
    if (!productInCartButDifferentSize) {
      return dispatch({
        type: "[Cart] - Updated Product In cart",
        payload: [...state.cart, productCart],
      });
    }
    const updatedProducts = state.cart.map((p) => {
      if (p._id !== productCart._id) return p;
      if (p.size !== productCart.size) return p;
      p.quantity = p.quantity + productCart.quantity;
      return p;
    });
    dispatch({
      type: "[Cart] - Updated Product In cart",
      payload: updatedProducts,
    });
  };
  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({ type: "[Cart] - Change cart quantity", payload: product });
  };
  const removeProductCart = (product: ICartProduct) => {
    dispatch({ type: "[Cart] - Remove Product Cart", payload: product });
  };
  const updateAddress = ( address: ShippingAddress ) => {
    Cookie.set('firstName',address.firstName);
    Cookie.set('lastName',address.lastName);
    Cookie.set('address',address.address);
    Cookie.set('address2',address.address2 || '');
    Cookie.set('zip',address.zip);
    Cookie.set('city',address.city);
    Cookie.set('country',address.country);
    Cookie.set('phone',address.phone);

    dispatch({ type: '[Cart] - Update Address', payload: address });
}

const createOrder = async():Promise<{ hasError:boolean; message: string }> => {
  if(!state.shippingAddress){
    throw new Error('Not address delivery');
  }
  const body:IOrder = {
    orderItems: state.cart.map( p => ({
      ...p,
      size: p.size!
    }))  ,
    paymentResult: '',
    shippingAddress: state.shippingAddress,
    numberOfItems: state.numberOfItems,
    subTotal: state.subTotal,
    tax: state.tax,
    total: state.total,
    isPaid: false,
  }
  try {
    const { data } = await tesloApi.post('/orders',body)
    dispatch({ type: '[Cart] - Order Complete' } );

    return {
      hasError: false,
      message: data._id!
    }
  } catch (error) {
    if( axios.isAxiosError(error) ){
      return{
        hasError: true,
        message: error.response?.data.message
      }
    }
    return{
      hasError: true,
      message: 'internal server error'
    }
  }
}
  return (
    <CartContext.Provider
      value={{
        ...state,
        addProductCart,
        updateCartQuantity,
        removeProductCart,
        updateAddress,
        createOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
