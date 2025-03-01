import React from 'react';
import BaseMonitor from './BaseMonitor';

interface VideoMonitorProps {
  title: string;
  videoUrl: string;
  onClose: () => void;
}

function VideoMonitor({ title, videoUrl, onClose }: VideoMonitorProps) {
  return (
    <BaseMonitor 
      title={`${title} - Video İzleme`} 
      onClose={onClose} 
      defaultPosition="top-4 right-4"
      defaultSize={{ width: 500, height: 400 }}
    >
      <div className="h-full bg-black">
        <video
          src={videoUrl}
          className="w-full h-full"
          controls
          autoPlay
          muted
        >
          Tarayıcınız video oynatmayı desteklemiyor.
        </video>
      </div>
    </BaseMonitor>
  );
}

export default VideoMonitor;