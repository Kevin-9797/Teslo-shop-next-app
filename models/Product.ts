import { IProduct } from '@/interfaces';
import second, { Schema,model,Model } from 'mongoose';
import mongoose from 'mongoose';


const productSchema = new Schema({
    description:{
        type: String,
        required: true,
        default: ''
    },
    images: [{
        type: String,
    }],
    inStock: { type: Number,required: true, default: 0},
    price: { type: Number ,required: true, default: 0 },
    sizes: [{
        type: String,
        enum: {
            values: [ 'XS','S','M','L','XL','XXL','XXXL' ],
            message: '{VALUE} not size valid'
        }
    }],
    slug: { type: String, required: true, unique: true },
    tags: [{
        type: String,

    }],
    title: { type: String, default: ''},
    type: { 
        type: String ,
        enum: {
            values: [ 'shirts','pants','hoodies','hats'],
            message: '{VALUE} not type valid'
        },
        default: 'shirts'

    },
    gender: {
        type: String,
        enum:{
            values: ['men','women','kid','unisex'],
            message: '{VALUE} not gender valid'

        },
        default: 'women'

    },
    
            
},{
    timestamps:true
});

productSchema.index({ title: 'text', tags: 'text'});

const Product: Model<IProduct> =  mongoose.models.Product || model('Product',productSchema);

export default Product;