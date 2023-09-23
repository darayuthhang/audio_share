import React, { useState, useEffect, useRef } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

function AudioHighlighter({ paragraph, audio }) {

    const [isPlaying, setIsPlaying] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [seekTime, setSeekTime] = useState(0);
    const [volume, setVolume] = useState(0.5); // Initial volume level

    const words = paragraph.split(' ');

    useEffect(() => {
        audio.addEventListener('timeupdate', handleAudioTimeUpdate);
        audio.addEventListener('ended', handleAudioEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleAudioTimeUpdate);
            audio.removeEventListener('ended', handleAudioEnded);
        };
    }, [audio]);

    const handleAudioTimeUpdate = () => {
        
        if (!audio.seeking) {
            const currentTime = audio.currentTime;
          
            const wordDuration = audio.duration / words.length;

            // Determine the index of the word to highlight
            const newIndex = Math.floor(currentTime / wordDuration);

            if (newIndex !== highlightedIndex) {
                setHighlightedIndex(newIndex);
            }
        }
        setSeekTime(audio.currentTime);
    };

    const handleAudioEnded = () => {
        setHighlightedIndex(-1);
        setIsPlaying(false);
    };

    const playAudio = () => {
        audio.playbackRate = 1.0;
        audio.currentTime = seekTime;
        audio.volume = volume; // Set the volume before playing
        audio.play();
        setIsPlaying(true);
    };

    const pauseAudio = () => {
        audio.pause();
        setIsPlaying(false);
    };

    const handleSeekChange = (e) => {
        const newSeekTime = parseFloat(e.target.value);
        setSeekTime(newSeekTime);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        audio.volume = newVolume; // Update the audio's volume
    };

    return (
        <div>
            <div className='d-flex gap-2 mb-2 mt-2'>
              
                <button className="btn btn-outline-secondary" onClick={isPlaying ? pauseAudio : playAudio}>
                    {isPlaying ? (
                        <i className="bi bi-pause-circle fs-5"></i>
                    ) : (
                        <i className="bi bi-play-circle fs-5"></i>
                    )}
                    <input
                        type="range"
                        min="0"
                        max={audio.duration}
                        step="0.01"
                        className="ms-2"
                        value={seekTime}
                        onChange={handleSeekChange}
                    />
                    
                </button>
            
                <Dropdown>
                    <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                        <i className="bi bi-volume-up-fill fs-5"></i>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            className="ms-2"
                            value={volume}
                            onChange={handleVolumeChange}
                        />
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <p>
                {words.map((word, index) => (
                    <span
                        key={index}
                        className={`${index === highlightedIndex && isPlaying ? 'highlight' : ''} lh-lg font-monospace text-break fw-medium`}
                    >
                        {word}{' '}
                    </span>
                ))}
            </p>
          
            <style>
                {`
          .highlight {
            background-color: yellow; /* Change this to your desired highlight color */
          }
        `}
            </style>
        </div>
    );
}

export default AudioHighlighter;
