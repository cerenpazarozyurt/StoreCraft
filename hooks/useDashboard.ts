"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getAllOrders, getUserMap } from "@/lib/orders";
import {
  getAllProducts,
  getCategoryComparison,
  getCriticalStockCount,
  getBrandSales,
  getTopSellingProducts,
} from "@/lib/dashboard";

async function getCategoryList(): Promise<string[]> {
  return api.get<string[]>("/products/category-list");
}

export function useDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  //sipariş veren kullanıcı id si ile isimleri eşleştiren map i çeker
  const { data: userMap } = useQuery({
    queryKey: ["user-map"],
    queryFn: getUserMap,
    staleTime: 1000 * 60 * 5,
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["all-products"],
    queryFn: getAllProducts,
    staleTime: 1000 * 60 * 5,
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["all-orders-dashboard", Boolean(userMap)],
    queryFn: () => getAllOrders(userMap!),
    enabled: Boolean(userMap),
    staleTime: 1000 * 60 * 5,
  });

  const { data: categories } = useQuery({
    queryKey: ["category-list"],
    queryFn: getCategoryList,
    staleTime: 1000 * 60 * 10,
  });

  //pasta grafiği için marka satışlarını hesaplar
  const brandStats = useMemo(() => {  //useMemo sonucu hafızada tutar değişmedikçe tekrar hesaplamaz.
    if (!orders || !products) return [];
    return getBrandSales(orders, products, selectedCategory);
  }, [orders, products, selectedCategory]);

  const categoryComparison = products ? getCategoryComparison(products) : []; //kategori - stok grafiğinin verisini üretir.
  const criticalStockCount = products ? getCriticalStockCount(products) : 0;
  const topProducts = orders && products ? getTopSellingProducts(orders, products) : []; //en çok satılan ürünleri listeler.

  const totalRevenue = orders?.reduce((sum, o) => sum + o.discountedTotal, 0) ?? 0;
  const totalSold = orders?.reduce((sum, o) => sum + o.totalQuantity, 0) ?? 0;
  const avgCartValue = orders && orders.length > 0 ? totalRevenue / orders.length : 0;

  return {
    categoryComparison,
    criticalStockCount,
    totalRevenue,
    totalSold,
    avgCartValue,
    brandStats,
    categories: categories ?? [],
    orders: orders ?? [],
    products: products ?? [],
    topProducts,
    selectedCategory,
    setSelectedCategory,
    isLoading: productsLoading || ordersLoading,
  };
}