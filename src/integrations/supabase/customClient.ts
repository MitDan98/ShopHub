
import { supabase } from './client';
import type { Profile, Order, OrderItem } from '@/types/database.types';

// Typed methods for profiles table
export const profilesTable = {
  upsert: (profile: Partial<Profile>) => 
    supabase.from('profiles').upsert(profile),
  select: () => 
    supabase.from('profiles').select('*'),
  update: (profile: Partial<Profile>) => 
    supabase.from('profiles').update(profile),
  getById: (id: string) => 
    supabase.from('profiles').select('*').eq('id', id).single()
};

// Typed methods for orders table
export const ordersTable = {
  insert: (order: Partial<Order>) => 
    supabase.from('orders').insert(order),
  select: () => 
    supabase.from('orders').select('*'),
  getById: (id: string) => 
    supabase.from('orders').select('*').eq('id', id).single(),
  getByUserId: (userId: string) => 
    supabase.from('orders').select('*').eq('user_id', userId)
};

// Typed methods for order_items table
export const orderItemsTable = {
  insert: (items: Partial<OrderItem> | Partial<OrderItem>[]) => 
    supabase.from('order_items').insert(items),
  select: () => 
    supabase.from('order_items').select('*'),
  getByOrderId: (orderId: string) => 
    supabase.from('order_items').select('*').eq('order_id', orderId)
};
