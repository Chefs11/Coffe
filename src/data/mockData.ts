import { Product, Order, ScheduleDay } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Classic Campus Burger',
    description: 'Carne 100% premium con queso cheddar y vegetales frescos.',
    price: 8.50,
    stock: 15,
    category: 'Comida Rápida',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    id: 'prod-2',
    name: 'Ensalada César Fresh',
    description: 'Mix de lechugas, crutones artesanales y aderezo de la casa.',
    price: 6.75,
    stock: 25,
    category: 'Ensaladas',
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    id: 'prod-3',
    name: 'Pizza Pepperoni Lover',
    description: 'Masa artesanal con extra pepperoni y mozzarella fundido.',
    price: 9.25,
    stock: 0, // Out of stock by default
    category: 'Comida Rápida',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    id: 'prod-4',
    name: 'Smoothie Berries Mix',
    description: 'Fresa, mora y arándanos frescos con base de yogurt natural.',
    price: 4.50,
    stock: 30,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    id: 'prod-5',
    name: 'Pasta Alfredo Chicken',
    description: 'Fettuccine en salsa blanca con pechuga a la parrilla.',
    price: 10.20,
    stock: 12,
    category: 'Comida Rápida',
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    id: 'prod-6',
    name: 'Tacos Al Pastor (3x)',
    description: 'Tradicionales con piña, cilantro y cebolla.',
    price: 7.00,
    stock: 0, // Out of stock by default
    category: 'Comida Rápida',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    id: 'prod-7',
    name: 'Salmón Power Bowl',
    description: 'Arroz integral, salmón fresco, aguacate y edamames.',
    price: 12.50,
    stock: 18,
    category: 'Ensaladas',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    id: 'prod-8',
    name: 'Café Latte Art',
    description: 'Grano seleccionado tostado medio con leche vaporizada.',
    price: 3.50,
    stock: 40,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'EXB-9432',
    items: [
      { productId: 'prod-1', name: 'Classic Campus Burger', price: 8.50, quantity: 2 }
    ],
    total: 17.00,
    status: 'PREPARING',
    createdAt: '08:48',
    customerName: 'Mateo García',
    turnNumber: '042',
  },
  {
    id: 'EXB-9431',
    items: [
      { productId: 'prod-2', name: 'Ensalada César Fresh', price: 6.75, quantity: 1 },
      { productId: 'prod-4', name: 'Smoothie Berries Mix', price: 4.50, quantity: 1 }
    ],
    total: 11.25,
    status: 'READY',
    createdAt: '08:45',
    customerName: 'Sofía Rodríguez',
    turnNumber: '041',
  },
  {
    id: 'EXB-9430',
    items: [
      { productId: 'prod-5', name: 'Pasta Alfredo Chicken', price: 10.20, quantity: 1 }
    ],
    total: 10.20,
    status: 'DELIVERED',
    createdAt: '08:35',
    customerName: 'Javier Torres',
    turnNumber: '040',
  },
  {
    id: 'EXB-9429',
    items: [
      { productId: 'prod-7', name: 'Salmón Power Bowl', price: 12.50, quantity: 1 },
      { productId: 'prod-8', name: 'Café Latte Art', price: 3.50, quantity: 1 }
    ],
    total: 16.00,
    status: 'DELIVERED',
    createdAt: '08:22',
    customerName: 'Andrea López',
    turnNumber: '039',
  }
];

export const INITIAL_SCHEDULE: ScheduleDay[] = [
  { day: 'Lunes', isOpen: true, openTime: '07:30', closeTime: '20:00' },
  { day: 'Martes', isOpen: true, openTime: '07:30', closeTime: '20:00' },
  { day: 'Miércoles', isOpen: true, openTime: '07:30', closeTime: '20:00' },
  { day: 'Jueves', isOpen: true, openTime: '07:30', closeTime: '20:00' },
  { day: 'Viernes', isOpen: true, openTime: '07:30', closeTime: '18:00' },
  { day: 'Sábado', isOpen: false, openTime: '08:00', closeTime: '14:00' },
  { day: 'Domingo', isOpen: false, openTime: '08:00', closeTime: '14:00' },
];
