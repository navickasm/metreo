import { useState } from 'react';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { useTapTempo } from './useTapTempo';
import { usePlaybackScheduler } from './usePlaybackScheduler';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import {TimeSignature} from "@/types";

export function useMetronome() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [bpm, setBpm] = useState(120);
    const [soundType, setSoundType] = useState('sound-native');
    const [timeSignature, setTimeSignature] = useState<TimeSignature>({ beatsPerMeasure: 4, beatUnit: 4 });
    const [currentBeat, setCurrentBeat] = useState(0);

    const { initAudio, playClick, loadSamples } = useAudioEngine(soundType);

    useState(() => {
        initAudio();
        loadSamples();
    });

    const { playTypes, setPlayTypes } = usePlaybackScheduler({
        isPlaying,
        bpm,
        timeSignature,
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
        timeSignature,
        playTypes,
        currentBeat,
        setBpm,
        setSoundType,
        setTimeSignature,
        setPlayTypes,
        togglePlay: () => setIsPlaying(prev => !prev),
        handleTapTempo,
    };
}
