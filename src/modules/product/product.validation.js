import Joi from "joi";

const addProductValidation = Joi.object({
  title: Joi.string().min(2).max(300).required().trim(),
  description: Joi.string().min(2).max(300).optional().trim(),
  price: Joi.number().min(0).required(),
  priceAfterDiscount: Joi.number().min(0).optional(),
  quantity: Joi.number().min(0).required(),
  category: Joi.string().hex().length(24).optional(),
  subCategory: Joi.string().hex().length(24),
  brand: Joi.string().hex().length(24).required(),
  createdBy: Joi.string().hex().length(24).optional(),
  category: Joi.string().hex().length(24).required(),
  imageCover: Joi.array()
    .items(
      Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string()
          .valid("image/jpeg", "image/png", "image/jpg")
          .required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().max(5242880).required(),
      }).required()
    )
    .required(),
  images: Joi.array()
    .items(
      Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string()
          .valid("image/jpeg", "image/png", "image/jpg")
          .required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().max(5242880).required(),
      }).required()
    )
    .required(),
});

const paramsIdValidation = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
const updateProductValidation = Joi.object({
  title: Joi.string().min(2).max(300).optional().trim(),
  id: Joi.string().hex().length(24).required(),
  imageCover: Joi.array()
    .items(
      Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string()
          .valid("image/jpeg", "image/png", "image/jpg")
          .required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().max(5242880).required(),
      }).required()
    )
    .optional(),
    updatedImageIndex:Joi.number(),
  images: Joi.array()
    .items(
      Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string()
          .valid("image/jpeg", "image/png", "image/jpg")
          .required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().max(5242880).required(),
      }).required()
    )
    .optional(),
}).or("title", "imageCover", "images");

export { addProductValidation, paramsIdValidation, updateProductValidation };
