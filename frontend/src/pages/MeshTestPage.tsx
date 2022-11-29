/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable jsx-a11y/media-has-caption */
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const EVENTS = {
  CONNECT: 'connect',
  NOTICE_ALL_PEERS: 'notice-all-peers',
  OFFER: 'offer',
  ANSWER: 'answer',
  ICECANDIDATE: 'icecandidate',
  SOMEONE_LEFT_YOUR_ROOM: 'someone-left-your-room',
};

const socket = io(process.env.REACT_APP_SOCKET_URL!, {
  autoConnect: false,
});

interface RemoteVideoProps {
  remoteStream: MediaStream;
}

function RemoteVideo({ remoteStream }: RemoteVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    ref.current!.srcObject = remoteStream;
  }, []);

  return <video autoPlay ref={ref} width="400px" height="400px" />;
}

export default function MestTestPage() {
  const [remoteStreams, setRemoteStreams] = useState<{
    [socketId: string]: MediaStream;
  }>({});
  const myVideoRef = useRef<HTMLVideoElement | null>(null);
  const myStream = useRef<MediaStream | null>(null);
  const pcs = useRef<{ [socketId: string]: RTCPeerConnection }>({});

  useEffect(() => {
    socket.connect();

    socket.on('connect', async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      myStream.current = stream;
      myVideoRef.current!.srcObject = myStream.current;

      socket.emit('join', 'room1');
    });

    socket.on('notice-all-peers', (peerIdsInRoom) => {
      peerIdsInRoom.forEach(async (peerId: string) => {
        const pc = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });
        pcs.current[peerId] = pc;
        addIcecandidateListener(pc, peerId);
        addTrackListener(pc, peerId);

        myStream.current!.getTracks().forEach((track: MediaStreamTrack) => {
          pc.addTrack(track, myStream.current!);
        });

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket.emit('offer', { offer, fromId: socket.id, toId: peerId });
      });
    });

    socket.on('offer', async ({ offer, fromId, toId }) => {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });
      pcs.current[fromId] = pc;
      addIcecandidateListener(pc, fromId);
      addTrackListener(pc, fromId);

      myStream.current!.getTracks().forEach((track: MediaStreamTrack) => {
        pc.addTrack(track, myStream.current!);
      });

      await pc.setRemoteDescription(offer);

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit('answer', { answer, fromId: socket.id, toId: fromId });
    });

    socket.on('answer', async ({ answer, fromId, toId }) => {
      const pc = pcs.current[fromId];
      await pc.setRemoteDescription(answer);
    });

    function addIcecandidateListener(pc: RTCPeerConnection, toId: string) {
      pc.addEventListener('icecandidate', (ice: RTCPeerConnectionIceEvent) => {
        socket.emit('icecandidate', {
          icecandidate: ice.candidate,
          fromId: socket.id,
          toId,
        });
      });
    }

    socket.on('icecandidate', async ({ icecandidate, fromId, toId }) => {
      const pc = pcs.current[fromId];
      if (!icecandidate) return;
      await pc.addIceCandidate(icecandidate);
    });

    function addTrackListener(pc: RTCPeerConnection, peerId: string) {
      pc.addEventListener('track', (track: RTCTrackEvent) => {
        const remoteStream = track.streams[0];
        setRemoteStreams((prev) => {
          const next = { ...prev, [peerId]: remoteStream };
          return next;
        });
      });
    }

    socket.on('someone-left-your-room', (peerId) => {
      const pc = pcs.current[peerId];
      pc.close();
      delete pcs.current[peerId];

      setRemoteStreams((prev) => {
        const next = { ...prev };
        delete next[peerId];
        return next;
      });
    });

    return () => {
      socket.off('connect');
      socket.off('notice-all-peers');
      socket.off('offer');
      socket.off('answer');
      socket.off('icecandidate');
      socket.off('someone-left-your-room');
      socket.disconnect();
    };
  }, []);

  function toggleCam() {
    myStream.current!.getVideoTracks().forEach((track: MediaStreamTrack) => {
      track.enabled = !track.enabled;
    });
  }

  function toggleMic() {
    myStream.current!.getAudioTracks().forEach((track: MediaStreamTrack) => {
      track.enabled = !track.enabled;
    });
  }

  return (
    <>
      <video autoPlay ref={myVideoRef} width="400px" height="400px" />
      <button type="button" onClick={toggleCam}>
        toggleCam
      </button>
      <button type="button" onClick={toggleMic}>
        toggleMic
      </button>
      {Object.entries(remoteStreams).map(([peerId, remoteStream]) => (
        <RemoteVideo key={peerId} remoteStream={remoteStream} />
      ))}
    </>
  );
}
