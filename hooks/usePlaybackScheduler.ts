import { useEffect, useRef } from 'react';

export function usePlaybackScheduler({
                                         isPlaying,
                                         bpm,
                                         beatsPerMeasure,
                                         playClick,
                                         setCurrentBeat,
                                     }: {
    isPlaying: boolean;
    bpm: number;
    beatsPerMeasure: number;
    playClick: (isAccent: boolean) => void;
    setCurrentBeat: (beat: number) => void;
}) {
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const beatRef = useRef(1);

    useEffect(() => {
        if (!isPlaying) {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            beatRef.current = 1;
            setCurrentBeat(0);
            return;
        }

        const interval = 60000 / bpm;
        beatRef.current = 1;
        setCurrentBeat(1);
        playClick(true);

        timerRef.current = setInterval(() => {
            const nextBeat = (beatRef.current % beatsPerMeasure) + 1;
            beatRef.current = nextBeat;
            setCurrentBeat(nextBeat);
            playClick(nextBeat === 1);
        }, interval);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [isPlaying, bpm, beatsPerMeasure, playClick, setCurrentBeat]);
}
