'use client';

import React, {useEffect, useRef, useState, useCallback} from 'react';

const Metronome = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [soundType, setSoundType] = useState('sound-native');
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  const [currentBeat, setCurrentBeat] = useState(0);

  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const buffersRef = useRef<{
    abletonAccent: AudioBuffer | null;
    abletonNonAccent: AudioBuffer | null;
  }>({
    abletonAccent: null,
    abletonNonAccent: null,
  });

  const loadAbletonClickSound = useCallback(async () => {
    if (audioContextRef.current) {
      try {
        buffersRef.current.abletonNonAccent = await audioContextRef.current.decodeAudioData(await (await fetch('sounds/1_1.wav')).arrayBuffer());
        buffersRef.current.abletonAccent = await audioContextRef.current.decodeAudioData(await (await fetch('sounds/1_2.wav')).arrayBuffer());
      } catch (error) {
        console.error('Error loading Ableton click sound:', error);
      }
    }
  }, []);

  const playClick = useCallback((isAccent: boolean) => {
    if (audioContextRef.current) {
      if (soundType === 'sound-native') {
        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(isAccent ? 880 : 440, audioContextRef.current.currentTime);

        gainNode.gain.setValueAtTime(1, audioContextRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.1);

        oscillator.start();
        oscillator.stop(audioContextRef.current.currentTime + 0.1);
      } else if (soundType === 'sound-ableton') {
        const bufferToPlay = isAccent ? buffersRef.current.abletonAccent : buffersRef.current.abletonNonAccent;
        if (bufferToPlay) {
          const source = audioContextRef.current.createBufferSource();
          source.buffer = bufferToPlay;
          source.connect(audioContextRef.current.destination);
          source.start(0);
        } else {
          console.warn(`Ableton sound not loaded: ${isAccent ? 'Accent' : 'Non-Accent'}`);
        }
      }
    }
  }, [soundType]);

  useEffect(() => {
    audioContextRef.current = new window.AudioContext();
    loadAbletonClickSound();
  }, [loadAbletonClickSound]);

  useEffect(() => {
    if (isPlaying) {
      const interval = 60000 / bpm;

      setCurrentBeat(1);
      playClick(true);

      timerRef.current = setInterval(() => {
        setCurrentBeat((prevBeat) => {
          const nextBeat = (prevBeat % beatsPerMeasure) + 1;
          playClick(nextBeat === 1);
          return nextBeat;
        });
      }, interval);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      setCurrentBeat(0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, bpm, soundType, beatsPerMeasure, playClick]);

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

  const handleBeatsPerMeasureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newBeats = Number(event.target.value);
    if (!isNaN(newBeats) && newBeats > 0) {
      setBeatsPerMeasure(newBeats);
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

    if (!isPlaying) playClick(true);

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
        <input
            type="number"
            value={beatsPerMeasure}
            onChange={handleBeatsPerMeasureChange}
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
        <p>{isPlaying ? `Playing at ${bpm} BPM - Beat ${currentBeat} of ${beatsPerMeasure}` : 'Metronome stopped'}</p>
      </div>
  );
};

export default Metronome;
