"use client"

import { ChakraProvider } from "@chakra-ui/react"
import { system } from "@/lib/theme"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export function Provider(props: ColorModeProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, 
            refetchOnWindowFocus: false, 
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
        <ColorModeProvider {...props} />
      </ChakraProvider>
    </QueryClientProvider>
  )
}