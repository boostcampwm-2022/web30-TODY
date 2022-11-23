import { useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('ws://localhost:8000', { autoConnect: false });

export default function MestTestPage() {
  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {});

    return () => {
      socket.off('connect');
    };
  }, []);
  return <>meshtest</>;
}
