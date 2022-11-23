import { useEffect } from 'react';
import socketIO from 'socket.io-client';

const socket = socketIO('http://localhost:8000');

socket.on('connect', () => {
  console.log('connection success');
});

export default function MestTestPage() {
  useEffect(() => {
    console.log('??');
    socket.on('connect', () => {
      console.log('connection success');
    });
  }, []);
  return <>meshtest</>;
}
