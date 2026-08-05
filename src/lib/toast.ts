export type ToastVariant = 'info' | 'success' | 'error';

export interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

type Listener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
let listeners: Listener[] = [];
let nextId = 0;

const DURATIONS: Record<ToastVariant, number> = {
  info: 2500,
  success: 3000,
  error: 4500,
};

function emit() {
  listeners.forEach((listener) => listener(toasts));
}

function dismiss(id: number) {
  toasts = toasts.filter((item) => item.id !== id);
  emit();
}

function show(message: string, variant: ToastVariant) {
  const id = nextId++;
  toasts = [...toasts, { id, message, variant }];
  emit();
  setTimeout(() => dismiss(id), DURATIONS[variant]);
  return id;
}

export const toast = {
  info: (message: string) => show(message, 'info'),
  success: (message: string) => show(message, 'success'),
  error: (message: string) => show(message, 'error'),
  dismiss,
};

export function subscribeToasts(listener: Listener) {
  listeners.push(listener);
  listener(toasts);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}
