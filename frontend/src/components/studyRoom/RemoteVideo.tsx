import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Video = styled.video`
  /* width: 100%; */
  /* height: 100%; */
  height: 308px;
  border-radius: 12px;

  &.activeCanvas {
    width: 100%;
    height: auto;
  }
`;

interface RemoteVideoProps {
  remoteStream: MediaStream;
  className?: string;
}

export default function RemoteVideo({
  remoteStream,
  className,
}: RemoteVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (ref.current) ref.current.srcObject = remoteStream;
  }, [remoteStream]);

  // eslint-disable-next-line jsx-a11y/media-has-caption
  return <Video autoPlay ref={ref} className={className} />;
}

RemoteVideo.defaultProps = {
  className: '',
};
