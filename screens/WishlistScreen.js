import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../constants/colors';
import { useApp } from '../context/AppContext';

export default function WishlistScreen() {
  const { wishlist, removeFromWishlist } = useApp();

  if (wishlist.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Text style={styles.heading}>Wishlist</Text>
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={64} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
          <Text style={styles.emptySubtitle}>Save items you love by tapping the heart icon</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.heading}>Wishlist</Text>
      {/** Use a small child component so hooks work per-item */}
      <FlatList
        data={wishlist}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <WishlistItem item={item} onRemove={() => removeFromWishlist(item.id)} />}
      />
    </SafeAreaView>
  );
}

const FALLBACK_IMAGE = 'https://via.placeholder.com/600x200?text=No+Image';

function WishlistItem({ item, onRemove }) {
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
        <Text style={styles.price}>${(Number(item.price) || 0).toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
        <Ionicons name="trash-outline" size={20} color={colors.error} />
      </TouchableOpacity>
    </View>
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
    paddingBottom: 16,
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
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.accent,
  },
  removeButton: {
    padding: 8,
  },
});
