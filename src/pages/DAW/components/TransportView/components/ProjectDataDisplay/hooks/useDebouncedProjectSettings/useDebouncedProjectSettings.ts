import { useEffect } from "react";
import { useAudioEngine, useDebounce } from "src/pages/DAW/hooks";

const MIN_MEASURES = 8;
const MAX_MEASURES = 999;

const MIN_TIME_SIGNATURE = 1;
const MAX_TIME_SIGNATURE = 12;

const MIN_BPM = 20;
const MAX_BPM = 500;

export const useDebouncedProjectSettings = () => {
  const audioEngine = useAudioEngine();
  const [
    totalMeasuresInput,
    debouncedTotalMeasureInput,
    setTotalMeasuresInput,
  ] = useDebounce<string | number>(audioEngine.timeline.totalMeasures, 500);

  const [
    timeSignatureInput,
    debouncedTimeSignatureInput,
    setTimeSignatureInput,
  ] = useDebounce<string | number>(audioEngine.timeSignature as number, 500);

  const [bpmInput, debouncedBpmInput, setBpmInput] = useDebounce<
    string | number
  >(audioEngine.bpm, 500);

  useEffect(() => {
    const meaures = Number(debouncedTotalMeasureInput);
    if (meaures >= MIN_MEASURES && meaures <= MAX_MEASURES) {
      audioEngine.timeline.setTotalMeasures(meaures);
    } else {
      setTotalMeasuresInput(audioEngine.timeline.totalMeasures);
    }
  }, [debouncedTotalMeasureInput]);

  useEffect(() => {
    const timeSignature = Number(debouncedTimeSignatureInput);
    if (
      timeSignature <= MAX_TIME_SIGNATURE &&
      timeSignature >= MIN_TIME_SIGNATURE
    ) {
      audioEngine.setTimeSignature(timeSignature);
    } else {
      setTimeSignatureInput(audioEngine.timeSignature as number);
    }
  }, [debouncedTimeSignatureInput]);

  useEffect(() => {
    const bpm = Number(debouncedBpmInput);

    if (bpm >= MIN_BPM && bpm <= MAX_BPM) {
      audioEngine.setBpm(bpm);
    } else {
      setBpmInput(audioEngine.bpm);
    }
  }, [debouncedBpmInput]);

  return {
    totalMeasuresInput,
    setTotalMeasuresInput,
    timeSignatureInput,
    setTimeSignatureInput,
    bpmInput,
    setBpmInput,
  };
};
