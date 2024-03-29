import { CLOUDINARY_PRESET } from '../config/config';

const cloudinary = require('cloudinary').v2;

export const uploadFile = async (base64: string) => {
  const uploadResponse = await cloudinary.uploader.upload(
    base64,
    {
      upload_preset: CLOUDINARY_PRESET,
    },
    (err: any) => {
      return null;
    }
  );

  return uploadResponse.url;
};
