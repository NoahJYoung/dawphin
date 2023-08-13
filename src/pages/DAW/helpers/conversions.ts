export const tickToSample = (tick: number, samplesPerTick: number) => tick * samplesPerTick;

export const sampleToTick = (sample: number, samplesPerTick: number) => sample / samplesPerTick;
