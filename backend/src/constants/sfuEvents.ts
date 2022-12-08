const SFU_EVENTS = {
  JOIN: 'join',
  CONNECT: 'connect',
  NOTICE_ALL_PEERS: 'notice-all-peers',
  RECEIVER_ANSWER: 'receiverAnswer',
  RECEIVER_OFFER: 'receiverOffer',
  SENDER_ANSWER: 'senderAnswer',
  SENDER_OFFER: 'senderOffer',
  RECEIVER_ICECANDIDATE: 'receiverIcecandidate',
  SENDER_ICECANDIDATE: 'senderIcecandidate',
  NEW_PEER: 'new-peer',
  SOMEONE_LEFT_ROOM: 'someone-left-room',
  DISCONNECTING: 'disconnecting',
};

export default SFU_EVENTS;
