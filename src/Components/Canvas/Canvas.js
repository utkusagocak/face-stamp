import React, { useMemo } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import './Canvas.scss';
import stampMp3 from '../../assests/stamp-sound.mp3';
import armPng from '../../assests/arm.png';

import { FaceStamp, Arm, ARM_HEIGHT, ARM_WIDTH } from './Shapes';

const shapes = [];

export function clearCanvas() {
  const canvas = document.getElementById('stamp-canvas');
  if (canvas) {
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    shapes.splice(0, shapes.length);
  }
}

function Canvas({ imageUrl, ...props }) {
  const canvasRef = useRef();
  const image = useMemo(() => {
    const img = new Image();
    img.src = imageUrl;
    return img;
  }, [imageUrl]);

  const armImage = useMemo(() => {
    const img = new Image();
    img.src = armPng;
    return img;
  }, [armPng]);

  const audio = useMemo(() => {
    const aud = new Audio();
    aud.src = stampMp3;
    aud.load();
    return aud;
  });

  useEffect(() => {
    const canvas = canvasRef.current;

    const context = canvas.getContext('2d');
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;

    draw();
  }, []);

  function animateArm(arm) {
    draw();

    if (arm.isEndAnimation()) {
      const armIndex = shapes.findIndex((s) => s === arm);
      shapes.splice(armIndex, 1);
      draw();
    } else {
      if (arm.isStamp()) {
        console.log('stamp');
        audio.pause();
        audio.play();
        shapes.push(arm.applyStamp());
        shapes.sort((a, b) => a.zIndex - b.zIndex);
      }
      arm.nextFrame();
      window.requestAnimationFrame(() => animateArm(arm));
    }
  }

  function draw() {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    for (const shape of shapes) {
      shape.draw(context);
    }
  }

  return (
    <canvas
      id="stamp-canvas"
      ref={canvasRef}
      onMouseDown={(e) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        const degree = Math.floor(Math.random() * 360);
        // const degree = 275;
        const centerX = e.pageX - 50;
        const centerY = e.pageY - 50;
        if (image.complete) {
          const faceStamp = new FaceStamp({ image, centerX, centerY, rotation: degree });

          const slope = Math.tan((90 - degree) * (Math.PI / 180));
          const armLeft = slope * (0 - centerX) + -centerY;
          const armRight = slope * (context.canvas.width - centerX) + -centerY;
          const armTop = (0 - -centerY) / slope + centerX;
          const armBottom = (-context.canvas.height - -centerY) / slope + centerX;

          const leftDist = Math.abs(-centerY - armLeft) + centerX;
          const rightDist = Math.abs(-centerY - armRight) + context.canvas.width - centerX;
          const topDist = Math.abs(centerX - armTop) + centerY;
          const bottomDist = Math.abs(centerX - armBottom) + context.canvas.height - centerY;

          const minDist = Math.min(leftDist, rightDist, topDist, bottomDist);

          let startX = -ARM_HEIGHT;
          let startY = -ARM_HEIGHT;
          if (minDist === leftDist) {
            startY = -armLeft;
          } else if (minDist === rightDist) {
            startX = context.canvas.width + ARM_WIDTH;
            startY = -armRight;
          } else if (minDist === topDist) {
            startX = armTop;
          } else if (minDist === bottomDist) {
            startY = context.canvas.height + ARM_WIDTH;
            startX = armBottom;
          }

          var interPt = { x: centerX - startX, y: centerY - startY };
          const rotation = (Math.atan2(interPt.y, interPt.x) * 180) / Math.PI;

          const arm = new Arm({
            image: armImage,
            startX: startX,
            startY: startY,
            targetX: centerX,
            targetY: centerY,
            rotation: rotation + 90,
            stamp: faceStamp,
          });

          animateArm(arm, faceStamp);
          shapes.push(arm);
          shapes.sort((a, b) => a.zIndex - b.zIndex);
        }
      }}
    ></canvas>
  );
}

export default Canvas;
