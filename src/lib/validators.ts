import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Phone required").optional(),
  password: z.string().min(6, "Minimum 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  longDescription: z.string().optional(),
  price: z.number().int().positive(),
  compareAtPrice: z.number().int().positive().optional(),
  categoryId: z.string().min(1),
  type: z.enum(["PAINTING", "SAREE"]),
  motifKey: z.string().min(1),
  stock: z.number().int().nonnegative(),
  featured: z.boolean().optional(),
  customizable: z.boolean().optional(),
  artistNote: z.string().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

export const checkoutSchema = z.object({
  shippingName: z.string().min(2),
  shippingAddress: z.string().min(8),
  shippingCity: z.string().min(2),
  shippingState: z.string().min(2),
  shippingPincode: z.string().min(6).max(6),
  phone: z.string().min(10),
  notes: z.string().optional(),
});

export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3),
  body: z.string().min(10),
});

export const messageSchema = z.object({
  conversationId: z.string().optional(),
  subject: z.string().optional(),
  body: z.string().min(1),
});

export const customizationSchema = z.object({
  sizeId: z.string().optional(),
  frameId: z.string().optional(),
  paletteId: z.string().optional(),
  borderId: z.string().optional(),
  sareeBorderId: z.string().optional(),
  dedication: z.string().max(120).optional(),
  customNotes: z.string().max(800).optional(),
  referenceImageUrl: z.string().optional(),
  playMotif: z.string().optional(),
});
