import { Request, Response } from 'express';
import cloudinary from '../utils/cloudinary';

export async function uploadImageController(req: Request, res: Response) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'bloguer/articles', resource_type: 'image' },
            (error, result) => {
                if (error || !result) {
                    return res.status(500).json({ message: 'Cloudinary upload failed', error });
                }
                return res.status(200).json({ url: result.secure_url });
            }
        );

        if (req.file && req.file.buffer) {
            uploadStream.end(req.file.buffer);
        }
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err });
    }
}
