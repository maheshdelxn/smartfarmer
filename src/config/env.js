import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
  API_BASE_URL,
} from '@env';

// Export environment variables
export const CLOUDINARY_CONFIG = {
  cloudName: CLOUDINARY_CLOUD_NAME,
  uploadPreset: CLOUDINARY_UPLOAD_PRESET,
};

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
};

export default {
  CLOUDINARY_CONFIG,
  API_CONFIG,
};