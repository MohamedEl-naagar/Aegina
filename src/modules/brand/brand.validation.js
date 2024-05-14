import Joi from 'joi'


const addBrandValidation = Joi.object({
        title: Joi.string().min(3).max(300).required().trim(),
        image: Joi.object({
            fieldname: Joi.string().required(),
            originalname: Joi.string().required(),
            encoding: Joi.string().required(),
            mimetype: Joi.string().valid('image/jpeg','image/png','image/jpg').required(),
            destination: Joi.string().required(),
            filename: Joi.string().required(),
            path: Joi.string().required(),
            size: Joi.number().max(5242880).required()
        }).required(),
        category: Joi.string().hex().length(24).required(),
})

const paramsIdValidation = Joi.object({
    
    id: Joi.string().hex().length(24).required()
})


const updateBrandValidation = Joi.object({
    title: Joi.string().min(3).max(300).optional().trim(),
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
    }).optional(),
    category: Joi.string().hex().length(24).optional(),


})

export{
    addBrandValidation,
    paramsIdValidation,
    updateBrandValidation
}