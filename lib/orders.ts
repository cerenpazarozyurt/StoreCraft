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

export function getMockStatus(id: number): Order["status"] {
  const remainder = id % 3;
  if (remainder === 0) return "Completed";
  if (remainder === 1) return "In-Progress";
  return "Pending";
}

async function getUserMap(): Promise<Map<number, string>> {
  const data = await api.get<{ users: User[] }>(`/users?limit=0&select=firstName,lastName`);
  const map = new Map<number, string>();
  data.users.forEach((user) => {
    map.set(user.id, `${user.firstName} ${user.lastName}`);
  });
  return map;
}

function enrichCartToOrder(cart: Cart, userMap: Map<number, string>): Order {
  const customerName = userMap.get(cart.userId) ?? "Bilinmeyen Müşteri";
  const status = getMockStatus(cart.id);
  return { ...cart, customerName, status };
}

export async function getOrders(
  skip: number,
  limit: number,
  search: string | null
): Promise<{ orders: Order[]; total: number }> {
  const userMap = await getUserMap();

  if (search) {
    const data = await api.get<CartsResponse>(`/carts?limit=0`);
    const allOrders = data.carts.map((cart) => enrichCartToOrder(cart, userMap));

    const filtered = allOrders.filter((order) =>
      order.customerName.toLowerCase().includes(search.toLowerCase())
    );

    return { orders: filtered.slice(skip, skip + limit), total: filtered.length };
  }

  const data = await api.get<CartsResponse>(`/carts?skip=${skip}&limit=${limit}`);
  const orders = data.carts.map((cart) => enrichCartToOrder(cart, userMap));

  return { orders, total: data.total };
}