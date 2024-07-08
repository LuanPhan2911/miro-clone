import { Doc } from "@/convex/_generated/dataModel";
import { create } from "zustand";
export type ModalType = "new-org" | "invite-member" | "rename-board";
export interface ModalData {
  board?: {
    id?: string;
    title?: string;
  };
}
interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  data: ModalData;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => {
  return {
    isOpen: false,
    type: null,
    data: {},
    onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
    onClose: () => set({ isOpen: false, type: null, data: {} }),
  };
});
