'use client';

import { useEffect, useRef } from 'react';
import { animate, svg, stagger } from 'animejs';

const KbdLabLogo = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // SVGの描画可能な要素を作成
    const drawables = svg.createDrawable('.letter-path');

    // 文字のアニメーション
    animate(drawables, {
      draw: ['0 0', '0 1', '1 1'],
      easing: 'inOutQuad',
      duration: 2000,
      delay: stagger(100),
      loop: true,
    });
  }, []);

  return (
    <div className='w-full flex justify-center items-center'>
      <svg
        ref={svgRef}
        viewBox='0 0 400 120'
        width='100%'
        height='100%'
        className='max-w-lg'
      >
        {/* 背景 - モダンでギークなテーマ */}
        <defs>
          <linearGradient id='bgGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stopColor='#1a1a2e' />
            <stop offset='100%' stopColor='#16213e' />
          </linearGradient>
          <radialGradient
            id='glowGradient'
            cx='50%'
            cy='50%'
            r='50%'
            fx='50%'
            fy='50%'
          >
            <stop offset='0%' stopColor='rgba(43, 90, 237, 0.15)' />
            <stop offset='100%' stopColor='rgba(43, 90, 237, 0)' />
          </radialGradient>
        </defs>

        <rect width='400' height='120' rx='10' fill='url(#bgGradient)' />
        <rect width='400' height='120' rx='10' fill='url(#glowGradient)' />

        {/* ハイライト効果 */}
        <ellipse
          className='highlight'
          cx='200'
          cy='60'
          rx='160'
          ry='40'
          fill='rgba(43, 90, 237, 0.3)'
          opacity='0'
        />

        {/* K */}
        <path
          className='letter-path k-path'
          d='M50,30 L50,90 M50,60 L75,30 M50,60 L75,90'
          stroke='#61dafb'
          strokeWidth='8'
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='rgba(0, 0, 0, 0)'
        />

        {/* B */}
        <path
          className='letter-path b-path'
          d='M90,30 L90,90 M90,30 C115,30 115,60 90,60 C120,60 120,90 90,90'
          stroke='#61dafb'
          strokeWidth='8'
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='rgba(0, 0, 0, 0)'
        />

        {/* D */}
        <path
          className='letter-path d-path'
          d='M135,30 L135,90 M135,30 C165,30 165,90 135,90'
          stroke='#61dafb'
          strokeWidth='8'
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='rgba(0, 0, 0, 0)'
        />

        {/* ハイフン */}
        <path
          className='letter-path hyphen-path'
          d='M185,60 L215,60'
          stroke='#61dafb'
          strokeWidth='8'
          strokeLinecap='round'
          fill='rgba(0, 0, 0, 0)'
        />

        {/* L */}
        <path
          className='letter-path l-path'
          d='M230,30 L230,90 L255,90'
          stroke='#61dafb'
          strokeWidth='8'
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='rgba(0, 0, 0, 0)'
        />

        {/* A */}
        <path
          className='letter-path a-path'
          d='M270,90 L285,30 L300,90 M275,70 L295,70'
          stroke='#61dafb'
          strokeWidth='8'
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='rgba(0, 0, 0, 0)'
        />

        {/* B */}
        <path
          className='letter-path b2-path'
          d='M315,30 L315,90 M315,30 C340,30 340,60 315,60 C345,60 345,90 315,90'
          stroke='#61dafb'
          strokeWidth='8'
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='rgba(0, 0, 0, 0)'
        />
      </svg>
    </div>
  );
};

export default KbdLabLogo;
