import { useRef } from 'react';

export function useTapTempo({
                                bpm,
                                setBpm,
                                isPlaying,
                                playClick,
                            }: {
    bpm: number;
    setBpm: (bpm: number) => void;
    isPlaying: boolean;
    playClick: (isAccent: boolean) => void;
}) {
    const tapTimes = useRef<number[]>([]);
    const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleTapTempo = () => {
        const now = Date.now();
        if (!isPlaying) playClick(true);

        tapTimes.current.push(now);
        if (tapTimes.current.length > 5) tapTimes.current.shift();

        if (tapTimes.current.length > 1) {
            const intervals = tapTimes.current.slice(1).map((t, i) => t - tapTimes.current[i]);
            const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
            setBpm(Math.round(60000 / avg));
        }

        if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
        tapTimeoutRef.current = setTimeout(() => {
            tapTimes.current = [];
        }, (60000 / bpm) * 2);
    };

    return { handleTapTempo };
}
