import React, { useEffect, useRef } from 'react';

const VideoChat = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  
  const localPeerConnection = useRef(null);
  const remotePeerConnection = useRef(null);
  const localStream = useRef(null);

  useEffect(() => {
    init();

    return () => {
      if (localPeerConnection.current) {
        localPeerConnection.current.close();
      }
      if (remotePeerConnection.current) {
        remotePeerConnection.current.close();
      }
    };
  }, []);

  const init = async () => {
    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream.current;
      }

      localPeerConnection.current = new RTCPeerConnection();
      remotePeerConnection.current = new RTCPeerConnection();

      localStream.current.getTracks().forEach(track => {
        localPeerConnection.current.addTrack(track, localStream.current);
      });

      remotePeerConnection.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      localPeerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          remotePeerConnection.current.addIceCandidate(event.candidate);
        }
      };

      remotePeerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          localPeerConnection.current.addIceCandidate(event.candidate);
        }
      };

      const offer = await localPeerConnection.current.createOffer();
      await localPeerConnection.current.setLocalDescription(offer);
      await remotePeerConnection.current.setRemoteDescription(offer);

      const answer = await remotePeerConnection.current.createAnswer();
      await remotePeerConnection.current.setLocalDescription(answer);
      await localPeerConnection.current.setRemoteDescription(answer);
    } catch (error) {
      console.error("Error initializing WebRTC:", error);
    }
  };

  return (
    <div>
      <h2>Local Video</h2>
      <video ref={localVideoRef} autoPlay playsInline></video>
      <h2>Remote Video</h2>
      <video ref={remoteVideoRef} autoPlay playsInline></video>
    </div>
  );
};

export default VideoChat;
