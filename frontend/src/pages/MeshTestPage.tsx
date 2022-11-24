/* eslint-disable jsx-a11y/media-has-caption */
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('ws://localhost:8000', { autoConnect: false });

export default function MestTestPage() {
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);
  const myVideoRef = useRef<HTMLVideoElement | null>(null);
  const yourVideosRef = useRef<HTMLVideoElement[] | null>(null);
  let myStream: MediaStream;
  let myVideo: HTMLVideoElement;
  const pcs: { [socketId: string]: RTCPeerConnection } = {};

  useEffect(() => {
    console.log('remoteStreams: ', remoteStreams);
    yourVideosRef.current?.forEach((video, i) => {
      // eslint-disable-next-line no-param-reassign
      video.srcObject = remoteStreams[i];
    });
  }, [remoteStreams]);

  useEffect(() => {
    if (!myVideoRef.current) return;
    myVideo = myVideoRef.current;

    // connect socket
    socket.connect();

    // get local stream
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: false,
      })
      .then((stream) => {
        myStream = stream;
        myVideo.srcObject = myStream;
        // join room
        socket.emit('join', 'room1');
      });

    // create offer from 새로운 peer to 기존 peers
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
          setRemoteStreams([...remoteStreams, remoteStream]);
        });
        myStream
          .getTracks()
          .forEach((track: MediaStreamTrack) => pc.addTrack(track, myStream));
        pcs[peerId] = pc;
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
      pc.addEventListener('track', (track: any) => {
        const remoteStream = track.streams[0];
        setRemoteStreams([...remoteStreams, remoteStream]);
      });
      myStream
        .getTracks()
        .forEach((track: MediaStreamTrack) => pc.addTrack(track, myStream));
      pcs[fromId] = pc;
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer({
        offerToReceiveVideo: true,
        offerToReceiveAudio: true,
      });
      await pc.setLocalDescription(answer);
      socket.emit('answer', { answer, fromId: socket.id, toId: fromId });
    });

    socket.on('answer', async ({ answer, fromId, toId }) => {
      const pc = pcs[fromId];
      await pc.setRemoteDescription(answer);
    });

    socket.on('icecandidate', async ({ icecandidate, fromId, toId }) => {
      const pc: RTCPeerConnection = pcs[fromId];
      if (pc) {
        pc.addIceCandidate(icecandidate);
      }
    });

    // eslint-disable-next-line consistent-return
    return () => {
      socket.off('all-peers');
      socket.off('connect');
      socket.off('offer');
      socket.off('answer');
      socket.off('icecandidate');
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
      {remoteStreams.map((remoteStream, i) => {
        const getRef = (el: any) => {
          if (!yourVideosRef.current) return;
          yourVideosRef.current.push(el);
        };
        return (
          // eslint-disable-next-line react/no-array-index-key
          <video key={i} autoPlay ref={getRef} width="400px" height="400px">
            <track default kind="cations" />
          </video>
        );
      })}
    </>
  );
}
