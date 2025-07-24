const Joi = require('joi');
const mongoose = require('mongoose');
const { generate: uniqueId } = require('shortid');

const register = async (req, res, { userModel }) => {
  const UserModel = mongoose.model(userModel);
  const UserPasswordModel = mongoose.model(userModel + 'Password');

  // Validation schema
  const objectSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({ tlds: { allow: true } }).required(),
    password: Joi.string().min(6).required(),
    country: Joi.string().optional(),
    phone: Joi.string().optional(),
    address: Joi.string().optional(),
  });

  const { error, value } = objectSchema.validate(req.body);
  if (error) {
    return res.status(409).json({
      success: false,
      result: null,
      error: error,
      message: 'Invalid/Missing credentials.',
      errorMessage: error.message,
    });
  }

  // Check if user already exists
  const existingUser = await UserModel.findOne({ email: value.email, removed: false });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      result: null,
      message: 'Email is already registered.',
    });
  }

  // Create user
  let userData = {
    name: value.name,
    email: value.email,
    country: value.country,
    phone: value.phone,
    address: value.address,
    enabled: true,
    removed: false,
  };
  // For Admin, set role
  if (userModel === 'Admin') {
    userData.role = 'admin';
  }
  const user = await new UserModel(userData).save();

  // Hash password
  const salt = uniqueId();
  const passwordHash = new UserPasswordModel().generateHash(salt, value.password);
  const passwordData = {
    password: passwordHash,
    salt: salt,
    user: user._id,
    emailVerified: true,
  };
  await new UserPasswordModel(passwordData).save();

  return res.status(200).json({
    success: true,
    result: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    message: 'Registration successful',
  });
};

module.exports = register; 