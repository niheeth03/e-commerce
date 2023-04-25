import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderId:  { type:String, required: true },
    userEmail: { type: String, required: true },
    product:{
        itemName: { type: String, required: true },
        quantity: { type: Number, required: true },
        itemId:{ type: String, required: true },
      },
    address: {
      fullName: { type: String, required: true },
      houseNo: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    selectedPaymentMethod: { type: String, required: true },
    isDelivered: { type: Boolean, required: true, default: false },
    paidAt: { type: Date,required:true },
    deliveredAt: { type: Date,required:true},
    returnDeadline: {type :Date , required:true},
    isReturned : { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);
orderSchema.pre('save', function(next) {
  const deliver = new Date(this.deliveredAt);
  const now =new Date();
  if (this.isModified('deliveredAt') && deliver<=now) {
    this.isDelivered = true;
  }
  next();
});
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;