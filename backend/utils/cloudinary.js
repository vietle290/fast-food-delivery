import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

const uploadCloudinary = async (file) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true
    })
    try {
        const result = await cloudinary.uploader.upload(file)
        fs.unlinkSync(file) // delete image from server
        return result.secure_url
    } catch (error) {
        rs.unlinkSync(file)
        console.log(error)
    }
}

export default uploadCloudinary