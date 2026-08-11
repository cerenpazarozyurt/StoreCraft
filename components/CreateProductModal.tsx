"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { productSchema, ProductFormValues } from "@/lib/validations/product";
import { getCategoryList, NewProduct, Product } from "@/lib/products";
import { getCategoryLabel } from "@/lib/categoryLabels";
import { Button, Input, VStack, Field, Dialog, Portal } from "@chakra-ui/react";

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitData: (data: NewProduct, options?: { onSuccess?: () => void }) => void;
  isPending: boolean;
  productToEdit?: Product | null; 
}

export function CreateProductModal({
  isOpen,
  onClose,
  onSubmitData,
  isPending,
  productToEdit,
}: CreateProductModalProps) {
  const { data: categories } = useQuery({
    queryKey: ["category-list"],
    queryFn: getCategoryList,
    staleTime: 1000 * 60 * 10,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (productToEdit) {
      reset({
        title: productToEdit.title,
        brand: productToEdit.brand,
        category: productToEdit.category,
        price: productToEdit.price,
        stock: productToEdit.stock,
      });
    } else {
      reset({
        title: "",
        brand: "",
        category: "",
        price: 0,
        stock: 0,
      });
    }
  }, [productToEdit, reset]);

  const onFormSubmit = (data: ProductFormValues) => {
    onSubmitData(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(details) => !details.open && onClose()} placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="bg.surface" maxW="500px">
            <Dialog.Header>
              <Dialog.Title color="text.primary">
                {productToEdit ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
              </Dialog.Title>
            </Dialog.Header>

            <form onSubmit={handleSubmit(onFormSubmit)}>
              <Dialog.Body>
                <VStack gap="4" align="stretch">
                  <Field.Root invalid={!!errors.title}>
                    <Field.Label>Ürün Adı</Field.Label>
                    <Input {...register("title")} placeholder="Örn: iPhone 14 Pro" />
                    <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={!!errors.brand}>
                    <Field.Label>Marka</Field.Label>
                    <Input {...register("brand")} placeholder="Örn: Apple" />
                    <Field.ErrorText>{errors.brand?.message}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={!!errors.category}>
                    <Field.Label>Kategori</Field.Label>
                    <select
                      {...register("category")}
                      style={{
                        width: "100%",
                        height: "40px",
                        padding: "0 12px",
                        borderRadius: "6px",
                        border: "1px solid #CBD5E0",
                        backgroundColor: "var(--chakra-colors-bg-surface, #ffffff)",
                        color: "var(--chakra-colors-text-primary, #1B2A4A)",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    >
                      <option value="" disabled>
                        Kategori seçin
                      </option>
                      {categories?.map((cat) => (
                        <option key={cat} value={cat}>
                          {getCategoryLabel(cat)}
                        </option>
                      ))}
                    </select>
                    <Field.ErrorText>{errors.category?.message}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={!!errors.price}>
                    <Field.Label>Fiyat ($)</Field.Label>
                    <Input type="number" step="any" {...register("price", { valueAsNumber: true })} placeholder="999" />
                    <Field.ErrorText>{errors.price?.message}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={!!errors.stock}>
                    <Field.Label>Stok Adedi</Field.Label>
                    <Input type="number" {...register("stock", { valueAsNumber: true })} placeholder="50" />
                    <Field.ErrorText>{errors.stock?.message}</Field.ErrorText>
                  </Field.Root>
                </VStack>
              </Dialog.Body>

              <Dialog.Footer>
                <Button variant="outline" onClick={onClose} type="button">
                  İptal
                </Button>
                <Button colorPalette="blue" type="submit" loading={isPending}>
                  {productToEdit ? "Değişiklikleri Kaydet" : "Ekle"}
                </Button>
              </Dialog.Footer>
            </form>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}