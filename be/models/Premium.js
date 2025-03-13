const mongoose = require('mongoose');

const PremiumPackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Package name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Package description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Package price is required'],
    min: [0, 'Price cannot be negative'],
  },
  durationDays: {
    type: Number,
    required: [true, 'Package duration is required'],
    min: [1, 'Duration must be at least 1 day'],
  },
  features: {
    type: [String], // Danh sách các quyền lợi của gói
    required: [true, 'Package features are required'],
  },
  isActive: {
    type: Boolean,
    default: true, // Gói có đang hoạt động hay không
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account', // Tham chiếu đến admin tạo gói
    required: true,
  },
}, { timestamps: true });

const PremiumPackage = mongoose.model('PremiumPackage', PremiumPackageSchema);
module.exports = PremiumPackage;