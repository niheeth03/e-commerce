import mongoose from 'mongoose';

const advertiserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Advertiser = mongoose.models.Advertiser || mongoose.model('Advertiser', advertiserSchema);
export default Advertiser;