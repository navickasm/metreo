import React from 'react';
import styles from './BeatDisplay.module.css';

export interface BeatProps {
    active: boolean;
    playType: 'regular' | 'accent' | 'mute';
    beatIndex: number;
}

export const Beat = ({ active, playType, beatIndex }: BeatProps) => {
    const classNames = [styles.beat];

    if (active) classNames.push(styles.active);
    if (playType === 'accent') classNames.push(styles.accent);
    else if (playType === 'regular') classNames.push(styles.regular);
    else if (playType === 'mute') classNames.push(styles.mute);

    return (
        <div className={classNames.join(' ')}>
            <p>{beatIndex + 1}</p>
        </div>
    );
};
