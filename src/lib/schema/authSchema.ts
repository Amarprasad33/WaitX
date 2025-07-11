import { z } from 'zod';

export const signupFormSchema  = z.object({
    name: z.string().min(2, 'Name is too short'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    vehicleBrand: z.string().nonempty('Select at least one vehicle brand'),
    vehicleModel: z.string().nonempty('Select at least one vehicle model'),
    // vehicleBrand: z.array(z.string()).nonempty('Select at least one vehicle brand'),
    // vehicleModel: z.array(z.string()).nonempty('Select at least one vehicle model'),
});

export type SignupSchemaType = z.infer<typeof signupFormSchema >;

export const signinFormSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type SigninSchemaType = z.infer<typeof signinFormSchema>;