import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ArrowRight, Volume2, ArrowDown, VolumeX } from 'lucide-react';
import { Character } from './components/Character';
import { LetterModal } from './components/LetterModal';

export default function App() {
  const [isQuansMoving, setIsQuansMoving] = useState(true);
  const [isTitMoving, setIsTitMoving] = useState(false);
  const [isHoldingLetter, setIsHoldingLetter] = useState(false);
  const [isTitHoldingLetter, setIsTitHoldingLetter] = useState(false);
  const [isTitReaching, setIsTitReaching] = useState(false);
  const [showInvitation, setShowInvitation] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatStep, setChatStep] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const preferredMusicUrl = import.meta.env.VITE_BACKGROUND_MUSIC_URL || new URL('../beauty-and-a-beat.mp3', import.meta.url).href;

  useEffect(() => {
    if (!musicRef.current) {
      const music = new Audio(preferredMusicUrl);
      music.loop = true;
      music.volume = 0.35;
      music.onerror = () => {
        if (music.src.endsWith('/beauty-and-a-beat.mp3')) {
          music.src = new URL('../adam_voice.wav', import.meta.url).href;
          music.play().catch(() => {});
        }
      };
      musicRef.current = music;
    }

    const music = musicRef.current;
    if (!music) {
      return;
    }

    if (isAudioEnabled) {
      music.play().catch(() => {});
    } else {
      music.pause();
    }

    return () => {
      music.pause();
    };
  }, [isAudioEnabled]);

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  const handleAnimationComplete = () => {
    setIsQuansMoving(false);
    setTimeout(() => {
      setIsTitMoving(true);
    }, 500);
  };

  const handleTitArrived = () => {
    setIsTitMoving(false);
    // Start Chat Sequence
    setTimeout(() => {
      setChatStep(1); // Quắn: "Anh có này cho em nè"
      setTimeout(() => {
        setChatStep(2); // Tít: "Cái gì dạ"
        setTimeout(() => {
          setChatStep(3); // Quắn: "Một lá thư, em mở ra đi"
          setTimeout(() => {
            setChatStep(4);
            setIsHoldingLetter(true);
            setTimeout(() => {
              // Tít starts reaching
              setIsTitReaching(true);
              setChatStep(0); 
              setShowInvitation(false); 
              setTimeout(() => {
                // Hand-off
                setIsTitReaching(false);
                setIsHoldingLetter(false);
                setIsTitHoldingLetter(true);
                setShowInvitation(true);
              }, 1000);
            }, 1000);
          }, 2000);
        }, 2000);
      }, 2000);
    }, 500);
  };

  const ChatBubble = ({ text, side }: { text: string; side: 'left' | 'right' }) => (
    <motion.div 
      initial={{ scale: 0, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0, opacity: 0 }}
      className={`absolute -top-20 ${side === 'left' ? 'left-0' : 'right-0'} z-50`}
    >
      <div className={`relative bg-white text-black px-4 py-2 border-[3px] border-black shadow-[4px_4px_0_rgba(102,126,234,0.5)] font-vn font-bold text-[10px] md:text-sm whitespace-nowrap`}>
        {text}
        {/* Pixel tail */}
        <div className={`absolute -bottom-[11px] ${side === 'left' ? 'left-4' : 'right-4'} w-3 h-3`}>
          <div className="absolute top-0 left-0 w-full h-full bg-white border-r-[3px] border-b-[3px] border-black rotate-45 transform" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#05051a]">
      {/* Starry Sky */}
      <div className="absolute inset-0 z-0">
        {[...Array(50)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: Math.random() * 2 + 'px',
              height: Math.random() * 2 + 'px',
              top: Math.random() * 60 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.2
            }}
          />
        ))}

        {/* Moving Clouds */}
        {[...Array(6)].map((_, i) => (
          <div 
            key={`cloud-${i}`}
            className="cloud"
            style={{
              width: (100 + Math.random() * 100) + 'px',
              height: (20 + Math.random() * 20) + 'px',
              top: (10 + Math.random() * 30) + '%',
              '--duration': (40 + Math.random() * 40) + 's',
              animationDelay: `-${Math.random() * 40}s`
            } as any}
          />
        ))}
      </div>

      {/* Distant Moon */}
      <div className="absolute top-10 right-10 md:top-20 md:right-32 w-24 h-24 md:w-40 md:h-40 bg-[#fffde0] rounded-full blur-[2px] shadow-[0_0_80px_rgba(255,253,224,0.4)] z-0 flex items-center justify-center overflow-hidden">
        <div className="absolute top-8 left-10 w-8 h-8 bg-black/5 rounded-full" />
        <div className="absolute bottom-10 right-12 w-10 h-10 bg-black/5 rounded-full" />
      </div>

      {/* Decorative Buildings */}
      <div className="absolute bottom-[10%] w-full flex items-end justify-around px-12 z-5 opacity-30 pointer-events-none mb-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-16 md:w-32 bg-black border-x-4 border-t-4 border-[#1a1a4a]" style={{ height: (80 + Math.random() * 150) + 'px' }}>
            <div className="grid grid-cols-2 gap-2 p-2">
              {[...Array(6)].map((_, j) => (
                <div key={j} className={`w-2 h-2 ${Math.random() > 0.6 ? 'bg-yellow-400' : 'bg-gray-800'}`} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Street Lamps Decor */}
      <div className="absolute bottom-[9vh] w-full flex justify-between px-10 md:px-32 z-12 pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="relative flex flex-col items-center">
             <div className="pixel-lamp-glow" />
             <div className="pixel-lamp-top">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white/40 rounded-full blur-[1px]" />
             </div>
             <div className="pixel-lamp" />
          </div>
        ))}
      </div>

      {/* City Silhouette */}
      <div className="absolute bottom-[10%] w-full h-[60%] z-6 pointer-events-none">
        <div className="absolute bottom-0 w-full h-full city-silhouette opacity-60" />
        {/* Lights on Buildings */}
        {[...Array(20)].map((_, i) => (
          <motion.div 
            key={i}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ repeat: Infinity, duration: Math.random() * 3 + 2, delay: Math.random() * 2 }}
            className="absolute w-1.5 h-1.5 bg-yellow-400/60"
            style={{
              bottom: (Math.random() * 30 + 10) + '%',
              left: (Math.random() * 100) + '%'
            }}
          />
        ))}
      </div>

      {/* The Street Stage */}
      <div className="absolute bottom-0 w-full h-[12vh] bg-[#0c0c1a] border-t-8 border-[#3b3b5c] z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-white/5 text-2xl md:text-5xl font-bold tracking-[0.2em] whitespace-nowrap pointer-events-none select-none uppercase">
          Quận Chỉ Có Anh Và Em
        </div>
      </div>

      {/* Characters Layer */}
      <div className="absolute bottom-[9vh] w-full flex items-end justify-center z-20 px-4 md:px-12">
        <div className="relative w-full max-w-4xl flex items-end justify-between">
          
          {/* Quắn */}
          <motion.div 
            initial={{ left: '-20%' }}
            animate={{ left: '32%' }}
            transition={{ duration: 4, ease: "linear", delay: 0.5 }}
            onAnimationComplete={handleAnimationComplete}
            className="absolute bottom-0"
          >
            {isQuansMoving && (
              <div className="absolute -left-4 top-1/2 -translate-y-1/2">
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0.5], y: [0, -20, -40] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="text-red-500 text-xs"
                >
                  ❤️
                </motion.div>
              </div>
            )}
            <Character 
              name="Quắn" 
              type="male" 
              isWalking={isQuansMoving} 
              isHoldingOutLetter={isHoldingLetter} 
            />
            
            <AnimatePresence>
              {chatStep === 1 && <ChatBubble text="Anh có cái này cho em nè!" side="left" />}
              {chatStep === 3 && <ChatBubble text="Một lá thư... em mở ra xem đi!" side="left" />}
            </AnimatePresence>
          </motion.div>

          {/* Tít */}
          <motion.div 
            initial={{ right: '12%' }}
            animate={{ right: isTitMoving || isHoldingLetter || isTitHoldingLetter || chatStep > 0 ? '38%' : '12%' }}
            transition={{ duration: 3, ease: "linear" }}
            onAnimationComplete={() => {
              if (isTitMoving) handleTitArrived();
            }}
            className="absolute bottom-0"
          >
            <Character 
              name="Tít" 
              type="female" 
              isWalking={isTitMoving} 
              isHoldingOutLetter={isTitHoldingLetter}
              isReachingForLetter={isTitReaching}
            />
            
            <AnimatePresence>
              {chatStep === 2 && <ChatBubble text="Cái gì dạ anh?" side="right" />}
            </AnimatePresence>

            {/* Simplified Instructions below character */}
            <AnimatePresence>
              {showInvitation && !isModalOpen && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed bottom-[3vh] left-1/2 -translate-x-1/2 cursor-pointer z-[60] py-4 pointer-events-auto"
                  onClick={() => setIsModalOpen(true)}
                >
                  <div className="whitespace-nowrap text-[8px] md:text-[10px] text-white opacity-60 font-bold uppercase tracking-widest animate-pulse">
                    💌 NHẤN VÀO LÁ THƯ ĐỂ MỞ
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Letter Modal */}
      <LetterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Global Sound Indicator - Clickable */}
      <button
        onClick={toggleAudio}
        className="fixed top-6 left-6 z-40 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="bg-[#05051a]/80 border-4 border-white p-2 flex items-center gap-3 shadow-[4px_4px_0_rgba(0,0,0,0.5)] hover:bg-[#05051a]/95"
        >
          <div className="bg-white text-[#05051a] p-1.5 flex items-center justify-center">
             {isAudioEnabled ? (
               <Volume2 size={14} strokeWidth={3} />
             ) : (
               <VolumeX size={14} strokeWidth={3} />
             )}
          </div>
          <div className="text-[9px] text-white font-pixel tracking-widest">
            {isAudioEnabled ? 'AUDIO: ON' : 'AUDIO: OFF'}
          </div>
        </motion.div>
      </button>
    </div>
  );
}
