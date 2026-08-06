"use client";

import { useState } from "react";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { getOrders, getUserMap, getAllOrders } from "@/lib/orders";

export function useOrders() {
  const [search, setSearch] = useQueryState("search");
  const [statusFilter, setStatusFilter] = useQueryState("status", parseAsString.withDefault("All"));
  const [minAmount, setMinAmount] = useQueryState("minAmount", parseAsString.withDefault(""));
  const [maxAmount, setMaxAmount] = useQueryState("maxAmount", parseAsString.withDefault(""));

  const [skip, setSkip] = useQueryState("skip", parseAsInteger.withDefault(0));
  const [limit, setLimit] = useQueryState("limit", parseAsInteger.withDefault(10));

  const [inputValue, setInputValue] = useState(search ?? "");

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setSearch(value || null);
    setSkip(0);
  }, 400);

  function handleSearchChange(value: string) {
    setInputValue(value);
    debouncedSetSearch(value);
  }

  //userMap kendi useQuery'sinde, tek sefer çekilip 5 dakika cache'de kalıyor
  const { data: userMap } = useQuery({
    queryKey: ["user-map"],
    queryFn: getUserMap,
    staleTime: 1000 * 60 * 5,
  });

  //değer aynıysa aynı, değer değiştiyse yeni istek
  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders", skip, limit, search, statusFilter, minAmount, maxAmount, Boolean(userMap)],
    queryFn: () =>
      getOrders(skip, limit, userMap!, {
        search,
        status: statusFilter,
        minAmount,
        maxAmount,
      }),
    enabled: Boolean(userMap),
  });

  //sayfanın üstündeki kartları yapıları için her zaman tüm siparişleri getirmek için;
  const { data: allOrders } = useQuery({
    queryKey: ["orders-all-metrics", Boolean(userMap)],
    queryFn: () => getAllOrders(userMap!),
    enabled: Boolean(userMap),
    staleTime: 1000 * 60 * 5,
  });

  const allOrdersList = allOrders ?? [];
  const totalRevenue = allOrdersList.reduce((acc, curr) => acc + curr.discountedTotal, 0);
  const pendingCount = allOrdersList.filter((o) => o.status === "Pending").length;
  const inProgressCount = allOrdersList.filter((o) => o.status === "In-Progress").length;
  const completedCount = allOrdersList.filter((o) => o.status === "Completed").length;

  return {
    inputValue,
    handleSearchChange,
    skip,
    setSkip,
    limit,
    setLimit,
    statusFilter,
    setStatusFilter,
    minAmount,
    setMinAmount,
    maxAmount,
    setMaxAmount,
    orders: data?.orders ?? [],
    total: data?.total ?? 0,
    totalRevenue,
    pendingCount,
    inProgressCount,
    completedCount,
    isLoading,
    isError,
  };
}