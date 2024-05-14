import Joi from 'joi'


const addSubCategoryValidation = Joi.object({
        title: Joi.string().min(3).max(300).required().trim(),
        category: Joi.string().hex().length(24).required(),
        image: Joi.object({
            fieldname: Joi.string().required(),
            originalname: Joi.string().required(),
            encoding: Joi.string().required(),
            mimetype: Joi.string().valid('image/jpeg','image/png','image/jpg').required(),
            destination: Joi.string().required(),
            filename: Joi.string().required(),
            path: Joi.string().required(),
            size: Joi.number().max(5242880).required()
        }).required()
})

const paramsIdValidation = Joi.object({
    
    id: Joi.string().hex().length(24).required()
})


const updateSubCategoryValidation = Joi.object({
    title: Joi.string().min(3).max(300).trim().optional(),
    id: Joi.string().hex().length(24).required(),
    image: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().valid('image/jpeg','image/png','image/jpg').required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().max(5242880).required()
    }).optional()


})

export{
    addSubCategoryValidation,
    paramsIdValidation,
    updateSubCategoryValidation
}