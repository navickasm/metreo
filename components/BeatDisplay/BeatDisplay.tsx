import React from 'react';
import styles from './BeatDisplay.module.css';
import { Beat } from "@/components/BeatDisplay/Beat";

export const BeatDisplay = ({
                                beatsPerMeasure,
                                currentBeat,
                            }: {
    beatsPerMeasure: number;
    currentBeat: number;
}) => {
    return (
        <div className={styles.beatDisplay}>
            {Array.from({ length: beatsPerMeasure }, (_, i) => (
                <Beat
                    key={i}
                    beatIndex={i}
                    active={currentBeat === i + 1}
                    playType={i === 0 ? "accent" : "regular"}
                />
            ))}
        </div>
    );
};