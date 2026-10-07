export type ToastType = 'success' | 'error';
export interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

// Toast ringan tanpa dependency tambahan: state singleton di luar React,
// supaya helper non-komponen seperti run() bisa memicu toast langsung
// tanpa perlu hook.
let items: ToastItem[] = [];
let listeners: ((items: ToastItem[]) => void)[] = [];
let nextId = 1;

function emit() {
  listeners.forEach((listener) => listener(items));
}

export function subscribeToasts(listener: (items: ToastItem[]) => void): () => void {
  listeners.push(listener);
  listener(items);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function showToast(type: ToastType, message: string) {
  const id = nextId++;
  items = [...items, { id, type, message }];
  emit();
  setTimeout(() => {
    items = items.filter((t) => t.id !== id);
    emit();
  }, 4000);
}
