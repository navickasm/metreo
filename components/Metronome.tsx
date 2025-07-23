'use client';

import React from 'react';
import { useMetronome } from '@/hooks/useMetronome';
import { BeatDisplay } from './BeatDisplay/BeatDisplay';

const Metronome = () => {
    const metronome = useMetronome();

    return (
        <div>
            <input type="number" value={metronome.bpm} onChange={e => metronome.setBpm(+e.target.value)} min="1"/>
            <input type="number" value={metronome.timeSignature.beatsPerMeasure} onChange={e => metronome.setTimeSignature({ ...metronome.timeSignature, beatsPerMeasure: +e.target.value })} min="1"/>
            <select onChange={e => metronome.setTimeSignature({...metronome.timeSignature, beatUnit: +e.target.value})}
                    value={metronome.timeSignature.beatUnit}>
                <option value="2">/2</option>
                <option value="4">/4</option>
                <option value="8">/8</option>
                <option value="16">/16</option>
            </select>
            <button onClick={metronome.togglePlay}>{metronome.isPlaying ? 'Stop' : 'Start'} (K)</button>
            <button onClick={metronome.handleTapTempo}>Tap Tempo (T)</button>
            <select onChange={e => metronome.setSoundType(e.target.value)} value={metronome.soundType}>
                <option value="sound-native">Native Synth</option>
                <option value="sound-ableton">Ableton Click</option>
            </select>
            <p>
            {metronome.isPlaying
                    ? `Playing at ${metronome.bpm} BPM - Beat ${metronome.currentBeat} of ${metronome.timeSignature.beatsPerMeasure} in ${metronome.timeSignature.beatsPerMeasure}/${metronome.timeSignature.beatUnit}`
                    : 'Metronome stopped'}
            </p>
            <BeatDisplay
                beatsPerMeasure={metronome.timeSignature.beatsPerMeasure}
                currentBeat={metronome.currentBeat}
                playTypes={metronome.playTypes}
                setPlayTypes={metronome.setPlayTypes}
            />
        </div>
    );
};

export default Metronome;
