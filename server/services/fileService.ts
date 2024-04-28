import { CLOUDINARY_PRESET } from '../config/config';

const cloudinary = require('cloudinary').v2;

export const uploadFile = async (base64: string) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(
      base64,
      {
        upload_preset: CLOUDINARY_PRESET,
      },
      (err: any) => {
        return null;
      }
    );

    return uploadResponse.secure_url || uploadResponse.url;
  } catch (err) {
    return null;
  }
};

export const deleteFile = async (url: string) => {
  try {
    const fileName = url.split('/').pop() || '';
    const publicId = CLOUDINARY_PRESET + '/' + fileName.split('.')[0];
    const response: { result: string } = await cloudinary.uploader.destroy(
      publicId
    );
    return response.result.toLowerCase() === 'ok';
  } catch (err) {
    return false;
  }
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
