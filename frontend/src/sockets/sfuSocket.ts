import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_SFU_URL || '', {
  autoConnect: false,
  path: '/sfu/socket.io',
});

export default socket;
