import multer from "multer"
import {AppError} from '../utils/AppError.js'

const uploadFile = ()=>{
    const storage = multer.diskStorage({})


function fileFilter (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(new AppError("Invalid image type",401), false);
    }

      }          
      const upload = multer({ storage,fileFilter })
      return upload
}
export const uploadSingle = (filedName)=>uploadFile().single(filedName)
export const uploadArray  = (fieldname)=>uploadFile().array(fieldname,8)
export const uploadFields = (fieldname)=>uploadFile().fields(fieldname)

