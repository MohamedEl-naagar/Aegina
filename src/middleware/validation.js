import { AppError } from "../utils/AppError.js"


export const validation = (schema) => {
 
    return (req, res, next) => {
        let filters = {};
        if(req.file){
            filters ={image:req.file ,...req.params,...req.body,...req.query}
        }else if(req.files){
            filters ={...req.files ,...req.params,...req.body,...req.query}
        }else{
            filters ={...req.params,...req.body,...req.query}
        }
        const { error } = schema.validate(filters, { abortEarly: false })
        if (!error) {
            next()
        } else {
            let errMsg = []
            error.details.forEach((val)=>{
                errMsg.push(val.message)
            })
            next(new AppError(errMsg,401))
        }
    }
}
