import { z } from "zod";

/* ═══════════════════════════════════════════════
   Section Schema
   ═══════════════════════════════════════════════ */

const isoDatetimeSchema = z.string().datetime({ message: "Must be ISO 8601 datetime" });
const uuidSchema = z.string().uuid();
const hexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid 6-character hex color including #");

export const sectionSchema = z.object({
  id: uuidSchema,
  projectId: uuidSchema,
  name: z.string().min(1).max(120).trim(),
  sortOrder: z.number(),
  createdAt: isoDatetimeSchema,
  updatedAt: isoDatetimeSchema,
});

export type Section = z.infer<typeof sectionSchema>;

/* ═══════════════════════════════════════════════
   Project Schema
   ═══════════════════════════════════════════════ */

export const projectSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1).max(120).trim(),
  color: hexColorSchema,
  description: z.string().max(5000).nullable(),
  isArchived: z.boolean(),
  sortOrder: z.number(),
  createdAt: isoDatetimeSchema,
  updatedAt: isoDatetimeSchema,
});

export type Project = z.infer<typeof projectSchema>;
