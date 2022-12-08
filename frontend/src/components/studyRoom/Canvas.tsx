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
  sendDataChannelRef: React.RefObject<RTCDataChannel | null>;
  receiveDataChannelRef: React.RefObject<RTCDataChannel | null>;
}
export default function Canvas({
  sendDataChannelRef,
  receiveDataChannelRef,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const isPaintingRef = useRef<boolean>(false);

  const canvasMessageHandler = (e: any) => {
    const body = JSON.parse(e.data);
    if (body.type !== 'canvas' || !ctxRef.current) return;
    console.log(body);
    const { mouseX, mouseY, mouseEvent } = body;
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
    if (!receiveDataChannelRef.current || !sendDataChannelRef.current) return;
    receiveDataChannelRef.current.addEventListener(
      'message',
      canvasMessageHandler,
    );
    sendDataChannelRef.current.addEventListener(
      'message',
      canvasMessageHandler,
    );
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
    const mouseEvent = e.type;
    if (mouseEvent === 'mousemove' && !isPaintingRef.current) return;
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;
    if (!sendDataChannelRef.current) return;
    const body = {
      type: 'canvas',
      mouseEvent,
      mouseX,
      mouseY,
    };
    sendDataChannelRef.current.send(JSON.stringify(body));
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
