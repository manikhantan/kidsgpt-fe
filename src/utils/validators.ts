import { z } from 'zod';

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters');

export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be less than 20 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores');

export const parentRegisterSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const parentLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const kidLoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const createChildSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const updateChildSchema = z.object({
  name: nameSchema.optional(),
  password: passwordSchema.optional(),
});

export const contentRulesSchema = z.object({
  mode: z.enum(['allowlist', 'blocklist']),
  topics: z.array(z.string().min(1)),
  keywords: z.array(z.string().min(1)),
});

export const messageSchema = z.object({
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message is too long'),
});

export type ParentRegisterFormData = z.infer<typeof parentRegisterSchema>;
export type ParentLoginFormData = z.infer<typeof parentLoginSchema>;
export type KidLoginFormData = z.infer<typeof kidLoginSchema>;
export type CreateChildFormData = z.infer<typeof createChildSchema>;
export type UpdateChildFormData = z.infer<typeof updateChildSchema>;
export type ContentRulesFormData = z.infer<typeof contentRulesSchema>;
export type MessageFormData = z.infer<typeof messageSchema>;
