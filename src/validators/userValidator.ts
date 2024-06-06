import Joi from "joi";

const userRegisterSchema = Joi.object({
  firstName: Joi.string().alphanum().min(3).max(30).required(),
  lastName: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  confirmPassword: Joi.any().valid(Joi.ref("password")).required(),
});

export default userRegisterSchema;

export const tagSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
});

export const tagUpdateSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
});

export const postCreateSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required(),
});

export const bookCreateSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
});

export const bookUpdateSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
});
