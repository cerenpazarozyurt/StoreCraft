"use client";

import {useEffect} from "react";
import {api} from "@/lib/api";

interface Product {
  id: number;
  title: string;
  price: number;
}

interface ProductsResponse {
  products: Product[];
  total: number;
}

export default function Home() {
  useEffect(() => {
    async function testApi() {
      try {
        const data = await api.get<ProductsResponse>("/products/9999");
        console.log("API Response:", data);
      } catch (error) {
        console.error("API Error:", error);
      }
    }
    testApi();
  }, []);

  return <div>Api test ediliyor</div>
}
