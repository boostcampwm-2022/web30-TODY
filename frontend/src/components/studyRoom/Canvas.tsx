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
  const currentCoor = useRef({ x: 0, y: 0 });

  const draw = ({
    x1,
    y1,
    x2,
    y2,
  }: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }) => {
    if (!ctxRef.current) return;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x1, y1);
    ctxRef.current.lineTo(x2, y2);
    ctxRef.current.stroke();
  };

  const canvasMessageHandler = (e: MessageEvent) => {
    const body = JSON.parse(e.data);
    if (body.type !== 'canvas') return;
    draw(body);
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

  const sendCanvasEvent = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!sendDcRef.current) return;
    const mouseEvent = e.type;
    const coor = {
      x1: currentCoor.current.x,
      y1: currentCoor.current.y,
      x2: e.nativeEvent.offsetX,
      y2: e.nativeEvent.offsetY,
    };
    switch (mouseEvent) {
      case 'mousedown':
        isPaintingRef.current = true;
        currentCoor.current.x = e.nativeEvent.offsetX;
        currentCoor.current.y = e.nativeEvent.offsetY;
        break;
      case 'mouseleave':
        isPaintingRef.current = false;
        break;
      case 'mouseup':
        isPaintingRef.current = false;
        draw(coor);
        sendDcRef.current.send(JSON.stringify({ type: 'canvas', ...coor }));
        break;
      case 'mousemove':
        if (!isPaintingRef.current) return;
        draw(coor);
        sendDcRef.current.send(JSON.stringify({ type: 'canvas', ...coor }));
        currentCoor.current.x = e.nativeEvent.offsetX;
        currentCoor.current.y = e.nativeEvent.offsetY;
        break;
      default:
        break;
    }
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
