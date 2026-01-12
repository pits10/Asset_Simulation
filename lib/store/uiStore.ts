import { create } from "zustand";

type ModalType =
  | "age-range"
  | "personal-info"
  | "income"
  | "expense"
  | "investment"
  | "housing"
  | "onboarding"
  | null;

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

interface UIState {
  // Modal state
  activeModal: ModalType;
  modalData?: any;

  // Toast notifications
  toasts: Toast[];

  // Actions
  openModal: (modal: ModalType, data?: any) => void;
  closeModal: () => void;
  addToast: (
    message: string,
    type?: Toast["type"],
    duration?: number
  ) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  activeModal: null,
  modalData: undefined,
  toasts: [],

  openModal: (modal, data) => {
    set({ activeModal: modal, modalData: data });
  },

  closeModal: () => {
    set({ activeModal: null, modalData: undefined });
  },

  addToast: (message, type = "info", duration = 3000) => {
    const id = Math.random().toString(36).substring(7);
    const toast: Toast = { id, message, type, duration };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));
