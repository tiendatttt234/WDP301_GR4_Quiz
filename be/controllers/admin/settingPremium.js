const PremiumPackage = require('../../models/Premium');
const createError = require('http-errors');

// Tạo gói premium mới (chỉ admin)
async function createPremiumPackage(req, res, next) {
  try {
    const userId = req.payload.user.id; // Lấy userId từ payload của token
    const { name, description, price, durationDays, features, isActive } = req.body;

    // Tạo gói premium mới
    const newPackage = new PremiumPackage({
      name,
      description,
      price,
      durationDays,
      features,
      isActive,
      createdBy: userId,
    });

    // Lưu vào cơ sở dữ liệu
    const savedPackage = await newPackage.save();
    return res.status(201).json(savedPackage);
  } catch (error) {
    return next(createError(500, error.message));
  }
}

// Lấy danh sách tất cả gói premium (chỉ admin)
async function getAllPremiumPackages(req, res, next) {
  try {
    const packages = await PremiumPackage.find().populate('createdBy', 'userName email');
    return res.json(packages);
  } catch (error) {
    return next(createError(500, error.message));
  }
}

// Lấy thông tin chi tiết một gói (chỉ admin)
async function getPremiumPackageById(req, res, next) {
  try {
    const package = await PremiumPackage.findById(req.params.id).populate('createdBy', 'userName email');
    if (!package) {
      return next(createError(404, 'Package not found'));
    }
    return res.json(package);
  } catch (error) {
    return next(createError(500, error.message));
  }
}

// Cập nhật thông tin một gói (chỉ admin)
async function updatePremiumPackage(req, res, next) {
  try {
    const { name, description, price, durationDays, features, isActive } = req.body;

    const updatedPackage = await PremiumPackage.findByIdAndUpdate(
      req.params.id,
      { name, description, price, durationDays, features, isActive, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedPackage) {
      return next(createError(404, 'Package not found'));
    }
    return res.json(updatedPackage);
  } catch (error) {
    return next(createError(500, error.message));
  }
}

// Xóa một gói (chỉ admin)
async function deletePremiumPackage(req, res, next) {
  try {
    const deletedPackage = await PremiumPackage.findByIdAndDelete(req.params.id);
    if (!deletedPackage) {
      return next(createError(404, 'Package not found'));
    }
    return res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    return next(createError(500, error.message));
  }
}

// Lấy danh sách gói premium đang hoạt động (cho người dùng)
async function getActivePremiumPackages(req, res, next) {
  try {
    const packages = await PremiumPackage.find({ isActive: true });
    return res.json(packages);
  } catch (error) {
    return next(createError(500, error.message));
  }
}

// Lấy thông tin chi tiết một gói đang hoạt động (cho người dùng)
async function getActivePremiumPackageById(req, res, next) {
  try {
    const package = await PremiumPackage.findOne({ _id: req.params.id, isActive: true });
    if (!package) {
      return next(createError(404, 'Package not found or inactive'));
    }
    return res.json(package);
  } catch (error) {
    return next(createError(500, error.message));
  }
}

module.exports = {
  createPremiumPackage,
  getAllPremiumPackages,
  getPremiumPackageById,
  updatePremiumPackage,
  deletePremiumPackage,
  getActivePremiumPackages,
  getActivePremiumPackageById,
};