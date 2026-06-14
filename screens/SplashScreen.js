import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Ionicons name="shirt" size={80} color={colors.white} />
      <Text style={styles.title}>Try Virtually</Text>
      <Text style={styles.subtitle}>Virtual Try-On Shopping</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.accent,
    marginTop: 8,
  },
});
