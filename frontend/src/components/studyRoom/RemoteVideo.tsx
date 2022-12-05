import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Video = styled.video`
  width: 405px;
  height: 308px;
  border-radius: 12px;
`;

interface RemoteVideoProps {
  remoteStream: MediaStream;
}

export default function RemoteVideo({ remoteStream }: RemoteVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    console.log(remoteStream.getVideoTracks());
    if (ref.current) ref.current.srcObject = remoteStream;
  }, [remoteStream]);

  // eslint-disable-next-line jsx-a11y/media-has-caption
  return <Video autoPlay ref={ref} />;
}
