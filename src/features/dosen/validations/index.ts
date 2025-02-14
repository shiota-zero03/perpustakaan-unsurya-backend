import Joi from "joi";

export const storeValidation = Joi.object({
  profilePicture: Joi.string().empty("").allow(null).optional().messages({
    "string.base": "Foto profil tidak valid.",
  }),
  name: Joi.string().min(3).max(255).empty("").required().messages({
    "string.base": "Nama tidak valid.",
    "string.min": "Nama minimal harus memiliki 3 karakter.",
    "string.max": "Nama maksimal harus memiliki 255 karakter.",
    "any.required": "Nama wajib diisi."
  }),
  nidn: Joi.string().min(3).max(255).empty("").required().messages({
    "string.base": "NIDN tidak valid.",
    "string.min": "NIDN minimal harus memiliki 3 karakter.",
    "string.max": "NIDN maksimal harus memiliki 255 karakter.",
    "any.required": "NIDN wajib diisi."
  }),
  gender: Joi.string().valid("L", "P", "N").empty("").required().messages({
    "string.base": "Jenis kelamin tidak valid.",
    "any.only": "Jenis kelamin harus di antara Laki - Laki atau Perempuan.",
    "any.required": "Jenis kelamin wajib diisi."
  }),
  phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/).empty("").required().messages({
    "string.base": "Nomor telepon tidak valid.",
    "string.pattern.base": "Nomor telepon tidak valid. Harus terdiri dari 10-15 digit.",
    "any.required": "Nomor telepon wajib diisi."
  }),
  email: Joi.string().email().max(255).empty("").required().messages({
    "string.base": "Email tidak valid.",
    "string.email": "Email harus berupa alamat email yang valid.",
    "string.max": "Email maksimal harus memiliki 255 karakter.",
    "any.required": "Email wajib diisi."
  }),
  password: Joi.string().min(6).max(255).empty("").required().messages({
    "string.base": "Password tidak valid.",
    "string.min": "Password minimal harus memiliki 6 karakter.",
    "string.max": "Password maksimal harus memiliki 255 karakter.",
    "any.required": "Password wajib diisi."
  }),
  status: Joi.string().valid("Active", "InActive").empty("").required().messages({
    "string.base": "Status tidak valid.",
    "any.only": "Status harus di antara 'Active' atau 'InActive'.",
    "any.required": "Status wajib diisi."
  }),
  validUntil: Joi.date().greater("now").empty("").required().messages({
    "date.base": "Masa berlaku tidak valid",
    "date.greater": "Masa berlaku harus lebih dari tanggal sekarang.",
    "any.required": "Masa berlaku wajib diisi."
  }),
});

export const updateValidation = Joi.object({
  profilePicture: Joi.string().empty("").allow(null).optional().messages({
    "string.base": "Foto profil tidak valid.",
  }),
  password: Joi.string().min(6).max(255).allow(null).optional().empty("").messages({
    "string.min": "Password minimal harus memiliki 6 karakter.",
    "string.max": "Password maksimal harus memiliki 255 karakter.",
  }),
  name: Joi.string().min(3).max(255).empty("").required().messages({
    "string.base": "Nama tidak valid.",
    "string.min": "Nama minimal harus memiliki 3 karakter.",
    "string.max": "Nama maksimal harus memiliki 255 karakter.",
    "any.required": "Nama wajib diisi."
  }),
  nidn: Joi.string().min(3).max(255).empty("").required().messages({
    "string.base": "NIDN tidak valid.",
    "string.min": "NIDN minimal harus memiliki 3 karakter.",
    "string.max": "NIDN maksimal harus memiliki 255 karakter.",
    "any.required": "NIDN wajib diisi."
  }),
  gender: Joi.string().valid("L", "P", "N").empty("").required().messages({
    "string.base": "Jenis kelamin tidak valid.",
    "any.only": "Jenis kelamin harus di antara Laki - Laki atau Perempuan.",
    "any.required": "Jenis kelamin wajib diisi."
  }),
  phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/).empty("").required().messages({
    "string.base": "Nomor telepon tidak valid.",
    "string.pattern.base": "Nomor telepon tidak valid. Harus terdiri dari 10-15 digit.",
    "any.required": "Nomor telepon wajib diisi."
  }),
  email: Joi.string().email().max(255).empty("").required().messages({
    "string.base": "Email tidak valid.",
    "string.email": "Email harus berupa alamat email yang valid.",
    "string.max": "Email maksimal harus memiliki 255 karakter.",
    "any.required": "Email wajib diisi."
  }),
  status: Joi.string().valid("Active", "InActive").empty("").required().messages({
    "string.base": "Status tidak valid.",
    "any.only": "Status harus di antara 'Active' atau 'InActive'.",
    "any.required": "Status wajib diisi."
  }),
  validUntil: Joi.date().greater("now").empty("").required().messages({
    "date.base": "Masa berlaku tidak valid",
    "date.greater": "Masa berlaku harus lebih dari tanggal sekarang.",
    "any.required": "Masa berlaku wajib diisi."
  }),
});
