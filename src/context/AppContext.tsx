/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, CartItem, ScheduleDay, UserRole, ActiveTabAdmin, ActiveTabStudent, OrderStatus } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_SCHEDULE } from '../data/mockData';

interface AppContextType {
  role: UserRole;
  tabAdmin: ActiveTabAdmin;
  tabStudent: ActiveTabStudent;
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  schedule: ScheduleDay[];
  currentStudentOrder: Order | null;
  setRole: (role: UserRole) => void;
  setTabAdmin: (tab: ActiveTabAdmin) => void;
  setTabStudent: (tab: ActiveTabStudent) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  addProductToCart: (product: Product) => void;
  updateCartItemQuantity: (productId: string, delta: number) => void;
  removeProductFromCart: (productId: string) => void;
  confirmOrder: (customerName: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateSchedule: (schedule: ScheduleDay[]) => void;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from localStorage if available, otherwise mock data
  const [role, setRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem('eb_role');
    return saved ? (saved as UserRole) : null;
  });

  const [tabAdmin, setTabAdminState] = useState<ActiveTabAdmin>(() => {
    const saved = localStorage.getItem('eb_tab_admin');
    return saved ? (saved as ActiveTabAdmin) : 'dashboard';
  });

  const [tabStudent, setTabStudentState] = useState<ActiveTabStudent>(() => {
    const saved = localStorage.getItem('eb_tab_student');
    return saved ? (saved as ActiveTabStudent) : 'catalog';
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('eb_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('eb_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('eb_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [schedule, setSchedule] = useState<ScheduleDay[]>(() => {
    const saved = localStorage.getItem('eb_schedule');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
  });

  const [currentStudentOrder, setCurrentStudentOrder] = useState<Order | null>(() => {
    const saved = localStorage.getItem('eb_current_student_order');
    return saved ? JSON.parse(saved) : null;
  });

  // Keep localStorage updated
  useEffect(() => {
    localStorage.setItem('eb_role', role || '');
  }, [role]);

  useEffect(() => {
    localStorage.setItem('eb_tab_admin', tabAdmin);
  }, [tabAdmin]);

  useEffect(() => {
    localStorage.setItem('eb_tab_student', tabStudent);
  }, [tabStudent]);

  useEffect(() => {
    localStorage.setItem('eb_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('eb_orders', JSON.stringify(orders));
    // Also update currentStudentOrder if it exists inside the orders list
    if (currentStudentOrder) {
      const found = orders.find(o => o.id === currentStudentOrder.id);
      if (found) {
        if (JSON.stringify(found) !== JSON.stringify(currentStudentOrder)) {
          setCurrentStudentOrder(found);
          localStorage.setItem('eb_current_student_order', JSON.stringify(found));
        }
      }
    }
  }, [orders, currentStudentOrder]);

  useEffect(() => {
    localStorage.setItem('eb_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('eb_schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    if (currentStudentOrder) {
      localStorage.setItem('eb_current_student_order', JSON.stringify(currentStudentOrder));
    } else {
      localStorage.removeItem('eb_current_student_order');
    }
  }, [currentStudentOrder]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
  };

  const setTabAdmin = (tab: ActiveTabAdmin) => {
    setTabAdminState(tab);
  };

  const setTabStudent = (tab: ActiveTabStudent) => {
    setTabStudentState(tab);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const addProductToCart = (product: Product) => {
    if (product.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        // limit quantity to product stock
        const newQty = Math.min(existing.quantity + 1, product.stock);
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: newQty } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateCartItemQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          // check stock limit
          const limitedQty = Math.min(newQty, item.product.stock);
          return { ...item, quantity: limitedQty };
        }
        return item;
      }).filter((item): item is CartItem => item !== null);
    });
  };

  const removeProductFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const confirmOrder = (customerName: string) => {
    if (cart.length === 0) return;

    // Create unique order ID and turn number
    const lastOrderNum = orders.length > 0 ? parseInt(orders[0].turnNumber) || 42 : 42;
    const nextTurn = String((lastOrderNum + 1) % 1000).padStart(3, '0');
    const orderId = `EXB-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderId,
      items: cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      })),
      total: Number((cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0) + 0.50).toFixed(2)), // with 0.50 service fee
      status: 'PREPARING',
      createdAt: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      customerName: customerName || 'Estudiante',
      turnNumber: nextTurn,
    };

    setOrders(prev => [newOrder, ...prev]);
    setCurrentStudentOrder(newOrder);
    setCart([]); // Clear cart
    setTabStudent('status'); // Navigate to status
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, status };
        
        // If the transition is to DELIVERED, discount 1 unit of stock per quantity ordered
        if (status === 'DELIVERED' && order.status !== 'DELIVERED') {
          order.items.forEach(item => {
            setProducts(prevProducts => prevProducts.map(p => {
              if (p.id === item.productId) {
                const newStock = Math.max(0, p.stock - item.quantity);
                return { ...p, stock: newStock };
              }
              return p;
            }));
          });
        }
        
        return updatedOrder;
      }
      return order;
    }));
  };

  const updateSchedule = (newSchedule: ScheduleDay[]) => {
    setSchedule(newSchedule);
  };

  return (
    <AppContext.Provider value={{
      role,
      tabAdmin,
      tabStudent,
      products,
      orders,
      cart,
      schedule,
      currentStudentOrder,
      setRole,
      setTabAdmin,
      setTabStudent,
      updateProduct,
      addProductToCart,
      updateCartItemQuantity,
      removeProductFromCart,
      confirmOrder,
      updateOrderStatus,
      updateSchedule,
      setProducts,
      setOrders,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
