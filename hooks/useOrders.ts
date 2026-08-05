"use client";

import { useState } from "react";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { getOrders } from "@/lib/orders";

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

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders", skip, limit, search, statusFilter, minAmount, maxAmount],
    queryFn: () => getOrders(skip, limit, search), 
  });

  const { data: allData } = useQuery({
    queryKey: ["orders-all-metrics"],
    queryFn: () => getOrders(0, 500, null),
    staleTime: 1000 * 60 * 5,
  });

  const allOrdersList = allData?.orders ?? [];
  const totalRevenue = allOrdersList.reduce((acc, curr) => acc + curr.discountedTotal, 0);

  const pendingCount = allOrdersList.filter(o => o.status === "Pending").length;
  const inProgressCount = allOrdersList.filter(o => o.status === "In-Progress").length;
  const completedCount = allOrdersList.filter(o => o.status === "Completed").length;

  const filteredOrders = (data?.orders ?? []).filter((order) => {
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    const matchesMin = minAmount === "" || order.discountedTotal >= Number(minAmount);
    const matchesMax = maxAmount === "" || order.discountedTotal <= Number(maxAmount);
    return matchesStatus && matchesMin && matchesMax;
  });

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
    orders: filteredOrders,
    total: data?.total ?? 0,
    totalRevenue,
    pendingCount,
    inProgressCount,
    completedCount,
    isLoading,
    isError,
  };
}