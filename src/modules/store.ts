import { create } from 'zustand';

interface BoardUiState {
  selectedTaskId: string | null;
  isAsideOpen: boolean;
  setSelectedTaskId: (id: string | null) => void;
  setIsAsideOpen: (open: boolean) => void;
  reset: () => void;
}

const initialState = {
  selectedTaskId: null,
  isAsideOpen: false,
};

export const useBoardUiStore = create<BoardUiState>((set) => ({
  ...initialState,
  setSelectedTaskId: (id) => set({ selectedTaskId: id }),
  setIsAsideOpen: (open) => set({ isAsideOpen: open }),
  reset: () => set(initialState),
}));
