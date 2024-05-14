import mongoose from 'mongoose'


const reviewSchema = new mongoose.Schema({

  text:{
    type:String,
    trim:true,
    required:true,
    min:[2,"too short review text"]
  }, 
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Product"
  },
  rate:{
    type:Number,
    min:0,
    max:5
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required:true
  }

},{timestamps:true})


reviewSchema.pre(/^find/,function(){
  this.populate('user','name')
})

const reviewModel = mongoose.model("Review",reviewSchema)
export default reviewModel