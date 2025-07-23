import {useEffect, useRef, useState} from 'react';
import {PlayType} from "@/types";

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
    const playTypesRef = useRef<(PlayType)[]>(Array.from({ length: beatsPerMeasure }, (_, i) =>
        i === 0 ? "accent" : "regular"
    ));
    const [playTypes, setPlayTypes] = useState(playTypesRef.current);

    useEffect(() => {
        playTypesRef.current = playTypes;
    }, [playTypes]);

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
        playClick(playTypesRef.current[0] === "accent");

        timerRef.current = setInterval(() => {
            const nextBeat = (beatRef.current % beatsPerMeasure) + 1;
            beatRef.current = nextBeat;
            setCurrentBeat(nextBeat);
            if (playTypesRef.current[nextBeat - 1] !== "mute") {
                playClick(playTypesRef.current[nextBeat - 1] === "accent");
            }
        }, interval);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [isPlaying, bpm, beatsPerMeasure, playClick, setCurrentBeat]);

    return { playTypes, setPlayTypes };
}
