import { ICartProduct, ShippingAddress } from "@/interfaces";
import { CartState,  } from '.';



type CartActionType =
    | { type: '[Cart] - LoadCart from cookies | storage', payload: ICartProduct[] }
    | { type: '[Cart] - Add ProductCart', payload: ICartProduct[] }
    | { type: '[Cart] - Updated Product In cart', payload: ICartProduct[] }
    | { type: '[Cart] - Change cart quantity', payload: ICartProduct }
    | { type: '[Cart] - Remove Product Cart', payload: ICartProduct }
    | { type: '[Cart] - Update Address', payload: ShippingAddress }
    | { type: '[Cart] - LoadAddress from Cookies', payload: ShippingAddress }

    

    | {
        type: '[Cart] - Update Order Summary', payload: {

            numberOfItems: number;
            subTotal: number;
            tax: number;
            total: number;

        }
    }
    | { type: '[Cart] - Order Complete'}









export const cartReducer = (state: CartState, action: CartActionType): CartState => {


    switch (action.type) {
        case '[Cart] - LoadCart from cookies | storage':
            return {
                ...state,
                isLoaded: true,
                cart: [...action.payload]
            }
        case '[Cart] - Add ProductCart':
            return {
                ...state,
                cart: [...action.payload]
            }
        case '[Cart] - Updated Product In cart':
            return {
                ...state,
                cart: [...action.payload]
            }
        case '[Cart] - Change cart quantity':
            return {
                ...state,
                cart: state.cart.map(product => {
                    if (product._id !== action.payload._id) return product;
                    if (product.size !== action.payload.size) return product;
                    return action.payload;
                })
            }
        case '[Cart] - Remove Product Cart':
            return {
                ...state,
                cart: state.cart.filter((p) => !(p._id === action.payload._id && p.size === action.payload.size))
            }
        case '[Cart] - Update Order Summary':
            return {
                ...state,
                numberOfItems: action.payload.numberOfItems,
                subTotal: action.payload.subTotal,
                tax: action.payload.tax,
                total: action.payload.total,
            }

            case '[Cart] - Update Address':
                case '[Cart] - LoadAddress from Cookies':
                   return {
                      ...state,
                      shippingAddress: action.payload
                   }
          case '[Cart] - Order Complete' :
            return {
                ...state,
                cart: [],
                numberOfItems: 0,
                subTotal: 0,
                tax: 0,
                total: 0
            }
        default:
            return state;
    }




}