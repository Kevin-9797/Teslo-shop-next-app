import { NextApiRequest, NextApiResponse } from 'next'
import formidable ,{ File,IncomingForm } from 'formidable'
import { v2 as cloudinary } from 'cloudinary'
cloudinary.config( process.env.CLOUDINARY_URL || '');

type Data = {
    message:string;

}



export const config = {
    api: {
        bodyParser: false
    }
}

export default function handler( req:NextApiRequest,res:NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return UploadFile(req,res)
    
        default:
          return  res.status(400).json({ message: 'Bad Request'})
    }

    

}

const saveFile = async( file: File ):Promise<string> => {
    const { secure_url } = await cloudinary.uploader.upload(file.filepath,{ folder: `teslo-shop/` });
    console.log(secure_url)
    return secure_url
} 
const UploadFile = async(req: NextApiRequest, res: NextApiResponse<Data>) =>{
    const imageUrl: any = await parseFiles(req);
    
    return res.status(200).json({ message: imageUrl });
}
const parseFiles = async(req: NextApiRequest) => {
    return new Promise ((resolve,reject) => {

        const form = new IncomingForm();
        form.parse(req, async( err,fields,files) => {
            if(err){
              return reject(err)
            }
            console.log(files.file)
            const filePath: string  = await saveFile(files.file as any)
            
            return resolve(filePath)
            // await saveFile( )
        })

    })
}

