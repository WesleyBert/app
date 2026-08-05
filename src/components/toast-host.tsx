import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { subscribeToasts, toast, type ToastItem } from '@/lib/toast';

export function ToastHost() {
  const [items, setItems] = useState<ToastItem[]>([]);
  const insets = useSafeAreaInsets();

  useEffect(() => subscribeToasts(setItems), []);

  if (items.length === 0) return null;

  return (
    <View pointerEvents="box-none" style={[styles.container, { top: insets.top + Spacing.two }]}>
      {items.map((item) => (
        <ToastBubble key={item.id} item={item} />
      ))}
    </View>
  );
}

function ToastBubble({ item }: { item: ToastItem }) {
  const theme = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY]);

  const corDeFundo =
    item.variant === 'success' ? theme.success : item.variant === 'error' ? theme.danger : theme.backgroundElement;
  const corDoTexto = item.variant === 'info' ? theme.text : '#ffffff';

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <Pressable
        onPress={() => toast.dismiss(item.id)}
        style={[styles.bubble, { backgroundColor: corDeFundo }]}>
        <ThemedText type="smallBold" style={{ color: corDoTexto }}>
          {item.message}
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: Spacing.three,
    right: Spacing.three,
    gap: Spacing.two,
    zIndex: 999,
  },
  bubble: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
});
