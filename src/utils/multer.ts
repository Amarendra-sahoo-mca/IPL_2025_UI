import { mkdirSync } from 'fs';
import { extname } from 'path';

export class MulterHelper {
  static destinationPath(req, file, cb) {
    const folderName =
      req.url.indexOf('customer') != -1
        ? 'customers'
        : req.url.indexOf('advertise') != -1
        ? 'advertises'
        : ''; // Add more paths as necessary

    const path = `uploads/${folderName}/`;
    mkdirSync(path, { recursive: true });
    cb(null, path);
  }

  static customFileName(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const originalName = file.originalname.split('.')[0];
    const extension = extname(file.originalname);
    const fileName = `${originalName}-${uniqueSuffix}${extension}`;
    cb(null, fileName);
  }
}
