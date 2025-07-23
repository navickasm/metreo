import {useCallback, useEffect, useRef} from 'react';

export function useAudioEngine(soundType: string) {
    const audioContextRef = useRef<AudioContext | null>(null);
    const buffersRef = useRef({
        abletonAccent: null as AudioBuffer | null,
        abletonNonAccent: null as AudioBuffer | null,
    });
    const soundTypeRef = useRef(soundType);

    const initAudio = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = typeof window !== 'undefined' ? new window.AudioContext() : null;
        }
    }, []);

    const loadSamples = useCallback(async () => {
        if (
            audioContextRef.current &&
            soundType === 'sound-ableton' &&
            (
                !buffersRef.current.abletonNonAccent ||
                !buffersRef.current.abletonAccent
            )
        ) {
            try {
                const fetchBuffer = async (url: string) =>
                    audioContextRef.current!.decodeAudioData(await (await fetch(url)).arrayBuffer());
                buffersRef.current.abletonNonAccent = await fetchBuffer('sounds/1_1.wav');
                buffersRef.current.abletonAccent = await fetchBuffer('sounds/1_2.wav');
            } catch (err) {
                console.error('Failed to load Ableton samples', err);
            }
        }
    }, [soundType]);

    useEffect(() => {
        soundTypeRef.current = soundType;
        loadSamples();
    }, [soundType]);

    const playClick = useCallback((isAccent: boolean) => {
        const ctx = audioContextRef.current;
        if (!ctx) return;

        if (soundTypeRef.current === 'sound-native') { // Use ref instead of dependency
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(isAccent ? 880 : 440, ctx.currentTime);
            gain.gain.setValueAtTime(1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } else {
            const buffer = isAccent ? buffersRef.current.abletonAccent : buffersRef.current.abletonNonAccent;
            if (buffer) {
                const src = ctx.createBufferSource();
                src.buffer = buffer;
                src.connect(ctx.destination);
                src.start();
            }
        }
    }, []);

    return { initAudio, loadSamples, playClick };
}
