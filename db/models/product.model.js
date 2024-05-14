import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: [2, "title is too short"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      minLength: [2, "title is too short"],
    },
    imageCover: {
      type: String,
    },
    images: [String],
    price: {
      type: Number,
      min: 0,
      default: 0,
    },
    imageCoverPublicId:{
      type:String,
      unique:true,
      required:true
    },
    imagesPublicIds:[{
      type:String,
      unique:true,
      required:true
    }],
    priceAfterDiscount: {
      type: Number,
      min: 0,
    },
    quantity: {
      type: Number,
      min: 0,
      default: 0,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
      type: mongoose.Types.ObjectId,
      ref: "subCategory",
      // required: true,
    },
    rateCount: Number,
    rateAvg: {
      type: Number,
      min: 0,
      max: 5,
    },
    brand: {
      type: mongoose.Types.ObjectId,
      ref: "Brand",
      required: true,
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required:true
    },
  },
  { timestamps: true }
);

// productSchema.post("init", function (doc) {
//   doc.imageCover = process.env.BASE_URL + "uploads/" + doc.imageCover;
  
//   if(doc.images)doc.images = doc.images.map(
//     (image) => process.env.BASE_URL + "uploads/" + image
//   );
// });

// productSchema.virtual("myReviews", {
//   ref: "Review",
//   localField: "_id",
//   foreignField: "Product",
// });

// productSchema.pre("findOne", function () {
//   this.populate("myReviews");
// });

const productModel = mongoose.model("Product", productSchema);
export default productModel;
