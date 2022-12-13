/* eslint-disable no-param-reassign */
import { useCallback, useEffect, useRef, useState } from 'react';
import SFU_EVENTS from 'constants/sfuEvents';
import socket from 'sockets/sfuSocket';

const RTCConfiguration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

export function useSfu(roomInfo: any, user: any, myMediaState: any) {
  const [remoteStreams, setRemoteStreams] = useState<{
    [socketId: string]: MediaStream;
  }>({});
  const myVideoRef = useRef<HTMLVideoElement | null>(null);
  const myStream = useRef<MediaStream | null>(null);
  const receivePcs = useRef<{ [socketId: string]: RTCPeerConnection }>({});
  const [receiveDcs, setReceiveDcs] = useState<{
    [socketId: string]: RTCDataChannel;
  }>({});
  const sendPcRef = useRef<RTCPeerConnection | null>(null);
  const sendDcRef = useRef<RTCDataChannel | null>(null);
  const [userList, setUserList] = useState<any>([]);
  const [isScreenShare, setIsScreenShare] = useState<boolean>(false);

  const toggleScreenShare = useCallback(() => {
    setIsScreenShare(!isScreenShare);
  }, [isScreenShare]);

  useEffect(() => {
    // 이동
    if (!myStream.current) return;
    myStream.current.getAudioTracks().forEach((track: MediaStreamTrack) => {
      track.enabled = myMediaState.mic;
    });

    myStream.current.getVideoTracks().forEach((track: MediaStreamTrack) => {
      track.enabled = myMediaState.video;
    });
  }, [myMediaState]);

  useEffect(() => {
    if (!roomInfo) return;
    setUserList([...roomInfo.nickNameOfParticipants]);
  }, [roomInfo]);

  const createSender = useCallback(async () => {
    const sendPc = new RTCPeerConnection(RTCConfiguration);
    sendPcRef.current = sendPc;
    sendPc.onicecandidate = (ice: RTCPeerConnectionIceEvent) => {
      socket.emit(SFU_EVENTS.SENDER_ICECANDIDATE, {
        icecandidate: ice.candidate,
      });
    };

    if (myStream.current) {
      myStream.current.getTracks().forEach((track: MediaStreamTrack) => {
        if (!myStream.current || !sendPcRef.current) return;
        sendPcRef.current.addTrack(track, myStream.current);
      });
    }

    const senderDc = sendPc.createDataChannel('chat');
    sendDcRef.current = senderDc;

    const offer = await sendPc.createOffer({
      offerToReceiveAudio: false,
      offerToReceiveVideo: false,
    });
    await sendPc.setLocalDescription(offer);
    return offer;
  }, []);

  const createReceiver = useCallback(async (peerId: string) => {
    const receivePc = new RTCPeerConnection(RTCConfiguration);
    receivePcs.current[peerId] = receivePc;
    receivePc.onicecandidate = (ice: RTCPeerConnectionIceEvent) => {
      socket.emit(SFU_EVENTS.RECEIVER_ICECANDIDATE, {
        icecandidate: ice.candidate,
        peerId,
      });
    };
    receivePc.ontrack = (track: RTCTrackEvent) => {
      const remoteStream = track.streams[0];
      setRemoteStreams((prev) => {
        const next = { ...prev, [peerId]: remoteStream };
        return next;
      });
    };

    const receiveDc = receivePc.createDataChannel('chat');
    setReceiveDcs((prev) => ({ ...prev, [peerId]: receiveDc }));

    const offer = await receivePc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });
    await receivePc.setLocalDescription(offer);
    return offer;
  }, []);

  useEffect(() => {
    if (!roomInfo) return () => {};
    socket.connect();

    socket.on(SFU_EVENTS.CONNECT, async () => {
      if (!myVideoRef.current) return;
      try {
        const stream = isScreenShare
          ? await navigator.mediaDevices.getDisplayMedia()
          : await navigator.mediaDevices.getUserMedia({
              video: myMediaState.video,
              audio: myMediaState.mic,
            });
        myStream.current = stream;
        myVideoRef.current.srcObject = stream;
      } catch (err) {
        if (isScreenShare) {
          setIsScreenShare(false);
        }
      } finally {
        socket.emit(SFU_EVENTS.JOIN, roomInfo.roomId);

        const offer = await createSender();
        socket.emit(SFU_EVENTS.SENDER_OFFER, {
          offer,
          userData: {
            userId: user.userId,
            userName: user.nickname,
            roomId: roomInfo.roomId,
          },
        });
      }
    });

    socket.on(SFU_EVENTS.NOTICE_ALL_PEERS, (peerIdsInRoom) => {
      peerIdsInRoom.forEach(async (peerId: string) => {
        const offer = await createReceiver(peerId);
        socket.emit(SFU_EVENTS.RECEIVER_OFFER, {
          offer,
          targetId: peerId,
        });
      });
    });

    socket.on(SFU_EVENTS.SENDER_ANSWER, ({ answer }) => {
      if (!sendPcRef.current) return;
      sendPcRef.current.setRemoteDescription(answer);
    });

    socket.on(SFU_EVENTS.RECEIVER_ANSWER, ({ answer, targetId }) => {
      if (!receivePcs.current) return;
      receivePcs.current[targetId].setRemoteDescription(answer);
    });

    socket.on(SFU_EVENTS.NEW_PEER, async ({ peerId, userName }) => {
      setUserList((prev: any) => [...prev, userName]); // 이동
      const offer = await createReceiver(peerId);
      socket.emit(SFU_EVENTS.RECEIVER_OFFER, {
        offer,
        targetId: peerId,
      });
    });

    socket.on(
      SFU_EVENTS.SENDER_ICECANDIDATE,
      async ({ icecandidate, targetId }) => {
        const receivePc = receivePcs.current[targetId];
        if (!icecandidate) return;
        await receivePc.addIceCandidate(icecandidate);
      },
    );

    socket.on(SFU_EVENTS.RECEIVER_ICECANDIDATE, async ({ icecandidate }) => {
      if (!icecandidate) return;
      if (!sendPcRef.current) return;
      await sendPcRef.current.addIceCandidate(icecandidate);
    });

    socket.on(SFU_EVENTS.SOMEONE_LEFT_ROOM, ({ peerId, userName }) => {
      setUserList((prev: any) => [...prev.filter((x: any) => x !== userName)]); // 이동
      const receivePc = receivePcs.current[peerId];
      receivePc.close();
      delete receivePcs.current[peerId];

      setReceiveDcs((cur) => {
        const newReceiveDcs = { ...cur };
        delete newReceiveDcs[peerId];
        return newReceiveDcs;
      });

      setRemoteStreams((prev) => {
        const next = { ...prev };
        delete next[peerId];
        return next;
      });
    });

    return () => {
      socket.off(SFU_EVENTS.CONNECT);
      socket.off(SFU_EVENTS.NOTICE_ALL_PEERS);
      socket.off(SFU_EVENTS.RECEIVER_ANSWER);
      socket.off(SFU_EVENTS.SENDER_ANSWER);
      socket.off(SFU_EVENTS.RECEIVER_ICECANDIDATE);
      socket.off(SFU_EVENTS.SENDER_ICECANDIDATE);
      socket.off(SFU_EVENTS.NEW_PEER);
      socket.off(SFU_EVENTS.SOMEONE_LEFT_ROOM);
      socket.disconnect();
    };
  }, [roomInfo, isScreenShare]);

  return {
    myVideoRef,
    remoteStreams,
    userList,
    receiveDcs,
    sendDcRef,
    isScreenShare,
    toggleScreenShare,
  };
}
