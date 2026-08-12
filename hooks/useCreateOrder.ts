"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { getUserMap, createOrder, NewOrderPayload } from "@/lib/orders";
import { searchProducts, getProducts, getCategoryList, Product } from "@/lib/products";
import { toaster } from "@/components/ui/toaster";

interface CartItem {
  product: Product;
  quantity: number;
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  const { data: userMap } = useQuery({
    queryKey: ["user-map"],
    queryFn: getUserMap,
    staleTime: 1000 * 60 * 5,
  });

  const customers = userMap ? Array.from(userMap.entries()).map(([id, name]) => ({ id, name })) : [];

  const [customerQuery, setCustomerQuery] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

  const filteredCustomers = useMemo(() => {
    const query = customerQuery.trim().toLowerCase();
    if (!query) return customers.slice(0, 8);
    return customers.filter((c) => c.name.toLowerCase().includes(query)).slice(0, 8);
  }, [customers, customerQuery]);

  const selectedCustomerName =
    customers.find((c) => c.id === selectedCustomerId)?.name ?? null;

  function handleCustomerQueryChange(value: string) {
    setCustomerQuery(value);
    setSelectedCustomerId(null);
  }

  function selectCustomer(id: number, name: string) {
    setSelectedCustomerId(id);
    setCustomerQuery(name);
  }

  function clearCustomer() {
    setSelectedCustomerId(null);
    setCustomerQuery("");
  }

  const { data: categories = [] } = useQuery({
    queryKey: ["category-list"],
    queryFn: getCategoryList,
    staleTime: 1000 * 60 * 10,
  });

  const [selectedCategory, setSelectedCategory] = useState("");

  const [productQuery, setProductQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const debouncedSetQuery = useDebouncedCallback((value: string) => setDebouncedQuery(value), 300);

  function handleProductQueryChange(value: string) {
    setProductQuery(value);
    debouncedSetQuery(value);
  }

  const isSearching = debouncedQuery.trim().length >= 2;

  const { data: searchResults, isLoading: isSearchLoading } = useQuery({
    queryKey: ["product-search", debouncedQuery],
    queryFn: () => searchProducts(debouncedQuery.trim()),
    enabled: isSearching,
  });

  const { data: categoryProducts, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["products-by-category", selectedCategory],
    queryFn: () => getProducts(0, 20, { category: selectedCategory }),
    enabled: Boolean(selectedCategory) && !isSearching,
  });

  const productOptions = useMemo(() => {
    if (isSearching) {
      const results = searchResults ?? [];
      if (selectedCategory) {
        return results.filter((p) => p.category === selectedCategory);
      }
      return results;
    }
    if (selectedCategory) {
      return categoryProducts?.products ?? [];
    }
    return [];
  }, [isSearching, searchResults, selectedCategory, categoryProducts]);

  const isLoadingProducts = isSearching ? isSearchLoading : isCategoryLoading;

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  function addProduct(product: Product) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setProductQuery("");
    setDebouncedQuery("");
  }

  function removeProduct(productId: number) {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  }

  function updateQuantity(productId: number, quantity: number) {
    if (quantity < 1) {
      removeProduct(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  }

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const createMutation = useMutation({
    mutationFn: (payload: NewOrderPayload) => createOrder(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["orders"] });
      const previousData = queryClient.getQueriesData({ queryKey: ["orders"] });

      const customerName = customers.find((c) => c.id === payload.userId)?.name ?? "Bilinmeyen Müşteri";
      const fakeOrder = {
        id: Date.now(),
        userId: payload.userId,
        customerName,
        status: "Pending" as const,
        products: cartItems.map((item) => ({
          id: item.product.id,
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
          total: item.product.price * item.quantity,
          thumbnail: item.product.thumbnail,
        })),
        total,
        discountedTotal: total,
        totalProducts: cartItems.length,
        totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      };

      queryClient.setQueriesData({ queryKey: ["orders"] }, (old: unknown) => {
        if (!old || typeof old !== "object" || !("orders" in old)) return old;
        const data = old as { orders: unknown[]; total: number };
        return { ...data, orders: [fakeOrder, ...data.orders], total: data.total + 1 };
      });

      return { previousData };
    },
    onError: (_err, _vars, context) => {
      const ctx = context as { previousData?: [unknown, unknown][] };
      ctx?.previousData?.forEach(([key, data]) => {
        queryClient.setQueryData(key as readonly unknown[], data);
      });
      toaster.create({ title: "Hata!", description: "Sipariş oluşturulamadı.", type: "error" });
    },
    onSuccess: () => {
      toaster.create({
        title: "Sipariş Oluşturuldu!",
        type: "success",
      });
      reset();
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });

  function submit(onSuccess?: () => void) {
    if (!selectedCustomerId || cartItems.length === 0) return;
    createMutation.mutate(
      {
        userId: selectedCustomerId,
        products: cartItems.map((item) => ({ id: item.product.id, quantity: item.quantity })),
      },
      { onSuccess: () => onSuccess?.() }
    );
  }

  function reset() {
    setSelectedCustomerId(null);
    setCustomerQuery("");
    setSelectedCategory("");
    setCartItems([]);
    setProductQuery("");
    setDebouncedQuery("");
  }

  return {
    customerQuery,
    handleCustomerQueryChange,
    filteredCustomers,
    selectCustomer,
    clearCustomer,
    selectedCustomerId,
    selectedCustomerName,
    categories,
    selectedCategory,
    setSelectedCategory,
    productQuery,
    handleProductQueryChange,
    productOptions,
    isLoadingProducts,
    isSearching,
    cartItems,
    addProduct,
    removeProduct,
    updateQuantity,
    total,
    submit,
    isSubmitting: createMutation.isPending,
    reset,
  };
}
