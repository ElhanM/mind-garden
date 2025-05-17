import { create } from 'zustand';

export type TransitionType = '1to2' | '2to1' | '2to3' | '3to2' | '3to4' | '4to3' | null;

const getTransitionType = (oldLevel: number, newLevel: number): TransitionType => {
  const transitions = {
    '1-2': '1to2',
    '2-1': '2to1',
    '2-3': '2to3',
    '3-2': '3to2',
    '3-4': '3to4',
    '4-3': '4to3',
  } as const;
  return transitions[`${oldLevel}-${newLevel}` as keyof typeof transitions] ?? null;
};

function getLevelFromWP(wp: number): number {
  if (wp <= 90) return 1;
  if (wp <= 190) return 2;
  if (wp <= 290) return 3;
  return 4;
}

interface WPState {
  wp: number;
  level: number;
  previousLevel: number | null;
  modalOpen: boolean;
  transitionType: TransitionType;

  // Silent update (used by WPProvider)
  setWP: (wp: number) => void;

  // Triggers transition modal (used after check-in)
  updateWPWithTransition: (wp: number, supressModal: boolean) => void;

  // Modal control
  closeModal: () => void;
}

export const useWPStore = create<WPState>((set, get) => ({
  wp: 0,
  level: 1,
  previousLevel: null,
  modalOpen: false,
  transitionType: null,
  setWP: (wp) => {
    const oldLevel = get().level;
    const newLevel = getLevelFromWP(wp);

    const isLevelChanged = newLevel !== oldLevel;

    if (isLevelChanged) {
      set({
        wp,
        level: newLevel,
      });
    } else {
      set({ wp, level: oldLevel }); // just update silently
    }
  },

  // Updates WP, checks for level transition, and opens modal if needed
  updateWPWithTransition: (wp: number, suppressModal = false) => {
    const oldLevel = get().level;
    const newLevel = getLevelFromWP(wp);

    const levelChanged = newLevel !== oldLevel;

    if (levelChanged) {
      set({
        wp,
        previousLevel: oldLevel,
        level: newLevel,
        transitionType: getTransitionType(oldLevel, newLevel),
        modalOpen: !suppressModal, // ← this alone is enough
      });
    } else {
      set({ wp }); // silent update
    }
  },

  closeModal: () => set({ modalOpen: false, transitionType: null }),
}));
