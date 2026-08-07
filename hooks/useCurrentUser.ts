"use client";

import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { getCurrentUser } from "@/lib/auth";

export function useCurrentUser() {
  const hasToken = Boolean(Cookies.get("accessToken"));

  return useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    enabled: hasToken,
    staleTime: 1000 * 60 * 10,
  });
}