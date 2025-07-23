import React from 'react';
import styles from './BeatDisplay.module.css';
import { Beat } from "@/components/BeatDisplay/Beat";
import {PlayType} from "@/types";

export const BeatDisplay = ({
                                beatsPerMeasure,
                                currentBeat,
                                playTypes,
                                setPlayTypes,
                            }: {
    beatsPerMeasure: number;
    currentBeat: number;
    playTypes: PlayType[];
    setPlayTypes: (playTypes: PlayType[]) => void;
}) => {
    const handleBeatClick = (index: number) => {
        const nextPlayType =
            playTypes[index] === "accent"
                ? "regular"
                : playTypes[index] === "regular"
                    ? "mute"
                    : "accent";

        const updatedPlayTypes = [...playTypes];
        updatedPlayTypes[index] = nextPlayType;
        setPlayTypes(updatedPlayTypes);
    };

    return (
        <div className={styles.beatDisplay}>
            {Array.from({ length: beatsPerMeasure }, (_, i) => (
                <Beat
                    key={i}
                    beatIndex={i}
                    active={currentBeat === i + 1}
                    playType={playTypes[i]}
                    onClick={() => handleBeatClick(i)}
                />
            ))}
        </div>
    );
};