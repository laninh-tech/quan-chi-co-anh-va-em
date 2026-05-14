import React from 'react';
import { motion } from 'motion/react';

interface CharacterProps {
  name: 'Quắn' | 'Tít';
  type: 'male' | 'female';
  isWalking?: boolean;
  isHoldingOutLetter?: boolean;
  isReachingForLetter?: boolean;
}

export const Character: React.FC<CharacterProps> = ({ 
  name, 
  type, 
  isWalking = false, 
  isHoldingOutLetter = false,
  isReachingForLetter = false
}) => {
  const isMale = type === 'male';

  return (
    <motion.div 
      animate={isWalking ? { y: [0, -6, 0] } : {}}
      transition={isWalking ? { repeat: Infinity, duration: 0.4 } : {}}
      className="flex flex-col items-center gap-2 group"
    >
      {/* Name Label Above Head */}
      <div className="bg-white/90 text-black px-3 py-0.5 text-[9px] pixel-shadow font-bold border-2 border-black z-30 mb-1">
        {name}
      </div>

      {/* Sprite Container */}
      <div className="relative w-24 h-36 flex items-end justify-center">
        {/* Head Construction */}
        <div 
          className={`absolute top-2 left-3 w-18 h-18 ${isMale ? 'bg-[#ffdbac]' : 'bg-[#ffe0bd]'} border-[3px] border-black z-20`}
          style={{ 
            clipPath: 'polygon(0 15%, 15% 15%, 15% 0, 85% 0, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0 85%)'
          }}
        >
          {/* Eyes */}
          <div className="absolute top-9 left-3 flex gap-0.5">
            <div className="w-4 h-4 bg-white border-[2px] border-black flex items-end">
              <div className="w-1.5 h-1.5 bg-black ml-0.5 mb-0.5" />
            </div>
          </div>
          <div className="absolute top-9 right-3 flex gap-0.5">
            <div className="w-4 h-4 bg-white border-[2px] border-black flex items-end">
              <div className="w-1.5 h-1.5 bg-black ml-0.5 mb-0.5" />
            </div>
          </div>

          {!isMale && (
            <>
              <div className="absolute top-13 left-2 w-2 h-1 bg-pink-400 opacity-50" />
              <div className="absolute top-13 right-2 w-2 h-1 bg-pink-400 opacity-50" />
            </>
          )}

          {/* Hair */}
          <div className={`absolute top-0 left-0 w-full h-6 ${isMale ? 'bg-[#2b1b17]' : 'bg-[#4a2c2a]'} overflow-hidden`}>
             <div className="absolute top-0 left-0 w-full h-2 bg-black/20" />
          </div>
          <div className={`absolute top-5 left-0 w-4 h-3 ${isMale ? 'bg-[#2b1b17]' : 'bg-[#4a2c2a]'}`} />
          <div className={`absolute top-5 right-0 w-4 h-3 ${isMale ? 'bg-[#2b1b17]' : 'bg-[#4a2c2a]'}`} />
          {!isMale && (
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-pink-500 rounded-full" />
          )}
        </div>

        {!isMale && (
          <div className="absolute top-6 left-1 w-22 h-20 bg-[#4a2c2a] border-[3px] border-black z-10" 
               style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 80% 100%, 80% 90%, 20% 90%, 20% 100%, 0 100%)' }} />
        )}

        {/* Body */}
        <div className={`absolute top-20 left-6 w-12 h-12 ${isMale ? 'bg-[#3b82f6]' : 'bg-[#ec4899]'} border-[3px] border-black z-15 shadow-[inset_-4px_-4px_0_rgba(0,0,0,0.2)]`} />

        {/* Left Arm */}
        <motion.div 
          animate={isWalking ? { rotate: [15, -15, 15] } : {}}
          transition={{ repeat: Infinity, duration: 0.4 }}
          className={`absolute top-20 left-1 w-5 h-9 ${isMale ? 'bg-[#3b82f6]' : 'bg-[#ec4899]'} border-[3px] border-black origin-top z-10`} 
        />

        {/* Right Arm (The one that holds or reaches for the letter) */}
        <motion.div 
          animate={isHoldingOutLetter || isReachingForLetter ? { rotate: isMale ? -90 : 90, x: isMale ? 10 : -10 } : isWalking ? { rotate: [-15, 15, -15] } : {}}
          transition={isHoldingOutLetter || isReachingForLetter ? { type: 'spring', stiffness: 100 } : { repeat: Infinity, duration: 0.4 }}
          className={`absolute top-20 right-1 w-5 h-9 ${isMale ? 'bg-[#3b82f6]' : 'bg-[#ec4899]'} border-[3px] border-black origin-top z-15`} 
        >
          {isHoldingOutLetter && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -bottom-6 -right-4 w-10 h-8 bg-pink-200 border-2 border-black flex items-center justify-center relative shadow-md"
            >
              <div className="absolute inset-0 border-b-2 border-pink-300 pointer-events-none" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 50%)' }} />
              <div className="text-red-500 text-[10px] z-10 leading-none">❤️</div>
            </motion.div>
          )}
        </motion.div>

        {/* Legs */}
        <motion.div 
          animate={isWalking ? { height: [22, 16, 22] } : {}}
          transition={{ repeat: Infinity, duration: 0.2 }}
          className="absolute top-31 left-6 w-5 h-[22px] bg-[#1e293b] border-[3px] border-black z-5" 
        />
        <motion.div 
          animate={isWalking ? { height: [16, 22, 16] } : {}}
          transition={{ repeat: Infinity, duration: 0.2 }}
          className="absolute top-31 right-6 w-5 h-[22px] bg-[#1e293b] border-[3px] border-black z-5" 
        />
      </div>
    </motion.div>
  );
};
