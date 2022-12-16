import CustomButton from '@components/common/CustomButton';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const CanvasLayout = styled.div`
  position: relative;
  display: none;

  &.active {
    height: 100%;
    display: block;
  }
`;

const CanvasArea = styled.canvas`
  max-height: 100%;
  background-color: white;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.25);
`;

const StyledButton = styled(CustomButton)`
  position: absolute;
  transform: translate(-100%, -125%);
`;

interface Props {
  sendDc: RTCDataChannel | null;
  receiveDcs: { [socketId: string]: RTCDataChannel };
  isActive: boolean;
}

export default function Canvas({ sendDc, receiveDcs, isActive }: Props) {
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
    if (body.isClear && ctxRef.current) {
      ctxRef.current.clearRect(
        0,
        0,
        canvasRef.current!.width,
        canvasRef.current!.height,
      );
      return;
    }
    draw(body);
  };

  useEffect(() => {
    Object.values(receiveDcs).forEach((receiveDc) => {
      receiveDc.addEventListener('message', canvasMessageHandler);
    });
  }, [receiveDcs]);

  useEffect(() => {
    console.log('canvas:', sendDc);
    sendDc?.addEventListener('message', canvasMessageHandler);

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
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = 1200 / rect.width;
    const scaleY = 900 / rect.height;
    if (!sendDc) return;
    const mouseEvent = e.type;
    const coor = {
      x1: currentCoor.current.x,
      y1: currentCoor.current.y,
      x2: e.nativeEvent.offsetX * scaleX,
      y2: e.nativeEvent.offsetY * scaleX,
    };
    switch (mouseEvent) {
      case 'mousedown':
        isPaintingRef.current = true;
        currentCoor.current.x = e.nativeEvent.offsetX * scaleX;
        currentCoor.current.y = e.nativeEvent.offsetY * scaleY;
        break;
      case 'mouseleave':
        isPaintingRef.current = false;
        break;
      case 'mouseup':
        isPaintingRef.current = false;
        draw(coor);
        sendDc.send(JSON.stringify({ type: 'canvas', ...coor }));
        break;
      case 'mousemove':
        if (!isPaintingRef.current) return;
        draw(coor);
        sendDc.send(JSON.stringify({ type: 'canvas', ...coor }));
        currentCoor.current.x = e.nativeEvent.offsetX * scaleX;
        currentCoor.current.y = e.nativeEvent.offsetY * scaleY;
        break;
      default:
        break;
    }
  };

  const canvasClear = () => {
    if (!ctxRef.current || !sendDc) return;
    ctxRef.current.clearRect(
      0,
      0,
      canvasRef.current!.width,
      canvasRef.current!.height,
    );
    sendDc.send(JSON.stringify({ type: 'canvas', isClear: true }));
  };

  return (
    <CanvasLayout className={isActive ? 'active' : ''}>
      <CanvasArea
        width={1200}
        height={900}
        ref={canvasRef}
        onMouseDown={sendCanvasEvent}
        onMouseMove={sendCanvasEvent}
        onMouseUp={sendCanvasEvent}
        onMouseLeave={sendCanvasEvent}
      />
      <StyledButton
        width="fit-content"
        fontSize="17px"
        padding="8px 16px"
        margin="0 0 5px"
        onClick={canvasClear}>
        CLEAR
      </StyledButton>
    </CanvasLayout>
  );
}
