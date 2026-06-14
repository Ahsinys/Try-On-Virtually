import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductCard from '../components/ProductCard';
import colors from '../constants/colors';

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        // dedupe by id
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
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError(null);
            {
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
                .catch(() => setError('Failed to load products'))
                .finally(() => setLoading(false));
            }
          }}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.navBar}>
        <Text style={styles.navBarTitle}>Try-On</Text>
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
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
  navBar: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBarTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryText: {
    color: colors.white,
    fontWeight: '600',
  },
});
