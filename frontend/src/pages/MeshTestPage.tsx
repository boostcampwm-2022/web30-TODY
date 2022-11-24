/* eslint-disable jsx-a11y/media-has-caption */
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const EVENTS = {
  OFFER: 'offer',
  ANSWER: 'answer',
  ICECANDIDATE: 'icecandidate',
  NOTICE_ALL_PEERS: 'notice-all-peers',
};

const socket = io('ws://localhost:8000', { autoConnect: false });

export default function MestTestPage() {
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);
  const myVideoRef = useRef<HTMLVideoElement | null>(null);
  const myStream = useRef<MediaStream | null>(null);
  const pcs = useRef<{ [socketId: string]: RTCPeerConnection }>({});

  useEffect(() => {
    remoteStreams.forEach((remoteStream, i) => {
      const video = document.querySelector<HTMLVideoElement>(`#socket${i}`);
      if (!video) return;
      video.srcObject = remoteStream;
    });
  }, [remoteStreams]);

  useEffect(() => {
    if (!myVideoRef.current) return;

    socket.connect();

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: false,
      })
      .then((stream) => {
        myStream.current = stream;
        if (!myVideoRef.current) return;
        myVideoRef.current.srcObject = myStream.current;
        socket.emit('join', 'room1');
      });

    socket.on('notice-all-peers', (peerIdsInRoom) => {
      peerIdsInRoom.forEach(async (peerId: string) => {
        const pc = new RTCPeerConnection();
        pc.addEventListener('icecandidate', (ice) => {
          socket.emit('icecandidate', {
            icecandidate: ice.candidate,
            fromId: socket.id,
            toId: peerId,
          });
        });
        pc.addEventListener('track', (track) => {
          const remoteStream = track.streams[0];
          setRemoteStreams((prev) => [...prev, remoteStream]);
        });
        if (!myStream.current) return;
        myStream.current.getTracks().forEach((track: MediaStreamTrack) => {
          if (!myStream.current) return;
          pc.addTrack(track, myStream.current);
        });
        pcs.current[peerId] = pc;
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('offer', { offer, fromId: socket.id, toId: peerId });
      });
    });

    socket.on('offer', async ({ offer, fromId, toId }) => {
      const pc = new RTCPeerConnection();
      pc.addEventListener('icecandidate', (ice) => {
        socket.emit('icecandidate', {
          icecandidate: ice.candidate,
          fromId: socket.id,
          toId: fromId,
        });
      });
      pc.addEventListener('track', (track: RTCTrackEvent) => {
        const remoteStream = track.streams[0];
        setRemoteStreams((prev) => [...prev, remoteStream]);
      });
      if (!myStream.current) return;
      myStream.current.getTracks().forEach((track: MediaStreamTrack) => {
        if (!myStream.current) return;
        pc.addTrack(track, myStream.current);
      });
      pcs.current[fromId] = pc;
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('answer', { answer, fromId: socket.id, toId: fromId });
    });

    socket.on('answer', async ({ answer, fromId, toId }) => {
      const pc = pcs.current[fromId];
      await pc.setRemoteDescription(answer);
    });

    socket.on('icecandidate', async ({ icecandidate, fromId, toId }) => {
      const pc = pcs.current[fromId];
      if (!icecandidate) return;
      await pc.addIceCandidate(icecandidate);
    });

    // eslint-disable-next-line consistent-return
    return () => {
      socket.off('notice-all-peers');
      socket.off('offer');
      socket.off('answer');
      socket.off('icecandidate');
    };
  }, []);

  function toggleCam() {
    myStream.current!.getVideoTracks().forEach((track: MediaStreamTrack) => {
      // eslint-disable-next-line no-param-reassign
      track.enabled = !track.enabled;
    });
  }

  function toggleMic() {
    myStream.current!.getAudioTracks().forEach((track: MediaStreamTrack) => {
      // eslint-disable-next-line no-param-reassign
      track.enabled = !track.enabled;
    });
  }

  return (
    <>
      <video autoPlay ref={myVideoRef} width="400px" height="400px">
        <track default kind="cations" />
      </video>
      <button type="button" onClick={toggleCam}>
        toggleCam
      </button>
      <button type="button" onClick={toggleMic}>
        toggleMic
      </button>
      {remoteStreams.map((remoteStream, i) => {
        const id = `socket${i}`;
        return (
          <video
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            id={id}
            autoPlay
            width="400px"
            height="400px">
            <track default kind="cations" />
          </video>
        );
      })}
    </>
  );
}
