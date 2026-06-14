import { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../constants/colors';
import { useApp } from '../context/AppContext';
import { getSizeRecommendation } from '../utils/sizeRecommendation';

export default function TryOnScreen() {
  const { setMeasurements } = useApp();
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleGetSize = () => {
    Keyboard.dismiss();
    const c = parseFloat(chest);
    const w = parseFloat(waist);
    const h = parseFloat(hips);

    if (!c || !w || !h || c <= 0 || w <= 0 || h <= 0) {
      setError('Please enter valid measurements in cm');
      setResult(null);
      return;
    }

    setError('');
    const size = getSizeRecommendation(c, w, h);
    const data = { chest: c, waist: w, hips: h, size };
    setMeasurements(data);
    setResult(data);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.heading}>Try-On / Size</Text>
            <Text style={styles.subheading}>Enter your body measurements in cm</Text>

            <TextInput
              style={styles.input}
              placeholder="Chest (cm)"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={chest}
              onChangeText={setChest}
            />
            <TextInput
              style={styles.input}
              placeholder="Waist (cm)"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={waist}
              onChangeText={setWaist}
            />
            <TextInput
              style={styles.input}
              placeholder="Hips (cm)"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={hips}
              onChangeText={setHips}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleGetSize}>
              <Text style={styles.buttonText}>Get My Size</Text>
            </TouchableOpacity>

            {result && (
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>Your Recommended Size</Text>
                <Text style={styles.resultSize}>{result.size}</Text>
                <Text style={styles.resultDetails}>
                  Chest: {result.chest}cm · Waist: {result.waist}cm · Hips: {result.hips}cm
                </Text>
              </View>
            )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  subheading: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    marginBottom: 8,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: colors.success,
    borderRadius: 12,
    padding: 20,
    marginTop: 24,
    alignItems: 'center',
  },
  resultLabel: {
    color: colors.white,
    fontSize: 14,
    opacity: 0.9,
  },
  resultSize: {
    color: colors.white,
    fontSize: 48,
    fontWeight: '700',
    marginVertical: 8,
  },
  resultDetails: {
    color: colors.white,
    fontSize: 13,
    opacity: 0.85,
    textAlign: 'center',
  },
});
