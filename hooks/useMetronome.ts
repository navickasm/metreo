import { useState } from 'react';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { useTapTempo } from './useTapTempo';
import { usePlaybackScheduler } from './usePlaybackScheduler';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';

export function useMetronome() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [bpm, setBpm] = useState(120);
    const [soundType, setSoundType] = useState('sound-native');
    const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
    const [noteValue, setNoteValue] = useState(4);
    const [currentBeat, setCurrentBeat] = useState(0);

    const { initAudio, playClick, loadSamples } = useAudioEngine(soundType);

    useState(() => {
        initAudio();
        loadSamples();
    });

    const { playTypes, setPlayTypes } = usePlaybackScheduler({
        isPlaying,
        bpm,
        beatsPerMeasure,
        playClick,
        setCurrentBeat,
    });

    const { handleTapTempo } = useTapTempo({
        bpm,
        setBpm,
        isPlaying,
        playClick,
    });

    useKeyboardShortcuts({
        togglePlay: () => setIsPlaying(prev => !prev),
        handleTapTempo,
    });

    return {
        isPlaying,
        bpm,
        soundType,
        beatsPerMeasure,
        noteValue,
        playTypes,
        currentBeat,
        setBpm,
        setSoundType,
        setBeatsPerMeasure,
        setNoteValue,
        setPlayTypes,
        togglePlay: () => setIsPlaying(prev => !prev),
        handleTapTempo,
    };
}
