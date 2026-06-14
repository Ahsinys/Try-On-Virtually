import { createContext, useContext, useMemo, useState } from 'react';

const AppContext = createContext(null);

const normalizeProduct = (product) => ({
  ...product,
  image: product.image || product.images?.[0],
  category:
    typeof product.category === 'object'
      ? product.category?.name
      : product.category,
});

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: '', email: '' });
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [measurements, setMeasurements] = useState(null);

  const addToCart = (product) => {
    const normalized = normalizeProduct(product);
    setCart((prev) => {
      const existing = prev.find((item) => item.id === normalized.id);
      if (existing) {
        return prev.map((item) =>
          item.id === normalized.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...normalized, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const addToWishlist = (product) => {
    const normalized = normalizeProduct(product);
    setWishlist((prev) => {
      if (prev.some((item) => item.id === normalized.id)) return prev;
      return [...prev, normalized];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const logout = () => {
    setIsLoggedIn(false);
    setCart([]);
    setWishlist([]);
    setMeasurements(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const value = useMemo(
    () => ({
      isLoggedIn,
      setIsLoggedIn,
      user,
      setUser,
      cart,
      wishlist,
      measurements,
      setMeasurements,
      addToCart,
      removeFromCart,
      addToWishlist,
      removeFromWishlist,
      clearCart,
      logout,
      cartCount,
      wishlistCount: wishlist.length,
    }),
    [isLoggedIn, user, cart, wishlist, measurements, cartCount]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
