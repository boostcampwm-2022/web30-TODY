import styled from 'styled-components';

const VideoLayout = styled.div``;

const Video = styled.video`
  width: 405px;
  height: 308px;
  border-radius: 12px;
  background-color: var(--guideText);
`;

interface Props {
  ref: any;
}

export default function VideoItem({ ref }: Props) {
  return (
    <VideoLayout>
      <Video ref={ref} />
    </VideoLayout>
  );
}
