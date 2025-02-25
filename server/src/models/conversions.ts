import { z } from "zod";
import { ObjectId } from "mongodb";

export const conversionsSchema = z.object({
  id: z.instanceof(ObjectId).optional(),
  initialValue: z.number().min(0.01, "Initial value must be at least 1"),
  initialUnit: z.string().min(2, "Initial unit must be at least 2 characters long"),
  resultValue: z.number().min(0.01, "Result value must be at least 1"),
  resultUnit: z.string().min(2, "Result unit must be at least 2 characters long"),
  createdAt: z.date().optional().default(new Date()),
});

export type Conversions = z.infer<typeof conversionsSchema>;
