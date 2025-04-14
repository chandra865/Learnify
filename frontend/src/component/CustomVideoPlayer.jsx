import React, { useState, useRef, useEffect } from 'react';

const CustomVideoPlayer = ({ src, poster }) => {
  // State for player controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);
  const [showQualityOptions, setShowQualityOptions] = useState(false);
  const [quality, setQuality] = useState('auto');
  const [showCaptions, setShowCaptions] = useState(false);
  const [captionsTrack, setCaptionsTrack] = useState(null);

  // References
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const progressBarRef = useRef(null);
  const timeoutRef = useRef(null);

  // Available quality options (would be dynamic in real implementation)
  const qualityOptions = ['auto', '1080p', '720p', '480p', '360p'];
  
  // Available playback speed options
  const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  // Handle play/pause toggle
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Update current time during playback
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Set video duration when metadata is loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Handle seek in the progress bar
  const handleSeek = (e) => {
    if (videoRef.current && progressBarRef.current) {
      const progressBar = progressBarRef.current.getBoundingClientRect();
      const seekPosition = (e.clientX - progressBar.left) / progressBar.width;
      videoRef.current.currentTime = seekPosition * duration;
      setCurrentTime(seekPosition * duration);
    }
  };

  // Skip forward or backward
  const handleSkip = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setMuted(newVolume === 0);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
      if (!muted) {
        // Store the volume before muting
        videoRef.current.volume = 0;
      } else {
        // Restore volume when unmuting
        videoRef.current.volume = volume > 0 ? volume : 0.5;
      }
    }
  };

  // Toggle fullscreen
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      if (videoContainerRef.current.requestFullscreen) {
        videoContainerRef.current.requestFullscreen();
      } else if (videoContainerRef.current.mozRequestFullScreen) {
        videoContainerRef.current.mozRequestFullScreen();
      } else if (videoContainerRef.current.webkitRequestFullscreen) {
        videoContainerRef.current.webkitRequestFullscreen();
      } else if (videoContainerRef.current.msRequestFullscreen) {
        videoContainerRef.current.msRequestFullscreen();
      }
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullScreen(false);
    }
  };

  // Change playback speed
  const changePlaybackSpeed = (speed) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setShowSpeedOptions(false);
    }
  };

  // Change video quality (in a real implementation, this would switch sources)
  const changeQuality = (newQuality) => {
    setQuality(newQuality);
    setShowQualityOptions(false);
    // In a real implementation, you would switch video sources here
    console.log(`Changed quality to ${newQuality}`);
  };

  // Toggle captions
  const toggleCaptions = () => {
    if (videoRef.current && videoRef.current.textTracks.length > 0) {
      const track = videoRef.current.textTracks[0];
      if (showCaptions) {
        track.mode = 'hidden';
      } else {
        track.mode = 'showing';
      }
      setShowCaptions(!showCaptions);
    }
  };

  // Auto-hide controls
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };

    const videoContainer = videoContainerRef.current;
    if (videoContainer) {
      videoContainer.addEventListener('mousemove', handleMouseMove);
      videoContainer.addEventListener('mouseleave', () => {
        if (isPlaying) {
          setShowControls(false);
        }
      });
    }

    return () => {
      if (videoContainer) {
        videoContainer.removeEventListener('mousemove', handleMouseMove);
        videoContainer.removeEventListener('mouseleave', () => {});
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName.toLowerCase() === 'input') return;
      
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleSkip(10);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleSkip(-10);
          break;
        case 'j':
          e.preventDefault();
          handleSkip(-10);
          break;
        case 'l':
          e.preventDefault();
          handleSkip(10);
          break;
        case 'f':
          e.preventDefault();
          toggleFullScreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.currentTime = (duration * parseInt(e.key)) / 10;
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (videoRef.current && volume < 1) {
            const newVolume = Math.min(1, volume + 0.1);
            setVolume(newVolume);
            videoRef.current.volume = newVolume;
            setMuted(false);
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (videoRef.current && volume > 0) {
            const newVolume = Math.max(0, volume - 0.1);
            setVolume(newVolume);
            videoRef.current.volume = newVolume;
            setMuted(newVolume === 0);
          }
          break;
        case 'c':
          e.preventDefault();
          toggleCaptions();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [duration, volume, muted, isPlaying]);

  // Format time (seconds to MM:SS or HH:MM:SS)
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '00:00';
    
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  };

  return (
    <div 
      ref={videoContainerRef}
      className="relative w-full max-w-4xl mx-auto bg-black overflow-hidden"
      onDoubleClick={toggleFullScreen}
    >
      <video
        ref={videoRef}
        className="w-full h-auto"
        src={src}
        poster={poster}
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      >
        {/* Add caption track if available */}
        <track 
          kind="subtitles" 
          src="captions.vtt" 
          label="English" 
          srcLang="en" 
          default 
        />
      </video>
      
      {/* Video controls */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white transition-opacity">
          {/* Progress bar */}
          <div 
            ref={progressBarRef}
            className="w-full h-2 bg-gray-600 rounded-full cursor-pointer mb-4"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-red-600 rounded-full relative"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            >
              <div className="absolute right-0 -top-1 w-4 h-4 bg-red-600 rounded-full transform -translate-x-1/2"></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {/* Play/Pause button */}
              <button onClick={togglePlay} className="focus:outline-none">
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </button>
              
              {/* Skip buttons */}
              <button onClick={() => handleSkip(-10)} className="focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                </svg>
              </button>
              
              <button onClick={() => handleSkip(10)} className="focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                </svg>
              </button>
              
              {/* Volume control */}
              <div className="flex items-center">
                <button onClick={toggleMute} className="focus:outline-none mr-2">
                  {muted || volume === 0 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  ) : volume < 0.5 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={muted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-white rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              {/* Time display */}
              <div className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Playback speed */}
              <div className="relative">
                <button 
                  onClick={() => setShowSpeedOptions(!showSpeedOptions)} 
                  className="focus:outline-none text-sm"
                >
                  {playbackSpeed}x
                </button>
                {showSpeedOptions && (
                  <div className="absolute bottom-8 right-0 bg-black/90 p-2 rounded shadow-lg">
                    {speedOptions.map(speed => (
                      <button
                        key={speed}
                        onClick={() => changePlaybackSpeed(speed)}
                        className={`block w-full text-left px-2 py-1 text-sm hover:bg-gray-700 ${playbackSpeed === speed ? 'text-red-500' : 'text-white'}`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Quality selector */}
              <div className="relative">
                <button 
                  onClick={() => setShowQualityOptions(!showQualityOptions)} 
                  className="focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                {showQualityOptions && (
                  <div className="absolute bottom-8 right-0 bg-black/90 p-2 rounded shadow-lg">
                    {qualityOptions.map(q => (
                      <button
                        key={q}
                        onClick={() => changeQuality(q)}
                        className={`block w-full text-left px-2 py-1 text-sm hover:bg-gray-700 ${quality === q ? 'text-red-500' : 'text-white'}`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Captions toggle */}
              <button onClick={toggleCaptions} className={`focus:outline-none ${showCaptions ? 'text-red-500' : 'text-white'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </button>
              
              {/* Fullscreen toggle */}
              <button onClick={toggleFullScreen} className="focus:outline-none">
                {isFullScreen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M15 9h4.5M15 9V4.5M9 15H4.5M9 15v4.5M15 15h4.5M15 15v4.5" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5-5-5m5 5v-4m0 4h-4" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomVideoPlayer;