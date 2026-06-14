import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../constants/colors';
import { useApp } from '../context/AppContext';

export default function ProductDetailScreen({ route }) {
  const { product } = route.params;
  const { addToCart, addToWishlist, wishlist } = useApp();
  const inWishlist = wishlist.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    addToCart(product);
    Alert.alert('Added', `${product.title.slice(0, 30)}... added to cart`);
  };

  const handleAddToWishlist = () => {
    addToWishlist(product);
    Alert.alert('Saved', 'Added to wishlist');
  };

  const FALLBACK_IMAGE = 'https://via.placeholder.com/600x200?text=No+Image';
  const [imageUri, setImageUri] = useState(product.image || product.images?.[0] || FALLBACK_IMAGE);
  useEffect(() => {
    setImageUri(product.image || product.images?.[0] || FALLBACK_IMAGE);
  }, [product.id, product.image, product.images]);

  const categoryName =
    typeof product.category === 'object' ? product.category?.name : product.category;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        resizeMode="contain"
        onError={() => setImageUri(FALLBACK_IMAGE)}
      />
      <View style={styles.body}>
        <Text style={styles.category}>{categoryName}</Text>
        <Text style={styles.title}>{product.title}</Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={16} color="#F59E0B" />
          <Text style={styles.rating}>
            {product.rating?.rate ?? 'N/A'} ({product.rating?.count ?? 0} reviews)
          </Text>
        </View>
        <Text style={styles.price}>${(Number(product.price) || 0).toFixed(2)}</Text>
        <Text style={styles.description}>{product.description}</Text>

        <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
          <Ionicons name="cart-outline" size={20} color={colors.white} />
          <Text style={styles.cartButtonText}>Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.wishlistButton, inWishlist && styles.wishlistActive]}
          onPress={handleAddToWishlist}
        >
          <Ionicons
            name={inWishlist ? 'heart' : 'heart-outline'}
            size={20}
            color={inWishlist ? colors.white : colors.accent}
          />
          <Text style={[styles.wishlistButtonText, inWishlist && styles.wishlistTextActive]}>
            {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 32,
  },
  image: {
    width: '100%',
    height: 280,
    backgroundColor: colors.card,
  },
  body: {
    padding: 16,
  },
  category: {
    fontSize: 13,
    color: colors.accent,
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  price: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  cartButton: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cartButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  wishlistButton: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  wishlistActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  wishlistButtonText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  wishlistTextActive: {
    color: colors.white,
  },
});
