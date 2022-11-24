/* eslint-disable jsx-a11y/media-has-caption */
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('ws://localhost:8000', { autoConnect: false });

export default function MestTestPage() {
  const myVideoRef = useRef<HTMLVideoElement | null>(null);
  const yourVideoRef = useRef<HTMLVideoElement | null>(null);
  let myStream: MediaStream;
  let myVideo: HTMLVideoElement;
  let yourVideo: HTMLVideoElement;
  let pc: RTCPeerConnection;

  async function peerAStart() {
    console.log('socket connected, peerAStart');
    // getUserMedia
    myStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    myVideo.srcObject = myStream;

    // addTrack(구addStream)
    myStream
      .getTracks()
      .forEach((track: MediaStreamTrack) => pc.addTrack(track, myStream));

    // createOffer
    const offer = await pc.createOffer();

    // setLocalDescription
    await pc.setLocalDescription(offer);

    return offer;
  }

  async function peerBStart(offer: RTCSessionDescriptionInit) {
    console.log('offer received, peerBStart');
    // setRemoteDescription
    await pc.setRemoteDescription(offer);

    // getUserMedia
    myStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    myVideo.srcObject = myStream;

    // addTrack(구addStream)
    myStream
      .getTracks()
      .forEach((track: MediaStreamTrack) => pc.addTrack(track, myStream));

    // createAnswer
    const answer = await pc.createAnswer();

    // setLocalDescription
    await pc.setLocalDescription(answer);

    return answer;
  }

  function sendCandidate(ice: RTCPeerConnectionIceEvent) {
    console.log('candidate sent');
    socket.emit('icecandidate', ice.candidate);
  }

  function updateYourVideo(track: RTCTrackEvent) {
    console.log('yourVideo updated');
    [yourVideo.srcObject] = track.streams;
  }

  useEffect(() => {
    if (!myVideoRef.current) return;
    if (!yourVideoRef.current) return;
    myVideo = myVideoRef.current;
    yourVideo = yourVideoRef.current;
  }, []);

  useEffect(() => {
    socket.connect();
    pc = new RTCPeerConnection();

    socket.on('connect', async () => {
      const offer = await peerAStart();
      socket.emit('offer', offer);
    });

    socket.on('offer', async (offer) => {
      const answer = await peerBStart(offer);
      socket.emit('answer', answer);
    });

    socket.on('answer', async (answer) => {
      console.log('peerA got answer');
      await pc.setRemoteDescription(answer);
    });

    pc.addEventListener('icecandidate', sendCandidate);

    socket.on('icecandidate', async (icecandidate) => {
      console.log('add candidate');
      await pc.addIceCandidate(icecandidate);
    });

    pc.addEventListener('track', updateYourVideo);

    return () => {
      socket.off('connect');
      socket.off('offer');
      socket.off('answer');
      socket.off('icecandidate');
      pc.removeEventListener('icecandidate', sendCandidate);
      pc.removeEventListener('track', updateYourVideo);
    };
  }, []);

  function toggleCam() {
    myStream.getVideoTracks().forEach((track: MediaStreamTrack) => {
      // eslint-disable-next-line no-param-reassign
      track.enabled = !track.enabled;
    });
  }

  function toggleMic() {
    myStream.getAudioTracks().forEach((track: MediaStreamTrack) => {
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
      <video autoPlay ref={yourVideoRef} width="400px" height="400px">
        <track default kind="cations" />
      </video>
    </>
  );
}
