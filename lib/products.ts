import { api } from "@/lib/api";

export interface Product {
  id: number;
  title: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  thumbnail: string;
}

interface ProductsResponse {
  products: Product[];
  total: number;
}

export async function getCategoryList(): Promise<string[]> {
  return api.get<string[]>("/products/category-list");
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  inStockOnly?: boolean;
}

//herhangi bir filte seçili mi değil mi
function hasActiveProductFilters(filters: ProductFilters): boolean {
  return Boolean(
    filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.inStockOnly
  );
}

//filtreleme
function applyProductFilters(products: Product[], filters: ProductFilters): Product[] {
  return products.filter((product) => {
    const matchesSearch = !filters.search || product.title.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = !filters.category || product.category === filters.category;
    const matchesMin = !filters.minPrice || product.price >= Number(filters.minPrice);
    const matchesMax = !filters.maxPrice || product.price <= Number(filters.maxPrice);
    const matchesStock = !filters.inStockOnly || product.stock > 0;
    return matchesSearch && matchesCategory && matchesMin && matchesMax && matchesStock;
  });
}

export async function getProducts(
  skip: number,
  limit: number,
  filters: ProductFilters = {}
): Promise<{ products: Product[]; total: number }> {
  if (hasActiveProductFilters(filters)) {
    const data = await api.get<ProductsResponse>(`/products?limit=0`);
    const filtered = applyProductFilters(data.products, filters);
    return { products: filtered.slice(skip, skip + limit), total: filtered.length };
  }

  const data = await api.get<ProductsResponse>(`/products?skip=${skip}&limit=${limit}`);
  return { products: data.products, total: data.total };
}

export async function searchProducts(query: string): Promise<Product[]> {
  const data = await api.get<ProductsResponse>(
    `/products/search?q=${encodeURIComponent(query)}&limit=10`  //encodeURIComponent, türkçe - özel karakter vs girerse url in bozulmasını engeller 
  );
  return data.products;
}

export interface NewProduct {
  title: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
}

export async function createProduct(newProduct: NewProduct): Promise<Product> {
  return api.post<Product>("/products/add", newProduct);
}

export async function deleteProduct(id: number): Promise<Product> {
  return api.delete<Product>(`/products/${id}`);
}

export async function updateProduct(id: number, updatedProduct: Partial<NewProduct>): Promise<Product> {
  return api.put<Product>(`/products/${id}`, updatedProduct);
}

//detay
export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductDetail extends Product {
  description: string;
  rating: number;
  images: string[];
  reviews: ProductReview[];
  warrantyInformation: string;
  shippingInformation: string;
  returnPolicy: string;
}

export async function getProductById(id: number): Promise<ProductDetail> {
  return api.get<ProductDetail>(`/products/${id}`);
}