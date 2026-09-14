import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';

export const FlyingSquirrel: React.FC = () => {
  const [message, setMessage] = useState<string>('안녕! 오늘도 다람쥐랑 힘내자람! 🐿️');
  const [showMessage, setShowMessage] = useState(false);
  const [acorns, setAcorns] = useState<{ id: number; x: number; y: number }[]>([]);

  const quotes = [
    '🐿️ 이번 주도 우리 팀 화이팅이야람!',
    '🌰 야간근무 조심해람! 피곤하면 도토리 먹어람!',
    '✈️ 출장 다녀오면 도토리 사다주기람!',
    '🏖️ 휴가 일정 너무 부럽다람! 잘 쉬다 와람!',
    '🎨 5살 어린이가 스케치북에 슥삭슥삭 그렸어람!'
  ];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setMessage(randomQuote);
    setShowMessage(true);

    // Drop an acorn!
    const newAcorn = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
    };
    setAcorns(prev => [...prev, newAcorn]);

    setTimeout(() => {
      setShowMessage(false);
    }, 3500);

    setTimeout(() => {
      setAcorns(prev => prev.filter(a => a.id !== newAcorn.id));
    }, 2000);
  };

  return (
    <>
      {/* Flying Squirrel Animation across the screen */}
      <motion.div
        className="fixed z-50 pointer-events-auto cursor-pointer group"
        initial={{ x: -100, y: 50 }}
        animate={{
          x: ['0vw', '90vw', '10vw', '50vw', '0vw'],
          y: [30, 120, 80, 150, 30],
          rotate: [-5, 10, -10, 5, -5],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        onClick={handleClick}
        title="클릭하면 다람쥐가 도토리를 주고 말을 걸어줘요!"
      >
        <div className="relative flex items-center">
          {/* Speech Bubble */}
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -top-14 left-10 bg-amber-50 border-2 border-amber-300 text-amber-900 px-3 py-1.5 rounded-2xl shadow-md text-base whitespace-nowrap z-50 font-bold flex items-center gap-1.5"
              style={{
                borderRadius: '25px 15px 25px 5px',
              }}
            >
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
              <span>{message}</span>
              <div className="absolute -bottom-2 left-4 w-3 h-3 bg-amber-50 border-r-2 border-b-2 border-amber-300 rotate-45"></div>
            </motion.div>
          )}

          {/* Flying Squirrel SVG / Drawing */}
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="bg-amber-100/90 backdrop-blur-xs p-2.5 rounded-full border-2 border-amber-400 shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
          >
            <div className="relative w-12 h-12 flex items-center justify-center text-2xl">
              🐿️
              {/* Little gliding cape lines */}
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute -right-2 -top-1 text-xs"
              >
                ✨
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Acorns dropped on click */}
      {acorns.map(acorn => (
        <motion.div
          key={acorn.id}
          initial={{ opacity: 1, scale: 1, x: acorn.x - 15, y: acorn.y - 15 }}
          animate={{ y: acorn.y + 60, opacity: 0, rotate: 360 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="fixed z-50 pointer-events-none text-2xl"
        >
          🌰
        </motion.div>
      ))}
    </>
  );
};
