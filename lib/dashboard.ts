import { api } from "@/lib/api";
import { Order } from "@/lib/orders";

interface Product {
    id: number;
    title: string;
    category: string;
    brand: string;
    price: number;
    stock: number;
}

interface ProductsResponse {
    products: Product[];
    total: number;
}

export interface CategoryStat {
    category: string;
    avgPrice: number;
    avgStock: number;
}

export interface BrandStat {
  brand: string;
  quantity: number;
}

export interface TopProduct {
  id: number;
  title: string;
  quantity: number;
  price: number;
}

export async function getAllProducts(): Promise<Product[]> {
    const data = await api.get<ProductsResponse>(`/products?limit=0`);
    return data.products;
}

export function getCategoryComparison(products: Product[]): CategoryStat[] {
  const grouped = products.reduce((acc, product) => { //reduce ile ürünleri kategorilere ayırdık.
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  //ort. fiyat ve ort. stok hesaplandı.
  return Object.entries(grouped).map(([category, categoryProducts]) => {
    const totalPrice = categoryProducts.reduce((sum, p) => sum + p.price, 0);
    const totalStock = categoryProducts.reduce((sum, p) => sum + p.stock, 0);

    return {
      category,
      avgPrice: totalPrice / categoryProducts.length,
      avgStock: totalStock / categoryProducts.length,
    };
  });
}

export function getCriticalStockCount(products: Product[], threshold = 10): number {
  const criticalProducts = products.filter((product) => product.stock < threshold);
  return criticalProducts.length;
}

//ürün ıd sini anahtar yapıp o ürünün marka ve kategorisini değer olaran tutan hızlı bir map yapısı oluşturur.
function buildProductLookup(products: Product[]): Map<number, { brand: string; category: string }> {
  const map = new Map<number, { brand: string; category: string }>();
  products.forEach((product) => {
    map.set(product.id, { brand: product.brand, category: product.category });
  });
  return map;
}

export function getBrandSales(
  allOrders: Order[],
  allProducts: Product[],
  category?: string
): BrandStat[] { 
  const lookup = buildProductLookup(allProducts); //lookup ile ürünün hangi markaya ait olduğunu bulur.
  const brandTotals: Record<string, number> = {};

  //müşteri kategori seçtiyse sadece o kategorideki ürünlerin satışlarını hesaba katar.
  allOrders.forEach((order) => {
    order.products.forEach((cartProduct) => {
      const info = lookup.get(cartProduct.id);
      if (!info) return;
      if (category && info.category !== category) return;

      brandTotals[info.brand] = (brandTotals[info.brand] || 0) + cartProduct.quantity;
    });
  });

  return Object.entries(brandTotals)
    .map(([brand, quantity]) => ({ brand, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
}

//en çok satılan ürünler
export function getTopSellingProducts(allOrders: Order[], allProducts: Product[]): TopProduct[] {
  const productSales: Record<number, number> = {};

  allOrders.forEach((order) => {
    order.products.forEach((item) => {
      productSales[item.id] = (productSales[item.id] || 0) + item.quantity;
    });
  });

  return Object.entries(productSales)
    .map(([idStr, quantity]) => {
      const id = Number(idStr);
      const product = allProducts.find((p) => p.id === id);
      return {
        id,
        title: product?.title || `Ürün #${id}`,
        quantity,
        price: product?.price || 0,
      };
    })
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
}