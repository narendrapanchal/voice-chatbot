import React, { useEffect, useRef, useState } from 'react';

const Avatar = ({ response }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const playVideo = () => {
      if (videoRef.current) {
        videoRef.current.play().catch((error) => {
          console.error('Autoplay not allowed. Waiting for user interaction:', error);
        });
      }
    };

    playVideo();
  }, [response]);

  const handleUnmute = () => {
    if (videoRef.current) {
      videoRef.current.muted = false; // Unmute the video
      setIsMuted(false); // Update state
    }
  };

  return (
    <div>
      {response?<video ref={videoRef} width="320" height="240"  autoPlay>
        <source src={response} type="video/mp4" />
        Your browser does not support the video tag.
      </video>:<img style={{width:"300px", height:"300px", borderRadius:"0px"}} className="image-container" src="/img.png"/>}
      {isMuted && (
        <button onClick={handleUnmute}>Unmute</button>
      )}
    </div>
  );
};

export default Avatar;
