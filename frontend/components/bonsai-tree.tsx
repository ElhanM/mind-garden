'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// This component represents the visual bonsai tree that grows with user progress
export function BonsaiTree() {
  const [treeStage, setTreeStage] = useState(3);
  const [lastWatered, setLastWatered] = useState<Date | null>(null);
  //make rng between 1 and 4
  const rng = Math.floor(Math.random() * 4) + 1; //select a random tree level
  const treeChoice = `/BonsaiLevel${rng}.gif`; //temporary solution before logic implementation

  // In a real app, these would be fetched from an API
  useEffect(() => {
    // Simulate fetching user data
    setTreeStage(3); // 0-5 stages of growth
    setLastWatered(new Date(Date.now() - 24 * 60 * 60 * 1000)); // 1 day ago
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      {treeStage >= 1 && (
        <>
          <div className="border rounded-full">
            <img src={treeChoice} alt="" />
          </div>
        </>
      )}

      {/* Last watered info */}
      <div className="absolute bottom-0 mt-4 text-center text-sm text-gray-600">
        <p>Last check-in: {lastWatered ? lastWatered.toLocaleDateString() : 'Never'}</p>
      </div>
    </div>
  );
}
