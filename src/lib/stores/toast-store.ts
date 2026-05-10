"use client";

import { create } from "zustand";

export type ToastTone = "info" | "success" | "error";

export interface Toast {
  id: number;
  tone: ToastTone;
  message: string;
  /** Optional action link rendered as a button after the message. */
  action?: { href: string; label: string };
  /** Auto-dismiss after this many ms (default 4000). 0 = sticky. */
  ttl?: number;
}

interface ToastState {
  toasts: Toast[];
  push: (t: Omit<Toast, "id">) => number;
  dismiss: (id: number) => void;
}

let nextId = 1;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  push: (t) => {
    const id = nextId++;
    const toast: Toast = { id, ttl: 4000, ...t };
    set((s) => ({ toasts: [...s.toasts, toast] }));
    if (toast.ttl && toast.ttl > 0) {
      setTimeout(() => get().dismiss(id), toast.ttl);
    }
    return id;
  },
  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/** Convenience helpers — callable from any client component. */
export const toast = {
  info: (message: string, action?: Toast["action"]) =>
    useToastStore.getState().push({ tone: "info", message, action }),
  success: (message: string, action?: Toast["action"]) =>
    useToastStore.getState().push({ tone: "success", message, action }),
  error: (message: string, action?: Toast["action"]) =>
    useToastStore.getState().push({ tone: "error", message, action, ttl: 6000 }),
};
