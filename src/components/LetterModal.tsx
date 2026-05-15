import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Heart } from 'lucide-react';

interface LetterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LETTER_CONTENT = `Này nàng ơi,

Em có nhớ năm ngoái có hai đứa không ưa nhau mà va vào nhau một phát mà dính tới tận giờ không? Nhờ cái vụ va chạm lịch sử đó mà mới có anh Quắn và em Tít của hiện tại nè.

Để kỷ niệm tròn 365 ngày "var" nhau, anh xin cắn em một phát... à nhầm, anh có chuẩn bị một buổi tối thật chill để tụi mình cùng hâm nóng tình cảm nha. Mọi thứ đều là bí mật đến phút cuối, nhưng đây là cái Itinerary để em chuẩn bị tinh thần:

19:00 | Bắt đầu hành trình: Anh sẽ qua đón em tại Co.opmart Tam Bình. Em thì xinh, còn anh thì driver nhée.
19:30 | Tọa độ bí mật: Sau 30 phút vi vu phố phường, mình sẽ đáp xuống một không gian Nhật Bản siêu ấm cúng ở một Quận "chỉ có anh và em" (chưa date ở đây bao giờ).
19:45 | Menu "The First Year" & Live Band: Thưởng thức những món ngon anh đã chọn sẵn hòa cùng giai điệu acoustic cực vibes tại quán.
21:00 | Ghi lại khoảnh khắc: Thời gian để mình cùng ngồi lại, dành cho nhau những điều bất ngờ và lưu lại vài tấm hình kỷ niệm.
21:30 | City Night Tour: Lượn lờ phố xá tầm 30 phút để hít thở không khí của những ngày mưa đầu mùa, ngắm Sài Gòn về đêm.
22:00 | On the way home: Mình sẽ bắt đầu hành trình về lại nhà (tầm 30 phút nữa nè).
22:30 | Grand Finale: Xác định "điểm yếu" đã an toàn kèm một lời cảm ơn chân thành nhất vì đã ở bên anh suốt 1 năm qua. Nhạc Max Verstappen vang lên, anh phi về nhàa.

Dress code: Một nụ cười rạng rỡ và xinh xắn như mọi khi là đủ "đốn tim" anh rồi.

Hẹn gặp em vào 19 giờ tối Thứ Bảy tuần này nhée!`;

export const LetterModal: React.FC<LetterModalProps> = ({ isOpen, onClose }) => {
  const [displayText, setDisplayText] = useState('');
  const [showButtons, setShowButtons] = useState(false);
  const [dodgePos, setDodgePos] = useState({ x: 0, y: 0 });
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const dowThuPdfUrl = new URL('../../DowThu.pdf', import.meta.url).href;
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Start text animation with slower speed (60ms per character)
      let index = 0;
      const timer = setInterval(() => {
        setDisplayText(LETTER_CONTENT.slice(0, index));
        index++;
        if (index > LETTER_CONTENT.length) {
          clearInterval(timer);
          setShowButtons(true);
        }
        if (textRef.current) {
          textRef.current.scrollTop = textRef.current.scrollHeight;
        }
      }, 60); // Changed from 20 to 60ms for slower text animation

      // Start speech synthesis
      const utterance = new SpeechSynthesisUtterance(LETTER_CONTENT);
      utterance.lang = 'vi-VN'; // Vietnamese language
      utterance.rate = 0.9; // Slower speech rate to match text animation
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Try to select Adam voice if available
      const voices = window.speechSynthesis.getVoices();
      const adamVoice = voices.find(v => v.name.includes('Adam') || v.name.includes('adam'));
      if (adamVoice) {
        utterance.voice = adamVoice;
      }

      // Start speaking after a short delay
      setTimeout(() => {
        window.speechSynthesis.cancel(); // Cancel any ongoing speech
        window.speechSynthesis.speak(utterance);
      }, 300);

      return () => {
        clearInterval(timer);
        window.speechSynthesis.cancel();
      };
    } else {
      setDisplayText('');
      setShowButtons(false);
      setIsConfirmed(false);
      window.speechSynthesis.cancel();
    }
  }, [isOpen]);

  const handleDodge = () => {
    const rangeX = window.innerWidth * 0.8;
    const rangeY = window.innerHeight * 0.8;
    
    setDodgePos({
      x: (Math.random() - 0.5) * rangeX,
      y: (Math.random() - 0.5) * rangeY,
    });
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    
    const duration = 10 * 1000;
    const animationEnd = Date.now() + duration;
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 100 * (timeLeft / duration);
      
      confetti({ 
        particleCount: Math.floor(particleCount),
        spread: randomInRange(50, 100),
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#ff0000', '#ff69b4', '#ff1493', '#ff85a2'],
        shapes: ['circle'],
        scalar: randomInRange(0.5, 1.2),
        ticks: 200
      });
      
    }, 250);

    confetti({
      particleCount: 200,
      spread: 160,
      origin: { y: 0.6 },
      colors: ['#ff0000', '#ff69b4'],
      shapes: ['circle'],
      ticks: 300,
      gravity: 0.8,
      scalar: 2
    });

    const audio = new Audio('https://www.myinstants.com/media/sounds/super-max-stadium-mix-short.mp3'); 
    audio.play().catch(e => console.log("Audio play blocked by browser", e));
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      const response = await fetch(dowThuPdfUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch DowThu.pdf: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'DowThu.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <AnimatePresence>
        {!isConfirmed ? (
          <motion.div 
            initial={{ scale: 0, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            className="pixel-border w-full max-w-[96vw] md:max-w-2xl max-h-[92dvh] md:max-h-[85vh] flex flex-col p-4 md:p-10 bg-[#fffcf0] text-black border-[6px] border-black shadow-[16px_16px_0_rgba(0,0,0,0.5)]"
            style={{ 
              backgroundImage: 'radial-gradient(#d1d5db 1.5px, transparent 1.5px)',
              backgroundSize: '30px 30px',
              backgroundColor: '#fffcf0'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 md:mb-8 border-b-[6px] border-black pb-3 md:pb-4 bg-white/50 px-3 md:px-4 -mx-4 md:-mx-10 mt-[-1rem] md:mt-[-2.5rem]">
              <div className="flex gap-2">
                 <div className="w-4 h-4 bg-red-500 pixel-border-small" />
                 <div className="w-4 h-4 bg-yellow-400 pixel-border-small" />
                 <div className="w-4 h-4 bg-green-500 pixel-border-small" />
              </div>
              <h2 className="text-[10px] md:text-lg font-pixel tracking-widest font-bold">Secret Letter</h2>
              <div className="text-base md:text-xl">❤️</div>
            </div>

            <div className="flex-1 overflow-y-auto mb-4 md:mb-6 pr-2 md:pr-4 scrollbar-thin scrollbar-thumb-gray-400 font-vn" ref={textRef}>
              <p className="whitespace-pre-wrap leading-relaxed text-[11px] md:text-sm font-medium text-gray-900">
                {displayText}
                {!showButtons && <span className="blink inline-block w-2 h-4 bg-black ml-1 align-middle" />}
              </p>
              
              {showButtons && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 md:mt-8 p-3 md:p-4 bg-pink-100 border-[4px] border-black border-dashed text-center shadow-[6px_6px_0_rgba(244,114,182,0.3)]"
                >
                  <p className="text-nes-primary font-bold text-sm md:text-xl font-vn italic mb-2">
                    "Em có chấp nhận lời mời này của Quắn không?"
                  </p>
                  <div className="flex justify-center gap-1 text-red-500">
                    {[...Array(5)].map((_, i) => <Heart key={i} size={14} fill="currentColor" />)}
                  </div>
                </motion.div>
              )}
            </div>

            {showButtons && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 md:gap-10 relative mt-auto py-3 md:py-4">
                <button 
                  id="confirm-button"
                  onClick={handleConfirm}
                  className="w-full sm:w-auto bg-nes-success text-white px-6 md:px-10 py-3 md:py-5 cursor-pointer hover:bg-[#86efac] hover:-translate-y-1 transition-all pixel-shadow border-4 border-black font-pixel uppercase tracking-widest text-[11px] md:text-base active:translate-y-1"
                >
                  ACCEPT ❤️
                </button>

                <motion.button 
                  id="reject-button"
                  animate={{ x: dodgePos.x, y: dodgePos.y }}
                  transition={{ type: 'spring', stiffness: 600, damping: 12 }}
                  onMouseEnter={handleDodge}
                  onClick={handleDodge}
                  whileHover={{ scale: 1.05 }}
                  className="w-full sm:w-auto bg-[#ff0000] text-white px-6 md:px-10 py-3 md:py-5 cursor-pointer hover:bg-red-400 transition-all pixel-shadow border-4 border-black font-pixel uppercase tracking-widest text-[11px] md:text-base active:translate-y-1"
                >
                  DECLINE 💔
                </motion.button>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div 
                key={i}
                initial={{ y: '100vh', opacity: 0, scale: 0 }}
                animate={{ y: '-10vh', opacity: [0, 1, 1, 0], scale: [0, 1.5, 1, 0.5] }}
                transition={{ 
                  duration: Math.random() * 4 + 3,
                  repeat: Infinity,
                  delay: Math.random() * 3
                }}
                className="absolute text-red-500 text-3xl z-10"
                style={{ left: `${Math.random() * 100}%` }}
              >
                ❤️
              </motion.div>
            ))}
            
            <motion.div 
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              className="relative z-20 text-center p-5 md:p-12 bg-white border-[12px] border-black max-w-[92vw] md:max-w-2xl shadow-[20px_20px_0_#4ade80]"
            >
              <div className="absolute -top-10 md:-top-16 left-1/2 -translate-x-1/2 bg-nes-success text-black px-4 md:px-8 py-2 md:py-3 font-pixel border-4 border-black shadow-[6px_6px_0_#000] rotate-3 text-[9px] md:text-base">
                 MISSION ACCOMPLISHED!
              </div>

              <div className="text-nes-success text-6xl md:text-8xl mb-4 md:mb-8 animate-bounce">
                ❤️
              </div>
              
              <h1 className="text-xl md:text-5xl text-black mb-4 md:mb-8 leading-tight font-vn font-bold uppercase tracking-tighter">
                HẸN GẶP CÔ TÍT VÀO <span className="text-nes-primary">19H THỨ BẢY</span> NÀY NHÉ!
              </h1>

              <div className="bg-gray-100 p-4 md:p-6 border-4 border-black border-dashed mb-6 md:mb-10">
                <p className="text-sm md:text-2xl text-nes-warning font-pixel animate-pulse drop-shadow-sm">TU DU DU DU! SUPER MAX!</p>
              </div>

              <button 
                onClick={handleDownload}
                disabled={isDownloading}
                className="group relative bg-[#05051a] text-white px-6 md:px-10 py-3 md:py-4 font-pixel text-[9px] md:text-xs border-4 border-black shadow-[8px_8px_0_#000] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
              >
                <span className="relative z-10">
                  {isDownloading ? '[ ĐANG TẢI... ]' : '[ CHÁY QUÁ EM ƠI! ]'}
                </span>
                {!isDownloading && <div className="absolute inset-0 bg-nes-success scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />}
              </button>
            </motion.div>

            {/* Retro Sunbeam/Radial Glow in background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] bg-[radial-gradient(circle,rgba(74,222,128,0.2)_0%,transparent_70%)] animate-pulse" />
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
