/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'student' | 'admin' | null;

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  isActive: boolean; // toggle to enable/disable sales of each product
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'PREPARING' | 'READY' | 'DELIVERED';

export interface Order {
  id: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  customerName: string;
  turnNumber: string;
}

export type ActiveTabAdmin = 'dashboard' | 'inventory' | 'orders' | 'reports' | 'settings';
export type ActiveTabStudent = 'catalog' | 'cart' | 'status' | 'history';

export interface ScheduleDay {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}
