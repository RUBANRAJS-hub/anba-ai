import React, { useState, useEffect } from 'react';

export default function FloatingHearts({ ambient = true, interactive = true }) {
  const [hearts, setHearts] = useState([]);

  // Handle ambient floating hearts
  useEffect(() => {
    if (!ambient) return;

    const interval = setInterval(() => {
      const id = Math.random().toString(36).substring(2, 9);
      const size = Math.random() * 20 + 10; // 10px to 30px
      const left = Math.random() * 100; // 0% to 100%
      const duration = Math.random() * 4 + 4; // 4s to 8s
      const scale = Math.random() * 0.4 + 0.6; // 0.6 to 1.0

      const newHeart = {
        id,
        style: {
          left: `${left}%`,
          width: `${size}px`,
          height: `${size}px`,
          animationDuration: `${duration}s`,
          transform: `scale(${scale})`,
          bottom: '-50px',
          opacity: Math.random() * 0.4 + 0.2,
        },
        character: ['❤️', '💖', '💗', '💕', '💘'][Math.floor(Math.random() * 5)]
      };

      setHearts(prev => [...prev, newHeart]);

      // Remove after animation completes
      setTimeout(() => {
        setHearts(prev => prev.filter(h => h.id !== id));
      }, duration * 1000);
    }, 2000);

    return () => clearInterval(interval);
  }, [ambient]);

  // Click handler to trigger bursts
  useEffect(() => {
    if (!interactive) return;

    const handleClick = (e) => {
      const clickHearts = [];
      const numHearts = 6;
      
      for (let i = 0; i < numHearts; i++) {
        const id = Math.random().toString(36).substring(2, 9);
        const size = Math.random() * 15 + 12; // 12px to 27px
        const angle = (i / numHearts) * 360 + (Math.random() * 30 - 15);
        const rad = (angle * Math.PI) / 180;
        
        // Target translation coordinate for CSS custom variables
        const xDist = Math.cos(rad) * (Math.random() * 80 + 40);
        const yDist = Math.sin(rad) * (Math.random() * 80 + 40) - 50; // offset upwards
        const rotate = Math.random() * 90 - 45;

        const newHeart = {
          id,
          style: {
            left: `${e.clientX - size / 2}px`,
            top: `${e.clientY - size / 2}px`,
            width: `${size}px`,
            height: `${size}px`,
            position: 'fixed',
            zIndex: 9999,
            pointerEvents: 'none',
            '--tw-heart-x': `${xDist}px`,
            '--tw-heart-y': `${yDist}px`,
            '--tw-heart-r': `${rotate}deg`,
          },
          className: 'animate-heart-pop',
          character: ['❤️', '💖', '💗', '💕', '✨'][Math.floor(Math.random() * 5)]
        };
        clickHearts.push(newHeart);

        setTimeout(() => {
          setHearts(prev => prev.filter(h => h.id !== id));
        }, 1500);
      }

      setHearts(prev => [...prev, ...clickHearts]);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [interactive]);

  return (
    <>
      {hearts.map(heart => (
        <span
          key={heart.id}
          className={`absolute select-none pointer-events-none transition-opacity duration-1000 ${heart.className || ''}`}
          style={heart.style}
        >
          {heart.character}
        </span>
      ))}
    </>
  );
}
