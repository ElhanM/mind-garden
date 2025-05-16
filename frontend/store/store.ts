// store.ts
import { create } from 'zustand';

export type TransitionType = '1to2' | '2to1' | '2to3' | '3to2' | '3to4' | '4to3' | null;

interface WPState {
  wp: number;
  level: number;
  previousLevel: number | null;
  modalOpen: boolean;
  transitionType: TransitionType;
  setWP: (wp: number) => void;
  setLevel: (newLevel: number) => void;
  closeModal: () => void;
}

const getTransitionType = (oldLevel: number, newLevel: number): TransitionType => {
  const key = `${oldLevel}-${newLevel}`;
  const transitions = {
    '1-2': '1to2',
    '2-1': '2to1',
    '2-3': '2to3',
    '3-2': '3to2',
    '3-4': '3to4',
    '4-3': '4to3',
  } as const;
  return transitions[key] ?? null;
};

export const useWPStore = create<WPState>((set, get) => ({
  wp: 0,
  level: 1,
  previousLevel: null,
  modalOpen: false,
  transitionType: null,

  setWP: (wp) => set({ wp }),

  setLevel: (newLevel) => {
    const oldLevel = get().level;
    const lastShownLevel = parseInt(localStorage.getItem('lastLevelShown') ?? '0');

    // Skip modal if we've already shown this transition
    if (newLevel !== oldLevel && newLevel !== lastShownLevel) {
      localStorage.setItem('lastLevelShown', String(newLevel));

      set({
        previousLevel: oldLevel,
        level: newLevel,
        transitionType: getTransitionType(oldLevel, newLevel),
        modalOpen: true,
      });
    } else {
      set({ level: newLevel }); // just update silently
    }
  },
  closeModal: () => set({ modalOpen: false, transitionType: null }),
}));
