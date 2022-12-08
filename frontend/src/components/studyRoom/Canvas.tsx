import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (!receiveDataChannelRef.current) return;
    receiveDataChannelRef.current.addEventListener('message', (e) => {
      const body = JSON.parse(e.data);
      if (body.type !== 'canvas' || !ctxRef.current) return;
      console.log('receiveDC:', body);
      //   if (!isPaintingRef.current) {
      //     isPaintingRef.current = true;

      ctxRef.current?.beginPath();
      ctxRef.current?.moveTo(body.mouseX, body.mouseY);
      //   }
      ctxRef.current.lineTo(body.mouseX, body.mouseY);
      ctxRef.current.stroke();
    });
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#000000';
    ctxRef.current = ctx;
  }, []);

  const sendMouseMove = (e: any) => {
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;
    if (
      !(isPaintingRef.current && ctxRef.current && sendDataChannelRef.current)
    )
      return;
    const body = {
      type: 'canvas',
      mouseX,
      mouseY,
    };
    sendDataChannelRef.current.send(JSON.stringify(body));
  };

  const sendMouseDown = (e: any) => {
    isPaintingRef.current = true;
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;
  };

  const sendMouseUp = (e: any) => {
    isPaintingRef.current = false;
  };

  return (
    <CanvasLayout>
      <CanvasArea
        height={800}
        width={1000}
        ref={canvasRef}
        onMouseDown={sendMouseDown}
        onMouseMove={sendMouseMove}
        onMouseUp={sendMouseUp}
        onMouseLeave={sendMouseUp}
      />
    </CanvasLayout>
  );
}
