import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../constants/colors';
import { useApp } from '../context/AppContext';

export default function CartScreen({ navigation }) {
  const { cart, removeFromCart } = useApp();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Text style={styles.heading}>Cart</Text>
        <View style={styles.empty}>
          <Ionicons name="cart-outline" size={64} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add products from the shop to get started</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleCheckout = () => {
    navigation.navigate('OrderConfirmation', {
      items: cart,
      total,
    });
  };

  const FALLBACK_IMAGE = 'https://via.placeholder.com/600x200?text=No+Image';

  function CartItem({ item }) {
    const [imageUri, setImageUri] = useState(item.image || item.images?.[0] || FALLBACK_IMAGE);
    useEffect(() => {
      setImageUri(item.image || item.images?.[0] || FALLBACK_IMAGE);
    }, [item.id, item.image, item.images]);

    return (
      <View style={styles.item}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="contain"
          onError={() => setImageUri(FALLBACK_IMAGE)}
        />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.qty}>Qty: {item.quantity}</Text>
          <Text style={styles.price}>${((Number(item.price) || 0) * item.quantity).toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFromCart(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.heading}>Cart</Text>
      <FlatList
        data={cart}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <CartItem item={item} />}
      />
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
  },
  qty: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.accent,
    marginTop: 2,
  },
  removeButton: {
    padding: 8,
  },
  footer: {
    backgroundColor: colors.card,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.accent,
  },
  checkoutButton: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
  },
  checkoutText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
