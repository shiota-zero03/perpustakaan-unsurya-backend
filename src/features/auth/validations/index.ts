import Joi from "joi";

export const registerValidation = Joi.object({
  name: Joi.string().min(3).max(255).empty("").required().messages({
    "string.base": "Nama harus berupa teks.",
    "string.min": "Nama minimal harus memiliki 3 karakter.",
    "string.max": "Nama maksimal harus memiliki 255 karakter.",
    "any.required": "Nama wajib diisi."
  }),
  identityNumber: Joi.string().min(3).max(255).empty("").required().messages({
    "string.base": "Nomor identitas harus berupa teks.",
    "string.min": "Nomor identitas minimal harus memiliki 3 karakter.",
    "string.max": "Nomor identitas maksimal harus memiliki 255 karakter.",
    "any.required": "Nomor identitas wajib diisi."
  }),
  email: Joi.string().email().max(255).empty("").required().messages({
    "string.email": "Email harus berupa alamat email yang valid.",
    "string.max": "Email maksimal harus memiliki 255 karakter.",
    "any.required": "Email wajib diisi."
  }),
  password: Joi.string().min(6).max(255).empty("").required().messages({
    "string.base": "Password harus berupa teks.",
    "string.min": "Password minimal harus memiliki 6 karakter.",
    "string.max": "Password maksimal harus memiliki 255 karakter.",
    "any.required": "Password wajib diisi."
  }),
  accountType: Joi.string().valid("Teacher", "Student").empty("").required().messages({
    "any.only": "Tipe akun harus diantara 'F' atau 'Student'.",
    "any.required": "Tipe akun wajib diisi."
  }),
});

export const loginValidation = Joi.object({
  email: Joi.string().email().max(255).empty("").required().messages({
    "string.email": "Email harus berupa alamat email yang valid.",
    "string.max": "Email maksimal harus memiliki 255 karakter.",
    "any.required": "Email wajib diisi."
  }),
  password: Joi.string().min(6).max(255).empty("").required().messages({
    "string.min": "Password minimal harus memiliki 6 karakter.",
    "string.max": "Password maksimal harus memiliki 255 karakter.",
    "any.required": "Password wajib diisi."
  })
});

export const refreshValidation = Joi.object({
  refreshToken: Joi.string().empty("").required().messages({
    "string.base": "Refresh token harus berupa teks.",
    "string.min": "Refresh token minimal harus memiliki 6 karakter.",
    "any.required": "Refresh token wajib diisi."
  }),
});

export const forgotValidation = Joi.object({
  email: Joi.string().email().max(255).empty("").required().messages({
    "string.email": "Email harus berupa alamat email yang valid.",
    "string.max": "Email maksimal harus memiliki 255 karakter.",
    "any.required": "Email wajib diisi."
  })
});

export const resetValidation = Joi.object({
  email: Joi.string().email().max(255).empty("").required().messages({
    "string.email": "Email harus berupa alamat email yang valid.",
    "string.max": "Email maksimal harus memiliki 255 karakter.",
    "any.required": "Email wajib diisi."
  }),
  token: Joi.string().max(255).empty("").required().messages({
    "string.max": "Token maksimal harus memiliki 255 karakter.",
    "any.required": "Token wajib diisi."
  }),
  new_password: Joi.string().min(6).max(255).empty("").required().messages({
    "string.min": "Password baru minimal harus memiliki 6 karakter.",
    "string.max": "Password baru maksimal harus memiliki 255 karakter.",
    "any.required": "Password baru wajib diisi."
  }),
  confirmation_password: Joi.string().min(6).max(255).empty("").required().messages({
    "string.min": "Konfirmasi password baru minimal harus memiliki 6 karakter.",
    "string.max": "Konfirmasi password baru maksimal harus memiliki 255 karakter.",
    "any.required": "Konfirmasi password baru wajib diisi."
  }),
});
