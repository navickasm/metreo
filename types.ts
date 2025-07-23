export type TimeSignature = {
    beatsPerMeasure: number; // Numerator
    beatUnit: number; // Denominator (4 = quater note, 8 = eighth note...)
};

export type PlayType = 'regular' | 'accent' | 'mute';