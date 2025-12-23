import { Request, Response } from 'express';
import cloudinary from '../utils/cloudinary';
import { updateUserAvatar } from '../repositories/user.repository';

export async function uploadAvatarController(req: Request, res: Response) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const result = await cloudinary.uploader.upload_stream(
            { folder: 'bloguer/avatars', resource_type: 'image' },
            async (error, result) => {
                if (error || !result) {
                    return res
                        .status(500)
                        .json({ message: 'Cloudinary upload failed', error });
                }
                await updateUserAvatar((req as any).userId, result.secure_url);
                return res.status(200).json({ avatar: result.secure_url });
            }
        );

        if (req.file && req.file.buffer) {
            result.end(req.file.buffer);
        }
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err });
    }
}
