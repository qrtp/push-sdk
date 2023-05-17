import { useEffect, useRef } from 'react';
import styled from 'styled-components';

type VideoPlayerPropsType = {
  stream: MediaStream | null;
};

const VideoPlayer = ({ stream }: VideoPlayerPropsType) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [videoRef, stream]);

  return <Video ref={videoRef} muted autoPlay />;
};

const Video = styled.video`
  width: 30vw;
  height: fit-content;
  border: 2px solid black;
`;

export default VideoPlayer;
