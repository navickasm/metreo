import React from 'react';
import styles from './BeatDisplay.module.css';
import {PlayType} from "@/types";

export interface BeatProps {
    active: boolean;
    playType: PlayType;
    beatIndex: number;
}

export const Beat = ({ active, playType, beatIndex, onClick }: BeatProps & { onClick: () => void }) => {
    const classNames = [styles.beat];

    if (active) classNames.push(styles.active);
    if (playType === 'accent') classNames.push(styles.accent);
    else if (playType === 'regular') classNames.push(styles.regular);
    else if (playType === 'mute') classNames.push(styles.mute);

    return (
        <div className={classNames.join(' ')} onClick={onClick}>
            <p>{beatIndex + 1}</p>
        </div>
    );
};