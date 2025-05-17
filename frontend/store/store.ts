import { create } from 'zustand';
import { TransitionType } from '@/types/TransitionType';

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

  setWP: (wp: number) => void;

  updateWPWithTransition: (wp: number, supressModal: boolean) => void;

  closeModal: () => void;
}

//this is only used for updating btw, no modals or nothing here
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
        modalOpen: !suppressModal, //  this alone is enough
      });
    } else {
      set({ wp }); // silent update
    }
  },

  closeModal: () => set({ modalOpen: false, transitionType: null }),
}));
