import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    createdBy: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Types.ObjectId, ref: 'Product', required: true },
  },
  { timestamps: true }
);

const commentModel = mongoose.model('Comment', commentSchema);
export default commentModel;
