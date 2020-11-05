import multer from 'multer';
import crypto from 'crypto';
import path from 'path';

const uploadsFolder = path.resolve(__dirname, '..', '..', 'uploads');

export default {
  directory: uploadsFolder,

  storage: multer.diskStorage({
    destination: uploadsFolder,
    filename: (request, file, cb) => {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const normalizedName = file.originalname.replace(/ /g, '_');
      const filename = `${fileHash}-${normalizedName}`;

      cb(null, filename);
    },
  }),
};
