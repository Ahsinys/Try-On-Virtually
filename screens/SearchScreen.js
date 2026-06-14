import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductCard from '../components/ProductCard';
import colors from '../constants/colors';

export default function SearchScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const endpoints = [
      'https://dummyjson.com/products/category/womens-dresses',
      'https://dummyjson.com/products/category/womens-shoes',
      'https://dummyjson.com/products/category/womens-bags',
      'https://dummyjson.com/products/category/womens-jewellery',
      'https://dummyjson.com/products/category/womens-watches',
    ];

    Promise.allSettled(endpoints.map((url) => axios.get(url)))
      .then((results) => {
        const combined = [];
        for (const r of results) {
          if (r.status === 'fulfilled' && r.value?.data?.products) {
            combined.push(...r.value.data.products);
          }
        }

        const byId = new Map();
        combined.forEach((p) => {
          if (!byId.has(p.id)) byId.set(p.id, p);
        });

        setProducts(
          Array.from(byId.values()).map((product) => ({
            ...product,
            image: product.thumbnail || product.image || product.images?.[0],
            category:
              typeof product.category === 'object'
                ? product.category?.name
                : product.category,
          }))
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || item.category === category;
    return matchesSearch && matchesCategory;
  });



  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.heading}>Search</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        placeholderTextColor={colors.textSecondary}
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No products found</Text>
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() =>
              navigation.navigate('Shop', {
                screen: 'ProductDetail',
                params: { product: item },
              })
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 40,
    fontSize: 16,
  },
});
