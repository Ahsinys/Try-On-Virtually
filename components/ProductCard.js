import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../constants/colors';

const FALLBACK_IMAGE = 'https://via.placeholder.com/600x200?text=No+Image';

export default function ProductCard({ product, onPress }) {
  const initial = product.image || product.images?.[0] || FALLBACK_IMAGE;
  const [imageUri, setImageUri] = useState(initial);

  useEffect(() => {
    setImageUri(product.image || product.images?.[0] || FALLBACK_IMAGE);
  }, [product.id, product.image, product.images]);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        resizeMode="contain"
        onError={() => setImageUri(FALLBACK_IMAGE)}
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.price}>${(Number(product.price) || 0).toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    margin: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: colors.background,
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 13,
    color: colors.text,
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.accent,
  },
});
