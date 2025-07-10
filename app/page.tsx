'use client';

import React, { useState, useEffect, useRef } from 'react';

const Metronome = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [soundType, setSoundType] = useState('sound-native');

  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const abletonClickBufferRef = useRef<AudioBuffer | null>(null);

  const loadAbletonClickSound = async () => {
    if (audioContextRef.current) {
      try {
        const response = await fetch('sounds/1_1.wav');
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
        abletonClickBufferRef.current = audioBuffer;
      } catch (error) {
        console.error('Error loading Ableton click sound:', error);
      }
    }
  };

  const playClick = () => {
    if (audioContextRef.current) {
      if (soundType === 'sound-native') {
        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioContextRef.current.currentTime);

        gainNode.gain.setValueAtTime(1, audioContextRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.1);

        oscillator.start();
        oscillator.stop(audioContextRef.current.currentTime + 0.1);
      } else if (soundType === 'sound-ableton' && abletonClickBufferRef.current) {
        const source = audioContextRef.current.createBufferSource();
        source.buffer = abletonClickBufferRef.current;
        source.connect(audioContextRef.current.destination);
        source.start(0);
      }
    }
  };

  useEffect(() => {
    audioContextRef.current = new window.AudioContext();
    loadAbletonClickSound();
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const interval = 60000 / bpm;

      playClick();

      timerRef.current = setInterval(playClick, interval);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, bpm, soundType]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' || (event.key === ' ' && document.activeElement === document.body)) {
        event.preventDefault();
        setIsPlaying((prev) => !prev);
      }
      if (event.key === 't') {
        event.preventDefault();
        handleTapTempo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleBpmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newBpm = Number(event.target.value);
    if (!isNaN(newBpm) && newBpm > 0) {
      setBpm(newBpm);
    }
  };

  const handleSoundChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSoundType(event.target.value);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTapTempo = () => {
    const now = Date.now();

    if (!isPlaying) playClick();

    setTapTimes((prev) => {
      const updatedTaps = [...prev, now].slice(-5);
      if (updatedTaps.length > 1) {
        const intervals = updatedTaps.slice(1).map((time, i) => time - updatedTaps[i]);
        const averageInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const newBpm = Math.round(60000 / averageInterval);
        setBpm(newBpm);
      }
      return updatedTaps;
    });

    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }

    tapTimeoutRef.current = setTimeout(() => {
      setTapTimes([]);
    }, (60000 / bpm) * 2);
  };

  return (
      <div>
        <input
            type="number"
            value={bpm}
            onChange={handleBpmChange}
            min="1"
        />
        <button onClick={togglePlay}>
          {isPlaying ? 'Stop' : 'Start'}
        </button>
        <button onClick={handleTapTempo}>Tap Tempo</button>
        <select onChange={handleSoundChange} value={soundType}>
          <option value="sound-native">Native Synth</option>
          <option value="sound-ableton">Ableton Click</option>
        </select>
        <p>{isPlaying ? `Playing at ${bpm} BPM` : 'Metronome stopped'}</p>
      </div>
  );
};

export default Metronome;
