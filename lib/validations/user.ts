import { z } from "zod";

export const userProfileSchema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  phone: z.string().optional(),
  age: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

export type UserProfileFormValues = z.infer<typeof userProfileSchema>;