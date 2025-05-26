import React, { useState, useEffect, useRef } from 'react';
import { TileLayer } from 'react-leaflet';

function RadarLayer() {
  const [frames, setFrames] = useState([]);       // list of radar frame data (each with path)
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Fetch radar frames from RainViewer API
    const fetchFrames = async () => {
      try {
        const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
        const data = await res.json();
        // Combine past and nowcast frames
        const pastFrames = data.radar.past || [];
        const futureFrames = data.radar.nowcast || [];
        const allFrames = [...pastFrames, ...futureFrames];
        setFrames(allFrames);
        setCurrentFrameIndex(0);
      } catch (error) {
        console.error("Error fetching radar frames:", error);
      }
    };

    fetchFrames();

    return () => {
      // Cleanup: clear any running interval if component unmounts
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Start animation loop when frames are loaded
    if (frames.length > 0) {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Set up a new interval to cycle through frames
      intervalRef.current = setInterval(() => {
        setCurrentFrameIndex(prevIndex => {
          const nextIndex = prevIndex + 1;
          return nextIndex >= frames.length ? 0 : nextIndex;
        });
      }, 700);  // change frame every 700ms (about ~1.4 frames per second)
    }
  }, [frames]);

  if (frames.length === 0) {
    // No frames to display yet
    return null;
  }

  // Radar tile URL construction:
  // Each frame has a .path, and RainViewer tiles are available at tilecache.rainviewer.com + path + ...png
  // We'll use color scheme 2 (classic) with smoothing and snow layers enabled (1_1).
  const tileBaseUrl = 'https://tilecache.rainviewer.com';

  return (
    <>
      {frames.map((frame, index) => {
        // Construct tile URL for this frame
        const framePath = frame.path;  // e.g., "/v2/radar/123456/..."
        const tileUrl = `${tileBaseUrl}${framePath}/256/{z}/{x}/{y}/2/1_1.png`;
        return (
          <TileLayer
            key={frame.time}  // use timestamp as key (frame.time is epoch seconds)
            url={tileUrl}
            opacity={index === currentFrameIndex ? 0.8 : 0}  // only show current frame
            zIndex={index === currentFrameIndex ? 5 : 4}     // current frame on top
            attribution="Radar data © RainViewer"
          />
        );
      })}
    </>
  );
}

export default RadarLayer;
