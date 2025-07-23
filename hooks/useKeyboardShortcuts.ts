import { useEffect } from 'react';

export function useKeyboardShortcuts({
                                         togglePlay,
                                         handleTapTempo,
                                     }: {
    togglePlay: () => void;
    handleTapTempo: () => void;
}) {
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' || (e.key === ' ' && document.activeElement === document.body)) {
                e.preventDefault();
                togglePlay();
            } else if (e.key === 't') {
                e.preventDefault();
                handleTapTempo();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [togglePlay, handleTapTempo]);
}
