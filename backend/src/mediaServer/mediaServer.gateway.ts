import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as wrtc from 'wrtc';

const PCConfig = {
  iceServers: [
    { urls: 'stun:101.101.219.107:3478' },
    {
      urls: 'turn:101.101.219.107:3478',
      username: 'test',
      credential: 'test123',
    },
  ],
};

let receiverPeerConnectionInfo = {};
let senderPeerConnectionInfo = {};
const userInfo = {}; // socketId가 key, stream이 value
const roomInfoPerSocket = {};

export function deleteUser(toDeleleteUserSocketId) {
  delete userInfo[toDeleleteUserSocketId];
  delete roomInfoPerSocket[toDeleleteUserSocketId];
}

@WebSocketGateway({ cors: true })
export class MediaServerGateway {
  @WebSocketServer() server: Server;

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`connected: ${client.id}`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('disconnected', client.id);
    const roomId = roomInfoPerSocket[client.id];
    deleteUser(client.id);
    closeReceivePeerConnection(client.id);
    closeSendPeerConnection(client.id);
    client.broadcast.to(roomId).emit('userLeftRoom', { socketId: client.id });
  }

  @SubscribeMessage('senderOffer')
  async handleSenderOffer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const { senderSdp, roomId } = data;
    const senderSocketId = client.id;
    roomInfoPerSocket[senderSocketId] = roomId;

    const pc = createReceiverPeerConnection(senderSocketId, client, roomId);
    await pc.setRemoteDescription(senderSdp);
    const sdp = await pc.createAnswer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });
    await pc.setLocalDescription(sdp);

    client.join(roomId);
    this.server.to(senderSocketId).emit('getSenderAnswer', {
      receiverSdp: sdp,
    });
  }
  @SubscribeMessage('senderCandidate')
  async handleSenderCandidate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const pc = receiverPeerConnectionInfo[client.id];
    await pc.addIceCandidate(new wrtc.RTCIceCandidate(data.candidate));
  }

  @SubscribeMessage('getUserList')
  async handle(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    const getSocketListOfRoom = await this.server
      .in(data.roomId)
      .fetchSockets();
    const getOtherUserListOfRoom = getSocketListOfRoom
      .filter((socket) => socket.id !== client.id)
      .map((socket) => ({
        socketId: socket.id,
      }));
    client.emit('allUserList', {
      allUserList: getOtherUserListOfRoom,
    });
  }

  @SubscribeMessage('receiverOffer')
  async handleReceiverOffer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    console.log('--receive Offer--');
    const { receiverSdp, senderSocketId, roomId } = data;
    const receiverSocketId = client.id;
    const pc = createSenderPeerConnection(client, roomId, senderSocketId);
    await pc.setRemoteDescription(receiverSdp);
    const sdp = await pc.createAnswer();
    await pc.setLocalDescription(sdp);
    this.server.to(receiverSocketId).emit('getReceiverAnswer', {
      senderSdp: sdp,
      senderSocketId: senderSocketId,
    });
  }
  @SubscribeMessage('receiverCandidate')
  async handleReceiverCandidate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const senderPC = senderPeerConnectionInfo[data.senderSocketId].filter(
      (sPC) => sPC.socketId === client.id,
    )[0];
    await senderPC.pc.addIceCandidate(new wrtc.RTCIceCandidate(data.candidate));
  }
}

function createReceiverPeerConnection(senderSocketId, socket, roomId) {
  const pc = new wrtc.RTCPeerConnection(PCConfig);

  if (receiverPeerConnectionInfo[senderSocketId])
    receiverPeerConnectionInfo[senderSocketId] = pc;
  else
    receiverPeerConnectionInfo = {
      ...receiverPeerConnectionInfo,
      [senderSocketId]: pc,
    };

  pc.onicecandidate = (e) => {
    console.log('receiver oniceCandidate');
    socket.to(senderSocketId).emit('getSenderCandidate', {
      candidate: e.candidate,
    });
  };

  pc.ontrack = (e) => {
    console.log('--------ontrack------');
    console.log(e.streams[0]);

    if (userInfo[senderSocketId]) return;
    userInfo[senderSocketId] = e.streams[0];
    socket.broadcast
      .to(roomId)
      .emit('enterNewUser', { socketId: senderSocketId });
  };

  return pc;
}

function createSenderPeerConnection(socket, roomId, senderSocketId) {
  const pc = new wrtc.RTCPeerConnection(PCConfig);
  const receiverSocketId = socket.id;
  if (senderPeerConnectionInfo[senderSocketId]) {
    senderPeerConnectionInfo[senderSocketId] = senderPeerConnectionInfo[
      senderSocketId
    ]
      .filter((user) => user.socketId !== receiverSocketId)
      .concat({
        socketId: receiverSocketId,
        pc,
      });
  } else {
    senderPeerConnectionInfo = {
      ...senderPeerConnectionInfo,
      [senderSocketId]: [{ socketId: receiverSocketId, pc }],
    };
  }

  pc.onicecandidate = (e) => {
    console.log('sender oniceCandidate');
    socket.to(receiverSocketId).emit('getReceiverCandidate', {
      candidate: e.candidate,
      senderSocketId: senderSocketId,
    });
  };

  const sendUser = userInfo[senderSocketId];

  sendUser.getTracks().forEach((track) => {
    pc.addTrack(track, sendUser);
  });

  return pc;
}

function closeReceivePeerConnection(toCloseSocketId) {
  if (!receiverPeerConnectionInfo[toCloseSocketId]) return;

  receiverPeerConnectionInfo[toCloseSocketId].close();
  delete receiverPeerConnectionInfo[toCloseSocketId];
}

function closeSendPeerConnection(toCloseSocketId) {
  if (!senderPeerConnectionInfo[toCloseSocketId]) return;

  senderPeerConnectionInfo[toCloseSocketId].forEach((senderPC) => {
    senderPC.pc.close();

    if (!senderPeerConnectionInfo[senderPC.socektId]) return;

    senderPeerConnectionInfo[senderPC.socektId] = senderPeerConnectionInfo[
      senderPC.socektId
    ].redecue((filtered, sPC) => {
      if (sPC.socketId === toCloseSocketId) {
        sPC.pc.close();
        return;
      }
      filtered.push(sPC);
      return filtered;
    }, []);
  });

  delete senderPeerConnectionInfo[toCloseSocketId];
}
