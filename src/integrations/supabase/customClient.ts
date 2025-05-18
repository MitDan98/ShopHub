
import { supabase } from './client';
import type { Profile, Order, OrderItem, OrderTracking } from '@/types/database.types';

// Typed methods for profiles table
export const profilesTable = {
  upsert: (profile: Partial<Profile>) => 
    supabase.from('profiles').upsert(profile),
  select: () => 
    supabase.from('profiles').select('*'),
  update: (profile: Partial<Profile>) => 
    // Fixed: Added WHERE condition to ensure we update the correct profile
    supabase.from('profiles').update({
      // Exclude id from the update data
      ...(({ id, ...rest }) => rest)(profile)
    }).eq('id', profile.id),
  getById: (id: string) => 
    supabase.from('profiles').select('*').eq('id', id).single(),
  getAllAdmins: () => 
    supabase.from('profiles').select('*').eq('role', 'admin')
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
    supabase.from('orders').select('*').eq('user_id', userId),
  update: (id: string, orderData: Partial<Order>) => 
    supabase.from('orders').update(orderData).eq('id', id),
  getAllOrders: () => 
    supabase.from('orders').select('*, profiles(username, email)')
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

// Typed methods for order_tracking table
export const orderTrackingTable = {
  insert: (tracking: Partial<OrderTracking>) =>
    supabase.from('order_tracking').insert(tracking),
  getByOrderId: (orderId: string) =>
    supabase.from('order_tracking')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false }),
  update: (id: string, trackingData: Partial<OrderTracking>) =>
    supabase.from('order_tracking').update(trackingData).eq('id', id)
};
