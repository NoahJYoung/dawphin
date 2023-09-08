import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { AudioEngine } from "src/AudioEngine";
import { InputNumber } from "antd";

interface ProjectDataDisplayProps {
  audioEngine: AudioEngine
}

export const ProjectDataDisplay = observer(({ audioEngine }: ProjectDataDisplayProps) => {
  const [isBpmInputMode, setIsBpmInputMode] = useState(false);
  const [isTimeSignatureInputMode, setIsTimeSignatureInputMode] = useState(false);

  return (
    <div
      style={{
        fontFamily: 'arial',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        background: '#111',
        fontSize: '20px',
        gap: '1rem',
        color: '#888',
        height: '100%',
        borderRadius: '5px',
        border: '1px solid #888',
        width: '12rem',
      }}
    >
      <div style={{ justifyContent: 'center', width: '100%', height: '100%', display: 'flex', alignItems: 'center' }} onClick={() => setIsBpmInputMode(true)}>
        {isBpmInputMode ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', width: '100%', flexWrap: 'nowrap' }}>
            <InputNumber
              value={audioEngine.bpm}
              type="number"
              style={{ maxWidth: '3rem', maxHeight: '100%', fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit', border: 'none', outline: 'none' }}
              controls={false}
              onBlur={() => setIsBpmInputMode(false)}
              onPressEnter={() => setIsBpmInputMode(false)}
              autoFocus
              onChange={(e) => {
                const value = e?.valueOf();
                if (value && value > 40) {
                  audioEngine.setBpm(value)
                }
              }}
            />
            <p>bpm</p>
          </div>
        ) : (
          <div>
            {`${audioEngine.bpm} bpm`}
          </div>
        )}
      </div>
      <div
        style={{
          justifyContent: 'center',
          width: '100%',
          borderLeft: '2px solid #888',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'nowrap'
          }}
        onClick={() => setIsTimeSignatureInputMode(true)}
      >
        {isTimeSignatureInputMode ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', width: '100%', flexWrap: 'nowrap' }}>
            <InputNumber
              value={audioEngine.timeSignature as number}
              style={{ maxWidth: '2rem', maxHeight: '3rem', fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit', border: 'none', outline: 'none' }}
              min={1}
              max={7}
              controls={false}
              type="number"
              size="small"
              onChange={(e) => {
                const input = e?.valueOf();
                if (input && input > 0) {
                  audioEngine.setTimeSignature(input)
                }
              }}
              onBlur={() => setIsTimeSignatureInputMode(false)}
              onPressEnter={() => setIsTimeSignatureInputMode(false)}
              autoFocus
            />
            <p> / 4</p>
          </div>
        ) : (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            {`${audioEngine.timeSignature} / 4`}
          </div>
        )}
      </div>
    </div>
  )
});
