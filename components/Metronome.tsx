'use client';

import React from 'react';
import { useMetronome } from '@/hooks/useMetronome';
import { BeatDisplay } from './BeatDisplay/BeatDisplay';

const Metronome = () => {
    const metronome = useMetronome();

    return (
        <div>
            <input type="number" value={metronome.bpm} onChange={e => metronome.setBpm(+e.target.value)} min="1"/>
            <input type="number" value={metronome.beatsPerMeasure} onChange={e => metronome.setBeatsPerMeasure(+e.target.value)} min="1"/>
            <select onChange={e => metronome.setNoteValue(+e.target.value)} value={metronome.noteValue}>
                <option value="2">/2</option>
                <option value="4">/4</option>
                <option value="8">/8</option>
                <option value="16">/16</option>
            </select>
            <button onClick={metronome.togglePlay}>{metronome.isPlaying ? 'Stop' : 'Start'}</button>
            <button onClick={metronome.handleTapTempo}>Tap Tempo</button>
            <select onChange={e => metronome.setSoundType(e.target.value)} value={metronome.soundType}>
                <option value="sound-native">Native Synth</option>
                <option value="sound-ableton">Ableton Click</option>
            </select>
            <p>
            {metronome.isPlaying
                    ? `Playing at ${metronome.bpm} BPM - Beat ${metronome.currentBeat} of ${metronome.beatsPerMeasure} in ${metronome.beatsPerMeasure}/${metronome.noteValue}`
                    : 'Metronome stopped'}
            </p>
            <BeatDisplay
                beatsPerMeasure={metronome.beatsPerMeasure}
                currentBeat={metronome.currentBeat}
                playTypes={metronome.playTypes}
                setPlayTypes={metronome.setPlayTypes}
            />
        </div>
    );
};

export default Metronome;
