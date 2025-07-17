import z from "zod";

export const createTourZodSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    location: z.string().optional(),
    costForm: z.number().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    tourType: z.string(),
    included: z.array(z.string()).optional(),
    excluded: z.array(z.string()).optional(),
    amenities: z.array(z.string()).optional(),
    tourPlan: z.array(z.string()).optional(),
    maxGuest: z.number().optional(),
    minAge: z.number().optional(),
    division: z.string()
})

export const updateTourZodSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    costForm: z.number().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    tourType: z.string().optional(),
    included: z.array(z.string()).optional(),
    excluded: z.array(z.string()).optional(),
    amenities: z.array(z.string()).optional(),
    tourPlan: z.array(z.string()).optional(),
    maxGuest: z.number().optional(),
    minAge: z.number().optional(),
    division: z.string().optional(),
})

export const createTourTypeZodSchema = z.object({
    name: z.string().min(1, 'Name cannot be empty'),
})

export const updateTourTypeZodSchema = z.object({
    name: z.string().optional(),
})
