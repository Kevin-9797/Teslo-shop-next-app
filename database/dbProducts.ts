import { Product } from "@/models";
import { db } from "."
import { IProduct } from "@/interfaces";

interface ProductSlug {
    slug: string
}
export const getProductBySlug = async( slug:string ):Promise<IProduct | null> => {

    await db.connect();


    const product = await Product.findOne({slug}).lean();

    if( !product ){
        return null;
    }
    product.images = product.images.map( image => {
        return image.includes('http') ? image : `${ process.env.HOST_NAME }products/${ image }`
    })
    await db.disconnect();

    if( !product) return null;
    return JSON.parse(JSON.stringify(product))

}


export const getAllProductsSlug = async():Promise<ProductSlug[]> => {
    await db.connect();

    const slugs = await Product.find().select('slug -_id').lean();

    await db.disconnect();

    return slugs;
    
}

export const getProductsByTerm = async( term: string ): Promise<IProduct[]> => {
    term = term.toString().toLocaleLowerCase()

    await db.connect();
    const products = await Product.find({
        $text: { $search: term }
    }).lean()
    
    
    await db.disconnect();
    const updatedProducts = products.map( product => {
        product.images = product.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME }products/${ image }`
        })
        return product;
    })
    return  JSON.parse(JSON.stringify(updatedProducts));

}

export const getAllProducts = async():Promise<IProduct[]> => {

    await db.connect();


    const products = await Product.find().lean();

    await db.disconnect();
    const updatedProducts = products.map( product => {
        product.images = product.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME }products/${ image }`
        })
        return product;
    })
    return JSON.parse(JSON.stringify(updatedProducts))
}