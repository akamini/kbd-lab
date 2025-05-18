'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

export function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // キーボードキーのような要素を動的に生成
    const keyCount = 30;
    const container = containerRef.current;
    container.innerHTML = '';

    const keys = [];
    const keySymbols = [
      'Esc',
      'Tab',
      'Shift',
      'Ctrl',
      'Alt',
      'Enter',
      'Space',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '0',
      '{',
      '}',
      '[',
      ']',
      '<',
      '>',
      '/',
      '\\',
      '|',
      ';',
      ':',
      '"',
      "'",
    ];

    for (let i = 0; i < keyCount; i++) {
      const key = document.createElement('div');
      key.className = 'key';
      const randomSymbol =
        keySymbols[Math.floor(Math.random() * keySymbols.length)];
      key.textContent = randomSymbol;
      key.style.position = 'absolute';
      key.style.left = `${Math.random() * 100}%`;
      key.style.top = `${Math.random() * 100}%`;
      key.style.backgroundColor = 'rgba(30, 30, 30, 0.7)';
      key.style.color = ['#61dafb', '#bb86fc', '#03dac6', '#cf6679'][
        Math.floor(Math.random() * 4)
      ];
      key.style.padding = '8px 12px';
      key.style.borderRadius = '4px';
      key.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
      key.style.fontSize = `${Math.max(12, Math.random() * 18)}px`;
      key.style.fontFamily = 'monospace';
      key.style.zIndex = '-1';
      key.style.transform = `rotate(${Math.random() * 360}deg)`;
      container.appendChild(key);
      keys.push(key);
    }

    // アニメーションの設定
    keys.forEach((key) => {
      const randomX = () => Math.random() * 100 - 50;
      const randomY = () => Math.random() * 100 - 50;
      const randomRotate = () => Math.random() * 720 - 360;
      const randomScale = () => Math.random() * 1 + 0.5;
      const randomDuration = () => Math.random() * 5000 + 3000;
      const randomDelay = () => Math.random() * 1000;

      const animation = animate(
        {
          targets: key,
          translateX: randomX() + 'vw',
          translateY: randomY() + 'vh',
          rotate: randomRotate(),
          scale: randomScale(),
          opacity: [0.4, 0.8],
          duration: randomDuration(),
          delay: randomDelay(),
          easing: 'easeInOutQuad',
          complete: function () {
            // アニメーションを繰り返す
            animation.restart();
          },
        },
        {}
      );
    });

    return () => {
      // クリーンアップ
      container.innerHTML = '';
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className='fixed inset-0 w-full h-full overflow-hidden pointer-events-none'
    />
  );
}
