import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(3, "Ürün başlığı en az 3 karakter olmalıdır"),
  brand: z.string().min(1, "Marka zorunludur"),
  category: z.string().min(1, "Kategori zorunludur"),
  price: z
    .number({ error: "Fiyat alanı zorunludur ve sayı olmalıdır" })
    .positive("Fiyat 0'dan büyük olmalıdır"),
  stock: z
    .number({ error: "Stok alanı zorunludur ve sayı olmalıdır" })
    .int("Stok tam sayı olmalıdır")
    .min(0, "Stok negatif olamaz"),
});

export type ProductFormValues = z.infer<typeof productSchema>;