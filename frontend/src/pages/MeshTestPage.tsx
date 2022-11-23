/* eslint-disable jsx-a11y/media-has-caption */
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('ws://localhost:8000', { autoConnect: false });

export default function MestTestPage() {
  const myVideoRef = useRef<HTMLVideoElement | null>(null);
  const yourVideoRef = useRef<HTMLVideoElement | null>(null);
  let localStream: any;
  let myVideo: HTMLVideoElement;
  let yourVideo: HTMLVideoElement;
  let pc: any;

  async function getMedia() {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    myVideo.srcObject = localStream;

    pc = new RTCPeerConnection();
    pc.onicecandidate = (e: any) => {
      const message = {
        type: 'candidate',
        candidate: null,
        sdpMid: null,
        sdpMLineIndex: null,
      };
      if (e.candidate) {
        message.candidate = e.candidate.candidate;
        // message.sdpMid = e.candidate.sdpMid;
        // message.sdpMLineIndex = e.candidate.sdpMLineIndex;
      }
      socket.emit('icecandidate', message);
      // signaling.postMessage(message);
    };
    pc.ontrack = (e: any) => {
      [yourVideo.srcObject] = e.streams;
    };
    localStream
      .getTracks()
      .forEach((track: any) => pc.addTrack(track, localStream));
    const offer = await pc.createOffer();
    socket.emit('offer', offer);
    // signaling.postMessage({type: 'offer', sdp: offer.sdp});
    await pc.setLocalDescription(offer);
  }

  useEffect(() => {
    if (!myVideoRef.current) return;
    if (!yourVideoRef.current) return;
    myVideo = myVideoRef.current;
    yourVideo = yourVideoRef.current;
  }, []);

  useEffect(() => {
    socket.connect();

    getMedia();

    socket.on('connect', async () => {});

    return () => {
      socket.off('connect');
    };
  }, []);
  return (
    <>
      <video autoPlay ref={myVideoRef} width="400px" height="400px">
        <track default kind="cations" />
      </video>
      <video autoPlay ref={yourVideoRef} width="400px" height="400px">
        <track default kind="cations" />
      </video>
    </>
  );
}
