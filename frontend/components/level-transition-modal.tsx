'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export type TransitionType = '1to2' | '2to1' | '2to3' | '3to2' | '3to4' | '4to3' | null;

interface LevelTransitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transitionType: TransitionType;
}

export function LevelTransitionModal({
  isOpen,
  onClose,
  transitionType,
}: LevelTransitionModalProps) {
  if (!transitionType) return null;

  const getTransitionDetails = (type: TransitionType) => {
    switch (type) {
      case '1to2':
        return {
          title: 'Level Up! 🎉',
          description: 'Your bonsai tree has grown to Level 2!',
          imageSrc: '/1to2.gif',
        };
      case '2to1':
        return {
          title: 'Level Change',
          description: 'Your bonsai tree has returned to Level 1',
          imageSrc: '/2to1.gif',
        };
      case '2to3':
        return {
          title: 'Level Up! 🎉',
          description: 'Your bonsai tree has grown to Level 3!',
          imageSrc: '/2to3.gif',
        };
      case '3to2':
        return {
          title: 'Level Change',
          description: 'Your bonsai tree has returned to Level 2',
          imageSrc: '/3to2.gif',
        };
      case '3to4':
        return {
          title: 'Level Up! 🎉',
          description: 'Your bonsai tree has reached its final form - Level 4!',
          imageSrc: '/3to4.gif',
        };
      case '4to3':
        return {
          title: 'Level Change',
          description: 'Your bonsai tree has returned to Level 3',
          imageSrc: '/4to3.gif',
        };
      default:
        return {
          title: 'Tree Level Change',
          description: 'Your bonsai tree has changed levels',
          imageSrc: '/placeholder.svg',
        };
    }
  };

  const details = getTransitionDetails(transitionType);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">{details.title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4">
          <div className="h-[200px] w-[200px] relative mb-4">
            <Image
              src={details.imageSrc || '/placeholder.svg'}
              alt="Level transition"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-center text-gray-700">{details.description}</p>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button onClick={onClose} className="w-full sm:w-auto">
            Acknowledge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
