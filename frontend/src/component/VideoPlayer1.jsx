import React, { useEffect, useRef, useState, forwardRef } from "react";
import Tooltip from "./ToolTip";
import Hls from "hls.js";

const VideoPlayer1 = forwardRef(
  ({ src, onPrevious, onNext, hasPrevious, hasNext, onExpand }, ref) => {
    
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const hls = useRef(null);
    const [qualities, setQualities] = useState([]);
    const [currentQuality, setCurrentQuality] = useState("Auto");
    const [showQualityOptions, setShowQualityOptions] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showCaptions, setShowCaptions] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [speedOptions, setSpeedOptions] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    //const [volume, setVolume] = useState(0.5);
    const [previousVolume, setPreviousVolume] = useState(0.5);
    const [isHovering, setIsHovering] = useState(false);
    const timeoutRef = useRef(null);

    const toggleMute = () => {
      if (videoRef.current) {
        if (videoRef.current.volume > 0) {
          setPreviousVolume(videoRef.current.volume);
          videoRef.current.volume = 0;
          setVolume(0); // Optionally update state for other UI elements
        } else {
          videoRef.current.volume = previousVolume;
          setVolume(previousVolume); // Optionally update state
        }
      }
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const handleMouseLeave = () => {
      timeoutRef.current = setTimeout(() => {
        setIsHovering(false);
      }, 1000); // Hide after 1 second
    };

    // Clean up timeout on unmount
    useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

    // Expose the videoRef to the parent component
    React.useImperativeHandle(ref, () => ({
      videoRef: videoRef,
    }));

    useEffect(() => {
      if (Hls.isSupported()) {
        hls.current = new Hls({
          enableWorker: true,
          capLevelToPlayerSize: true,
          maxLoadingDelay: 4,
          minAutoBitrate: 0,
        });

        hls.current.loadSource(src);
        hls.current.attachMedia(videoRef.current);

        hls.current.on(Hls.Events.MANIFEST_PARSED, () => {
          const levels = hls.current.levels;
          const availableQualities = levels
            .map((level) => level.height)
            .filter((v, i, a) => a.indexOf(v) === i) // unique
            .sort((a, b) => b - a);

          const qualityList = [
            { label: "Auto", level: -1 },
            ...availableQualities.map((height) => {
              const index = levels.findIndex((lvl) => lvl.height === height);
              return {
                label: `${height}p`,
                level: index,
              };
            }),
          ];

          setQualities(qualityList);
        });
      } else if (
        videoRef.current.canPlayType("application/vnd.apple.mpegurl")
      ) {
        videoRef.current.src = src;
      }

      const videoElement = videoRef.current;

      const handleTimeUpdate = () => {
        setCurrentTime(videoElement.currentTime);
      };

      const handleLoadedMetadata = () => {
        setDuration(videoElement.duration);
      };

      const handlePlay = () => {
        setIsPlaying(true);
      };

      const handlePause = () => {
        setIsPlaying(false);
      };

      videoElement.addEventListener("timeupdate", handleTimeUpdate);
      videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.addEventListener("play", handlePlay);
      videoElement.addEventListener("pause", handlePause);

      // Add keyboard event listeners
      const handleKeyDown = (e) => {
        // Space bar for play/pause
        if (e.code === "Space") {
          e.preventDefault();
          handlePlayPause();
        }
        // Left arrow for rewind 5s
        else if (e.code === "ArrowLeft") {
          e.preventDefault();
          videoElement.currentTime = Math.max(0, videoElement.currentTime - 5);
        }
        // Right arrow for forward 5s
        else if (e.code === "ArrowRight") {
          e.preventDefault();
          videoElement.currentTime = Math.min(
            duration,
            videoElement.currentTime + 5
          );
        }
        // N key for next lecture
        else if (e.code === "KeyN" && hasNext) {
          e.preventDefault();
          onNext && onNext();
        }
        // P key for previous lecture
        else if (e.code === "KeyP" && hasPrevious) {
          e.preventDefault();
          onPrevious && onPrevious();
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        if (hls.current) {
          hls.current.destroy();
        }
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
        videoElement.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
        videoElement.removeEventListener("play", handlePlay);
        videoElement.removeEventListener("pause", handlePause);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [src, duration, hasNext, hasPrevious, onNext, onPrevious]);

    // Notify parent component when expansion state changes
    useEffect(() => {
      if (onExpand) {
        onExpand(isExpanded);
      }
    }, [isExpanded, onExpand]);

    const handleQualityChange = (level) => {
      if (level === -1) {
        hls.current.currentLevel = -1;
        setCurrentQuality("Auto");
      } else {
        hls.current.currentLevel = level;
        setCurrentQuality(qualities.find((q) => q.level === level).label);
      }
      setShowQualityOptions(false);
      setShowSettings(false);
    };

    const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const handlePlayPause = () => {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    };

    const handleVolumeChange = (e) => {
      const value = parseFloat(e.target.value);
      setVolume(value);
      if (videoRef.current) {
        videoRef.current.volume = value;
      }
      // If we're adjusting from zero to some value, we should also update previousVolume
      if (value > 0) {
        setPreviousVolume(value);
      }
    };

    const handleSeek = (e) => {
      const seekTime = (e.target.value / 100) * duration;
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    };

    const handleSpeedChange = (speed) => {
      setPlaybackSpeed(speed);
      videoRef.current.playbackRate = speed;
      setSpeedOptions(false);
      setShowSettings(false);
    };

    const toggleFullScreen = () => {
      if (!document.fullscreenElement) {
        videoRef.current.parentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    };

    const toggleExpand = () => {
      setIsExpanded(!isExpanded);
      // No need to call onExpand here because the useEffect will handle it
    };

    return (
      <div
        ref={containerRef}
        className={`w-full relative ${
          isExpanded ? "h-screen fixed top-0 left-0 right-0 z-50 bg-black" : ""
        }`}
      >
        <div className="relative overflow-hidden group">
          {/* Video Element */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            onClick={handlePlayPause}
            playsInline
          />

          {/* Cinematic Overlay - Title and Centered Play Button (when paused) */}
          {!isPlaying && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-center text-white space-y-2">
                <div className="flex items-center justify-center space-x-4 text-4xl font-bold tracking-widest mt-2">
                  <button
                    onClick={handlePlayPause}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 mx-4 focus:outline-none transition duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Progress Bar */}
            <div className="flex items-center mb-2">
              <input
                type="range"
                min="0"
                max="100"
                value={(currentTime / duration) * 100 || 0}
                onChange={handleSeek}
                className="w-full accent-blue-500 h-1 bg-gray-400 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Previous Button */}
                <Tooltip content="Previous">
                  <button
                    onClick={onPrevious}
                    disabled={!hasPrevious}
                    className="text-white focus:outline-none disabled:opacity-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                </Tooltip>

                {/* Play/Pause Button */}
                <Tooltip content={isPlaying ? "Pause" : "Play"}>
                  <button
                    onClick={handlePlayPause}
                    className="text-white focus:outline-none"
                  >
                    {isPlaying ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                  </button>
                </Tooltip>

                {/* Next Button */}
                <Tooltip content="Next">
                  <button
                    onClick={onNext}
                    disabled={!hasNext}
                    className="text-white focus:outline-none disabled:opacity-50 cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </Tooltip>

                {/* Time Display */}
                <div className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Volume Control */}
                <div
                  className="flex items-center space-x-2"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Tooltip
                    content={videoRef.current?.volume > 0 ? "Mute" : "Unmute"}
                  >
                    <button
                      className="text-white focus:outline-none cursor-pointer"
                      onClick={toggleMute}
                    >
                      {videoRef.current?.volume > 0 ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                          />
                        </svg>
                      )}
                    </button>
                  </Tooltip>

                  {isHovering && (
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-20 accent-blue-500 h-1 bg-gray-400 rounded-lg appearance-none cursor-pointer"
                    />
                  )}
                </div>

                {/* Expand View Button */}
                <Tooltip
                  content={isExpanded ? "Exit Expanded View" : "Expanded View"}
                >
                  <button
                    onClick={toggleExpand}
                    className="text-white focus:outline-none cursor-pointer"
                    aria-label={
                      isExpanded ? "Exit Theater Mode" : "Enter Theater Mode"
                    }
                  >
                    {isExpanded ? (
                      // Exit Expanded View (Minimize / Contract)
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 10h7M4 10v7M20 14h-7M20 14v-7"
                        />
                      </svg>
                    ) : (
                      // Enter Expanded View (Maximize / Expand)
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4h7M4 4v7M20 20h-7M20 20v-7"
                        />
                      </svg>
                    )}
                  </button>
                </Tooltip>

                {/* Settings Button */}
                <div className="relative">
                  <Tooltip content="Settings">
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className={`text-white cursor-pointer focus:outline-none ${
                        showSettings ? "bg-blue-500 rounded" : ""
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </button>
                  </Tooltip>

                  {/* Settings Menu */}
                  {showSettings && (
                    <div className="absolute bottom-12 right-0 bg-white rounded-md shadow-lg w-40 z-30 text-sm text-gray-800">
                      {/* Quality Options */}
                      <div className="px-4 py-2 border-b border-gray-200 cursor-pointer">
                        <div
                          className="flex justify-between items-center"
                          onClick={() =>
                            setShowQualityOptions(!showQualityOptions)
                          }
                        >
                          <span className="font-medium">Quality</span>
                          <span className="text-gray-600">
                            {currentQuality}
                          </span>
                        </div>

                        {showQualityOptions && (
                          <div className="mt-2 pl-4">
                            {qualities.map((q, index) => (
                              <button
                                key={index}
                                onClick={() => handleQualityChange(q.level)}
                                className={`block w-full text-left py-1 cursor-pointer ${
                                  currentQuality === q.label
                                    ? "text-blue-500 font-medium"
                                    : "text-gray-600"
                                }`}
                              >
                                {q.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Speed Options */}
                      <div className="px-4 py-2 cursor-pointer">
                        <div
                          className="flex justify-between items-center"
                          onClick={() => setSpeedOptions(!speedOptions)}
                        >
                          <span className="font-medium">Speed</span>
                          <span className="text-gray-600">
                            {playbackSpeed === 1
                              ? "Normal"
                              : `${playbackSpeed}x`}
                          </span>
                        </div>

                        {speedOptions && (
                          <div className="mt-2 pl-4 cursor-pointer">
                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                              <button
                                key={speed}
                                onClick={() => handleSpeedChange(speed)}
                                className={`block w-full text-left py-1 cursor-pointer ${
                                  playbackSpeed === speed
                                    ? "text-blue-500 font-medium"
                                    : "text-gray-600"
                                }`}
                              >
                                {speed === 1 ? "Normal" : `${speed}x`}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Fullscreen Button */}
                <Tooltip content="Fullscreen">
                  <button
                    onClick={toggleFullScreen}
                    className="text-white focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 1v4m0 0h-4m4 0l-5-5"
                      />
                    </svg>
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {/* Video Title/Info Below Player (hidden when expanded) */}
        {/* {!isExpanded && (
          <div className="flex items-center justify-center mt-3 text-gray-600">
            <svg
            className="h-5 w-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeMiterlimit="10"
            />
            <path
              d="M12 12H12.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-sm">View From A Blue Moon</span>
          <span className="mx-2 text-sm">©</span>
          <span className="text-sm">Brainfarm</span>
          </div>
        )} */}

        {/* Keyboard shortcuts info - appears briefly when expanded */}
        {isExpanded && (
          <div className="absolute bottom-20 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/60 text-white text-sm px-4 py-2 rounded-md">
              <span className="mr-4">Space: Play/Pause</span>
              <span className="mr-4">←: -5s</span>
              <span className="mr-4">→: +5s</span>
              <span className="mr-4">P: Previous</span>
              <span>N: Next</span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default VideoPlayer1;
