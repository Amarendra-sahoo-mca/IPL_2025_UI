import { mkdirSync } from "fs";
import { extname } from "path";

export class MulterHelper {
  static destinationPath(req, file, cb) {
    // console.log("destinationPath :: file ", file);
    // console.log("destinationPath ", req.url);
    const folderName = req.url.indexOf("user") != -1 ? "user" : "";
    // console.log("destinationPath ::  ", folderName);
    const path = `uploads/${folderName}/`;
    mkdirSync(path, { recursive: true });
    cb(null, path);
  }

  static customFileName(req, file, cb) {
    // console.log("customFileName ", req.body);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const originalName = file.originalname.split(".")[0];
    const extenstion = extname(file.originalname);
    const fileName = `${originalName}-${uniqueSuffix}${extenstion}`;
    // console.log("customFileName :: fileName = ", fileName);
    //Calling the callback passing the random name generated with the original extension name
    cb(null, fileName);
  }

  static generateFileName(name) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const originalName = name.split(".")[0];
    const extenstion = extname(name);
    const fileName = `${originalName}-${uniqueSuffix}${extenstion}`;
    return fileName;
  }
}
