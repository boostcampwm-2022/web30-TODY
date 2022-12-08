import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const CanvasLayout = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
`;
const CanvasArea = styled.canvas`
  background-color: white;
  border: 1px solid black;
`;

interface Props {
  sendDcRef: React.RefObject<RTCDataChannel | null>;
  receiveDcs: { [socketId: string]: RTCDataChannel };
}
export default function Canvas({ sendDcRef, receiveDcs }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const isPaintingRef = useRef<boolean>(false);

  const canvasMessageHandler = (e: any) => {
    const body = JSON.parse(e.data);
    if (body.type !== 'canvas' || !ctxRef.current) return;
    console.log(body);
    const { mouseX, mouseY, mouseEvent, isPainting } = body;
    switch (mouseEvent) {
      case 'mousedown':
        isPaintingRef.current = true;
        ctxRef.current.beginPath();
        ctxRef.current.moveTo(mouseX, mouseY);
        break;
      case 'mouseleave':
      case 'mouseup':
        isPaintingRef.current = false;
        break;
      case 'mousemove':
        if (!isPaintingRef.current) return;
        ctxRef.current.lineTo(body.mouseX, body.mouseY);
        ctxRef.current.stroke();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    Object.values(receiveDcs).forEach((receiveDc) => {
      receiveDc.addEventListener('message', canvasMessageHandler);
    });
  }, [receiveDcs]);

  useEffect(() => {
    sendDcRef.current?.addEventListener('message', canvasMessageHandler);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#000000';
    ctxRef.current = ctx;
  }, []);

  const localIsDrawing = useRef<boolean>(false);

  const sendCanvasEvent = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const mouseEvent = e.type;
    if (mouseEvent === 'mousedown') {
      localIsDrawing.current = true;
    } else if (mouseEvent === 'mouseup') {
      localIsDrawing.current = false;
    }
    if (mouseEvent === 'mousemove' && !localIsDrawing.current) return;
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;
    const body = {
      type: 'canvas',
      isPainting: isPaintingRef.current,
      mouseEvent,
      mouseX,
      mouseY,
    };
    sendDcRef.current?.send(JSON.stringify(body));
  };

  return (
    <CanvasLayout>
      <CanvasArea
        height={800}
        width={1000}
        ref={canvasRef}
        onMouseDown={sendCanvasEvent}
        onMouseMove={sendCanvasEvent}
        onMouseUp={sendCanvasEvent}
        onMouseLeave={sendCanvasEvent}
      />
    </CanvasLayout>
  );
}
