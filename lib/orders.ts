import { api } from "@/lib/api";

interface CartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  thumbnail: string;
}

interface Cart {
  id: number;
  products: CartProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

interface CartsResponse {
  carts: Cart[];
  total: number;
  skip: number;
  limit: number;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

export interface Order extends Cart {
  customerName: string;
  status: "Completed" | "In-Progress" | "Pending";
}

export interface OrderFilters {
  search?: string | null;
  status?: string;
  minAmount?: string;
  maxAmount?: string;
}

export function getMockStatus(id: number): Order["status"] {
  const remainder = id % 3;
  if (remainder === 0) return "Completed";
  if (remainder === 1) return "In-Progress";
  return "Pending";
}

//kullanıcı id leri ile isimlerini eşleştiren map
export async function getUserMap(): Promise<Map<number, string>> {  //Promise<Map<number, string: bu fonk. sonucunda dışarıya bir Promise dönecek ve bu Promise çözüldüğünde elimizde bir Map<number, string> objesi gelecek. Map objesi ise kullanıcı id leri ile isimlerini eşleştiren bir veri yapısı olacak.
  const data = await api.get<{ users: User[] }>(`/users?limit=0&select=firstName,lastName`);
  const map = new Map<number, string>();
  data.users.forEach((user) => {
    map.set(user.id, `${user.firstName} ${user.lastName}`);
  });
  return map;
}

//ham sepet verisini alıp üzerine müşteri adı ve durum ekleyerek siparişe dönüştürür.
function enrichCartToOrder(cart: Cart, userMap: Map<number, string>): Order {
  const customerName = userMap.get(cart.userId) ?? "Bilinmeyen Müşteri"; //Daha önce oluşturulan map içinde bu userId'ye karşılık gelen müşteri adını arar.
  const status = getMockStatus(cart.id);
  return { ...cart, customerName, status };
}

function applyFilters(orders: Order[], filters: OrderFilters): Order[] {
  return orders.filter((order) => {
    const matchesSearch =
      !filters.search || order.customerName.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus =
      !filters.status || filters.status === "All" || order.status === filters.status;
    const matchesMin = !filters.minAmount || order.discountedTotal >= Number(filters.minAmount);
    const matchesMax = !filters.maxAmount || order.discountedTotal <= Number(filters.maxAmount);
    return matchesSearch && matchesStatus && matchesMin && matchesMax;
  });
}

function hasActiveFilters(filters: OrderFilters): boolean {
  return Boolean(
    filters.search || (filters.status && filters.status !== "All") || filters.minAmount || filters.maxAmount
  );
}

export async function getOrders(
  skip: number,
  limit: number,
  userMap: Map<number, string>,
  filters: OrderFilters = {}
): Promise<{ orders: Order[]; total: number }> {
  if (hasActiveFilters(filters)) {
    const data = await api.get<CartsResponse>(`/carts?limit=0`); ////tüm sepeti çekiyoruz çünkü arama yapacağız ve API tarafında arama desteği yok
    const allOrders = data.carts.map((cart) => enrichCartToOrder(cart, userMap));
    const filtered = applyFilters(allOrders, filters);
    return { orders: filtered.slice(skip, skip + limit), total: filtered.length };
  }

  const data = await api.get<CartsResponse>(`/carts?skip=${skip}&limit=${limit}`);  ////tüm sepet çekilip yavaşlama olmasın diye skip ve limit parametreleri ile sayfalama yapıyoruz.
  const orders = data.carts.map((cart) => enrichCartToOrder(cart, userMap));
  return { orders, total: data.total };
}

export async function getAllOrders(userMap: Map<number, string>): Promise<Order[]> {
  const data = await api.get<CartsResponse>(`/carts?limit=0`);
  return data.carts.map((cart) => enrichCartToOrder(cart, userMap));
}