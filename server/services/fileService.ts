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

export const isBase64 = (str: string) => {
  try {
    return Buffer.from(str, 'base64').toString('base64') === str;
  } catch (err) {
    return false;
  }
};

export const isUrl = (str: string) => {
  try {
    new URL(str);
    return true;
  } catch (err) {
    return false;
  }
};
