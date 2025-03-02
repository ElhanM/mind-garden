'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// This component represents the visual bonsai tree that grows with user progress
export function BonsaiTree() {
  const [treeStage, setTreeStage] = useState(3);
  const [lastWatered, setLastWatered] = useState<Date | null>(null);

  // In a real app, these would be fetched from an API
  useEffect(() => {
    // Simulate fetching user data
    setTreeStage(3); // 0-5 stages of growth
    setLastWatered(new Date(Date.now() - 24 * 60 * 60 * 1000)); // 1 day ago
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      <div className="absolute bottom-0 h-20 w-48 rounded-t-full bg-amber-800"></div>

      {/* Tree trunk */}
      <motion.div
        className="absolute bottom-20 h-40 w-8 bg-amber-900"
        initial={{ height: 0 }}
        animate={{ height: 40 + treeStage * 20 }}
        transition={{ duration: 1, type: 'spring' }}
      />

      {/* Branches */}
      {treeStage >= 1 && (
        <>
          <motion.div
            className="absolute bottom-40 left-[calc(50%-4px)] h-4 w-20 bg-amber-900"
            initial={{ width: 0 }}
            animate={{ width: 20 + treeStage * 10 }}
            transition={{ duration: 0.8, type: 'spring', delay: 0.2 }}
          />
          <motion.div
            className="absolute bottom-50 right-[calc(50%-4px)] h-4 w-16 bg-amber-900"
            initial={{ width: 0 }}
            animate={{ width: 16 + treeStage * 8 }}
            transition={{ duration: 0.8, type: 'spring', delay: 0.4 }}
          />
        </>
      )}

      {/* Foliage */}
      {treeStage >= 1 && (
        <>
          <motion.div
            className="absolute bottom-44 left-[calc(50%-30px)] h-16 w-16 rounded-full bg-green-600"
            initial={{ scale: 0 }}
            animate={{ scale: 0.5 + treeStage * 0.1 }}
            transition={{ duration: 0.8, type: 'spring', delay: 0.6 }}
          />
          <motion.div
            className="absolute bottom-48 left-[calc(50%+10px)] h-20 w-20 rounded-full bg-green-700"
            initial={{ scale: 0 }}
            animate={{ scale: 0.5 + treeStage * 0.1 }}
            transition={{ duration: 0.8, type: 'spring', delay: 0.7 }}
          />
        </>
      )}

      {treeStage >= 2 && (
        <>
          <motion.div
            className="absolute bottom-60 left-[calc(50%-20px)] h-14 w-14 rounded-full bg-green-600"
            initial={{ scale: 0 }}
            animate={{ scale: 0.5 + treeStage * 0.1 }}
            transition={{ duration: 0.8, type: 'spring', delay: 0.8 }}
          />
          <motion.div
            className="absolute bottom-56 right-[calc(50%-5px)] h-18 w-18 rounded-full bg-green-700"
            initial={{ scale: 0 }}
            animate={{ scale: 0.5 + treeStage * 0.1 }}
            transition={{ duration: 0.8, type: 'spring', delay: 0.9 }}
          />
        </>
      )}

      {treeStage >= 3 && (
        <motion.div
          className="absolute bottom-70 left-[calc(50%-10px)] h-16 w-16 rounded-full bg-green-600"
          initial={{ scale: 0 }}
          animate={{ scale: 0.5 + treeStage * 0.1 }}
          transition={{ duration: 0.8, type: 'spring', delay: 1 }}
        />
      )}

      {treeStage >= 4 && (
        <>
          <motion.div
            className="absolute bottom-80 right-[calc(50%-15px)] h-12 w-12 rounded-full bg-green-700"
            initial={{ scale: 0 }}
            animate={{ scale: 0.5 + treeStage * 0.1 }}
            transition={{ duration: 0.8, type: 'spring', delay: 1.1 }}
          />
          <motion.div
            className="absolute bottom-76 left-[calc(50%+5px)] h-10 w-10 rounded-full bg-green-600"
            initial={{ scale: 0 }}
            animate={{ scale: 0.5 + treeStage * 0.1 }}
            transition={{ duration: 0.8, type: 'spring', delay: 1.2 }}
          />
        </>
      )}

      {treeStage >= 5 && (
        <>
          <motion.div
            className="absolute bottom-90 left-[calc(50%-5px)] h-8 w-8 rounded-full bg-green-700"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, type: 'spring', delay: 1.3 }}
          />
          <motion.div
            className="absolute bottom-88 right-[calc(50%-10px)] h-6 w-6 rounded-full bg-green-600"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, type: 'spring', delay: 1.4 }}
          />
        </>
      )}

      {/* Last watered info */}
      <div className="absolute bottom-0 mt-4 text-center text-sm text-gray-600">
        <p>Last check-in: {lastWatered ? lastWatered.toLocaleDateString() : 'Never'}</p>
      </div>
    </div>
  );
}
