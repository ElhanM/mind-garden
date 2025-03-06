'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

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
    <>
      <div className="flex h-full w-full flex-col items-center justify-center">
        {treeStage >= 1 && (
          <>
            <div className="border rounded-full">
              <Image width={641} height={641} src={treeChoice} alt="BonsaiTree" />
            </div>
          </>
        )}
      </div>
      {/* Last watered info */}
      <div className="bottom-0 mt-0 text-center text-sm text-gray-600">
        <p>Last check-in: {lastWatered ? lastWatered.toLocaleDateString() : 'Never'}</p>
      </div>
    </>
  );
}
