'use client'
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@nextui-org/button';
import { useRouter } from 'next/navigation';
import { Montserrat } from 'next/font/google';
const montserrat = Montserrat({
  weight: '600',
  subsets: ['latin'],
});

export default function App() {
  const router = useRouter();

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const stars = useRef([]);
  const velocity = useRef({ x: 0, y: 0, tx: 0, ty: 0, z: 0.0005 });
  let scale = 1;
  let width, height;
  let pointerX, pointerY;
  const STAR_COLOR = '#fff';
  const STAR_SIZE = 3;
  const STAR_MIN_SCALE = 0.2;
  const OVERFLOW_THRESHOLD = 50;

  useEffect(() => {
    const STAR_COUNT = (typeof window !== 'undefined' && (window.innerWidth + window.innerHeight)) / 8;

    const generate = () => {
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.current.push({
          x: 0,
          y: 0,
          z: STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE),
        });
      }
    };

    const placeStar = (star) => {
      star.x = Math.random() * width;
      star.y = Math.random() * height;
    };

    const recycleStar = (star) => {
      let direction = 'z';
      let vx = Math.abs(velocity.current.x),
        vy = Math.abs(velocity.current.y);

      if (vx > 1 || vy > 1) {
        let axis;

        if (vx > vy) {
          axis = Math.random() < vx / (vx + vy) ? 'h' : 'v';
        } else {
          axis = Math.random() < vy / (vx + vy) ? 'v' : 'h';
        }

        if (axis === 'h') {
          direction = velocity.current.x > 0 ? 'l' : 'r';
        } else {
          direction = velocity.current.y > 0 ? 't' : 'b';
        }
      }

      star.z = STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE);

      if (direction === 'z') {
        star.z = 0.1;
        star.x = Math.random() * width;
        star.y = Math.random() * height;
      } else if (direction === 'l') {
        star.x = -OVERFLOW_THRESHOLD;
        star.y = height * Math.random();
      } else if (direction === 'r') {
        star.x = width + OVERFLOW_THRESHOLD;
        star.y = height * Math.random();
      } else if (direction === 't') {
        star.x = width * Math.random();
        star.y = -OVERFLOW_THRESHOLD;
      } else if (direction === 'b') {
        star.x = width * Math.random();
        star.y = height + OVERFLOW_THRESHOLD;
      }
    };

    const resize = () => {
      scale = window.devicePixelRatio || 1;
      width = window.innerWidth * scale;
      height = window.innerHeight * scale;

      canvasRef.current.width = width;
      canvasRef.current.height = height;

      stars.current.forEach(placeStar);
    };

    const step = () => {
      contextRef.current.clearRect(0, 0, width, height);
      update();
      render();
      requestAnimationFrame(step);
    };

    const update = () => {
      velocity.current.tx *= 0.96;
      velocity.current.ty *= 0.96;

      velocity.current.x += (velocity.current.tx - velocity.current.x) * 0.8;
      velocity.current.y += (velocity.current.ty - velocity.current.y) * 0.8;

      stars.current.forEach((star) => {
        star.x += velocity.current.x * star.z;
        star.y += velocity.current.y * star.z;
        star.x += (star.x - width / 2) * velocity.current.z * star.z;
        star.y += (star.y - height / 2) * velocity.current.z * star.z;
        star.z += velocity.current.z;

        if (
          star.x < -OVERFLOW_THRESHOLD ||
          star.x > width + OVERFLOW_THRESHOLD ||
          star.y < -OVERFLOW_THRESHOLD ||
          star.y > height + OVERFLOW_THRESHOLD
        ) {
          recycleStar(star);
        }
      });
    };

    const render = () => {
      stars.current.forEach((star) => {
        contextRef.current.beginPath();
        contextRef.current.lineCap = 'round';
        contextRef.current.lineWidth = STAR_SIZE * star.z * scale;
        contextRef.current.globalAlpha = 0.5 + 0.5 * Math.random();
        contextRef.current.strokeStyle = STAR_COLOR;
        contextRef.current.beginPath();
        contextRef.current.moveTo(star.x, star.y);
        var tailX = velocity.current.x * 2,
          tailY = velocity.current.y * 2;

        if (Math.abs(tailX) < 0.1) tailX = 0.5;
        if (Math.abs(tailY) < 0.1) tailY = 0.5;

        contextRef.current.lineTo(star.x + tailX, star.y + tailY);
        contextRef.current.stroke();
      });
    };

    const movePointer = (x, y) => {
      if (typeof pointerX === 'number' && typeof pointerY === 'number') {
        let ox = x - pointerX,
          oy = y - pointerY;

        velocity.current.tx = velocity.current.tx + (ox / 8 * scale) * 1;
        velocity.current.ty = velocity.current.ty + (oy / 8 * scale) * 1;
      }

      pointerX = x;
      pointerY = y;
    };

    const onMouseMove = (event) => {
      movePointer(event.clientX, event.clientY);
    };

    const onTouchMove = (event) => {
      movePointer(event.touches[0].clientX, event.touches[0].clientY);
      event.preventDefault();
    };

    const onMouseLeave = () => {
      pointerX = null;
      pointerY = null;
    };

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    contextRef.current = context;
    generate();
    resize();
    step();

    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('touchmove', onTouchMove);
    canvas.addEventListener('touchend', onMouseLeave);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onMouseLeave);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <main className={montserrat.className}>
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}
    />
    <div className='w-full absolute flex justify-center'>
      <ul className='text-center pt-12'>
        <li className='mt-12'></li>
        <li className='pb-10'>
          <Image
            className='inline animate-custom-pulse rounded-lg mt-10'
            src="/../images/logo3.png"
            width={900}
            height={900}
            alt="antip2w"
          />
        </li>
        <li className='pt-10 inline pl-5 pr-5'>
          <Button size='lg' variant='ghost' onClick={() => router.push('/database')}>
            Database
          </Button>
        </li>
        <li className='pt-10 inline pl-5 pr-5'>
          <Button size='lg' variant='ghost' onClick={() => router.push('https://discord.gg/antip2w')}>
            Discord
          </Button>
        </li>
        <li className='pt-10 inline pl-5 pr-5'>
          <Button size='lg' variant='ghost' onClick={() => router.push('https://documenter.getpostman.com/view/33096435/2sA2rCV2oq')}>
            API
          </Button>
        </li>
      </ul>
    </div>
  </main>
  );
}