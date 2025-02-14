import Joi from "joi";

export const visitValidation = Joi.object({
  member: Joi.string().min(3).max(50).empty("").required().messages({
    "string.base": "Email atau nomor anggota harus berupa teks.",
    "string.min": "Email atau nomor anggota minimal harus memiliki 3 karakter.",
    "string.max": "Email atau nomor anggota maksimal harus memiliki 255 karakter.",
    "any.required": "Email atau nomor anggota wajib diisi."
  }),
  activity: Joi.string().min(3).max(50).empty("").required().messages({
    "string.base": "Kegiatan harus berupa teks.",
    "string.min": "Kegiatan minimal harus memiliki 3 karakter.",
    "string.max": "Kegiatan maksimal harus memiliki 255 karakter.",
    "any.required": "Kegiatan wajib diisi."
  }),
});
