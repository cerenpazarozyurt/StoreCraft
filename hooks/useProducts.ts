"use client";

import { useQueryState, parseAsInteger, parseAsString, parseAsBoolean } from "nuqs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { getProducts, createProduct, deleteProduct, updateProduct, NewProduct, Product, ProductFilters } from "@/lib/products";
import { toaster } from "@/components/ui/toaster";

export function useProducts() {
  const queryClient = useQueryClient();
  const [skip, setSkip] = useQueryState("skip", parseAsInteger.withDefault(0));
  const [limit, setLimit] = useQueryState("limit", parseAsInteger.withDefault(10));
  
  // nuqs
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));
  const [category, setCategory] = useQueryState("category", parseAsString.withDefault(""));
  const [minPrice, setMinPrice] = useQueryState("minPrice", parseAsString.withDefault(""));
  const [maxPrice, setMaxPrice] = useQueryState("maxPrice", parseAsString.withDefault(""));
  const [inStockOnly, setInStockOnly] = useQueryState("inStockOnly", parseAsBoolean.withDefault(false));

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setSkip(0);
  }, 400);

  // Filtreler değiştiğinde sayfalamayı başa sarmak için yardımcı setter'lar:
  const handleCategoryChange = (val: string) => { 
    setCategory(val || null); //kullanıcının seçtiği kategoriyi url e kaydeder
    setSkip(0);
  };

  const handleMinPriceChange = (val: string) => {
    setMinPrice(val || null); 
    setSkip(0);
  };

  const handleMaxPriceChange = (val: string) => {
    setMaxPrice(val || null);
    setSkip(0);
  };

  const handleStockChange = (val: boolean) => {
    setInStockOnly(val ? true : null);
    setSkip(0);
  };

  // Aktif filtreleri bir araya getiriyoruz
  const filters: ProductFilters = {
    search: search || undefined,
    category: category || undefined,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
    inStockOnly: inStockOnly || undefined,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", skip, limit, filters],
    queryFn: () => getProducts(skip, limit, filters),
  });

  function optimisticUpdate(updater: (old: any) => any) {
    return async () => {
      await queryClient.cancelQueries({ queryKey: ["products"] }); //products a sahip o an arkada çalışan başka bir veri çekme isteiği varsa iptal
      const previousData = queryClient.getQueriesData({ queryKey: ["products"] }); //mevcut önbelleği hafızada saklar
      queryClient.setQueriesData({ queryKey: ["products"] }, updater);
      return { previousData };
    };
  }

  //internet kopsa, sunucu hatası olsa vs eski haline döndürmek için
  function rollback(context: unknown) {
    const ctx = context as { previousData?: [unknown, unknown][] };
    ctx?.previousData?.forEach(([queryKey, data]) => {
      queryClient.setQueryData(queryKey as any, data);
    });
  }

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onMutate: (deletedId) =>
      optimisticUpdate((old) => {
        if (!old) return old;
        return {
          ...old,
          products: old.products.filter((p: Product) => p.id !== deletedId),
          total: old.total - 1,
        };
      })(),
    onError: (_error, _variables, context) => {
      rollback(context);
      toaster.create({ title: "Hata!", description: "Ürün silinemedi.", type: "error" });
    },
    onSuccess: () => {
      toaster.create({ title: "Başarılı!", description: "Ürün silindi.", type: "success" });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const createMutation = useMutation({
    mutationFn: (newProduct: NewProduct) => createProduct(newProduct),
    onMutate: (newProduct) =>
      optimisticUpdate((old) => {
        if (!old) return old;
        const fakeProduct = { ...newProduct, id: Date.now(), thumbnail: "" };
        return {
          ...old,
          products: [fakeProduct, ...old.products],
          total: old.total + 1,
        };
      })(),
    onError: (_error, _variables, context) => {
      rollback(context);
      toaster.create({ title: "Hata!", description: "Ürün eklenemedi.", type: "error" });
    },
    onSuccess: () => {
      toaster.create({ title: "Başarılı!", description: "Ürün eklendi.", type: "success" });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const updateMutation = useMutation({
      mutationFn: ({ id, data }: { id: number; data: Partial<NewProduct> }) => 
        updateProduct(id, data),
      onSuccess: () => {
        toaster.create({ 
          title: "Başarılı!", 
          description: "Ürün güncellendi.", 
          type: "success" 
        });
      },
      onError: () => {
        toaster.create({ 
          title: "Hata!", 
          description: "Ürün güncellenemedi.", 
          type: "error" 
        });
      },
      onSettled: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
    });

  return {
    products: data?.products ?? [],
    total: data?.total ?? 0,
    skip,
    setSkip,
    limit,
    setLimit,
    search,
    setSearch: debouncedSetSearch,
    category,
    setCategory: handleCategoryChange,
    minPrice,
    setMinPrice: handleMinPriceChange,
    maxPrice,
    setMaxPrice: handleMaxPriceChange,
    inStockOnly,
    setInStockOnly: handleStockChange,
    isLoading,
    isError,
    deleteProduct: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    createProduct: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateProduct: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
}