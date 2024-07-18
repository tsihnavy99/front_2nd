// useCart.ts
import { useState } from 'react';
import { CartItem, Coupon, Product } from '../../types';
import {
  calculateCartTotal,
  updateCartItemQuantity,
  getRemainingStockfromCart,
  getMaxApplicableDiscount,
  appendNewCartItem,
  filterCartByProductId,
} from './utils/cartUtils';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = (product: Product) => {
    setCart((prevCart) => appendNewCartItem(prevCart, product));
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => filterCartByProductId(prevCart, productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) =>
      updateCartItemQuantity(prevCart, productId, newQuantity)
    );
  };

  const applyCoupon = (coupon: Coupon | null) => {
    setSelectedCoupon(coupon);
  };

  const calculateTotal = () => {
    return calculateCartTotal(cart, selectedCoupon);
  };

  const getRemainingStock = (product: Product) => {
    return getRemainingStockfromCart(cart, product);
  };

  const getAppliedDiscount = (item: CartItem) => {
    return getMaxApplicableDiscount(item);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
    getRemainingStock,
    getAppliedDiscount,
  };
};
