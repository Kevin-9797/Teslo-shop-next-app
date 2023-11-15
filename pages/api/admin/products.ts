import { db } from '@/database';
import { IProduct } from '@/interfaces';
import { Product } from '@/models';
import { isValidObjectId } from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next'
import { v2 as cloudinary } from 'cloudinary'
cloudinary.config( process.env.CLOUDINARY_URL || '');

type Data = {message: string} | IProduct[] | IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getProducts(req,res);
        case 'PUT':
            return updatedProduct(req,res);
        case 'POST':
            return createProduct(req,res);

        default:
          return  res.status(400).json({ message: 'Bad request' })
    }

}

const  getProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    await db.connect();

    const products = await Product.find().sort({ title: 'asc'}).lean();
    await db.disconnect();
    const updatedProducts = products.map( product => {
        product.images = product.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME }products/${ image }`
        })
        return product;
    })

    return res.status(200).json(updatedProducts);

}
const updatedProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { _id = '',images = [],tags = [],sizes = [] } = req.body as IProduct;

    if(!isValidObjectId(_id)){
        return res.status(400).json({ message: 'Id product not valid'});
        
    }
    if( images.length < 2){
        return res.status(400).json({ message: 'Min 2 images'});

    }
    req.body.tags = tags.sort();
    req.body.sizes = sortSizes( sizes )
    try {
        
        await db.connect();
        const product = await Product.findById(_id);
        if(!product){
            await db.disconnect();

            return res.status(400).json({ message: 'Product not exist'});

        }
        console.log(images)
        product.images.forEach( async( image) => {
            if(!images.includes(image)){
                const [ fileId, extension] = image.substring( image.lastIndexOf('/') + 1).split('.') //aqui le decimos que busque el ultimo slash del path para obtener la extension y el mas 1 es para excluir es el slash
                console.log({ image,fileId,extension});
                await cloudinary.uploader.destroy( fileId );
            }
        })
        await product.updateOne(req.body);

        await db.disconnect();

        return res.status(200).json(product)
    } catch (error) {
        await db.disconnect();
        console.log(error)
        return res.status(400).json({ message: 'Revise logs server'});
        
    }



}
const sortSizes = (sizes: string[]) => {
    return ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].filter(s => sizes.includes(s));
};
 
const createProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const  { images = [] } = req.body as IProduct;
    if( images.length < 2){
        return res.status(400).json({ message: 'Min 2 images'});
    }

    try {
        await db.connect();
        const productDb = await Product.findOne({ slug: req.body.slug });
        if( productDb ){
            return res.status(400).json({ message: 'There is already a product with that slug'});

        }
        const product = new Product( req.body );
        await product.save();
        await db.disconnect();

        return res.status(200).json(product);

    } catch (error) {
        await db.disconnect();
        
    }
}

