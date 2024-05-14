import express from "express";
import { validation } from "../../middleware/validation.js";
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import {addProduct,getAllProducts,getSingleProductById,updateProduct,deleteProduct,
} from "./product.controller.js";
import { uploadFields, uploadSingle } from "../../utils/fileUpload.js";
import {addProductValidation,paramsIdValidation,updateProductValidation} from "./product.validation.js";

const ProductRoute = express.Router();
ProductRoute.route("/")
  .get(getAllProducts)
  .post(protectedRoutes,allowedTo("company"),uploadFields([
      { name: "imageCover", maxCount: 1 },
      { name: "images", maxCount: 5 },
    ]),
    validation(addProductValidation),
    addProduct
  );

ProductRoute.route("/:id")
  .get(validation(paramsIdValidation), getSingleProductById)
  .patch(protectedRoutes,allowedTo("company"),
    uploadFields([
      { name: "imageCover", maxCount: 1 },
      { name: "images", maxCount: 5 },
    ]),
    validation(updateProductValidation),
    updateProduct
  )
  .delete(protectedRoutes,allowedTo("company"),validation(paramsIdValidation), deleteProduct);

export default ProductRoute;
