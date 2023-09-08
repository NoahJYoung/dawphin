import React from "react";
import { Button, Slider,  } from "antd";
import { observer } from "mobx-react-lite";
import { Track } from "src/AudioEngine/Track";
import { Knob } from "src/pages/DAW/UIKit";
import { RecordIcon } from "src/pages/DAW/icons";

interface ChannelStripProps {
  track: Track;
  trackNumber: number;
}

export const ChannelStrip = observer(({ track, trackNumber }: ChannelStripProps) => {

  const activeOuterRgb = 'rgb(200, 0, 0)';
  const inactiveOuterRgb = 'rgb(150, 0, 0)';
  const activeInnerRgb = 'rgb(150, 0, 0)';
  const inactiveInnerRgb = 'rgb(100, 0, 0)';
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '6rem',
        height: '100%',
      }}
    >
      <div
        style={{
          border: '1px solid #111',
          background: track.color,
          borderRadius: '5px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%',
          padding: '0.25rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Button
            icon={<RecordIcon width={35} height={35} color={track.active ? activeOuterRgb: inactiveOuterRgb} innerColor={track.active ? activeInnerRgb: inactiveInnerRgb} />}
            onClick={track.toggleActive}
            style={{
              background: 'transparent',
              marginLeft: '5px',
              border: 'none',
              width: 35,
              height: 35,
              padding: 0,
              borderRadius: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        <Knob
          size={30}
          value={track.pan || 0}
          onChange={track.setPan}
          min={-100}
          max={100}
        />
        </div>
        <div
          style={{
            display: 'flex',
            gap: '5px',
            justifyContent: 'space-evenly',
            height: '175px',
          }}
        >
          <div style={{ width: '1rem', background: 'black', height: '175px', alignSelf: 'center' }} />
          <Slider
            min={-51}
            max={6}
            style={{ height: '145px', position: 'relative', marginTop: '10px', marginBottom: '10px' }}
            vertical
            value={track.volume || 0}
            onChange={track.setVolume}
            handleStyle={{
              width: '25px',
              height: '40px',
              background: 'radial-gradient(#bbb, #777)',
              borderRadius: '5px',
              position: 'absolute',
              left: '-5px',
              zIndex: '1000',
            }}
            railStyle={{
              background: '#111'
            }}
            trackStyle={{
              background: '#111'
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <Button
            onClick={() => {
              track.toggleMute();
            }}
            type="text"
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 0,
              fontSize: '0.75rem',
              fontWeight: 'bold',
              background: `${track.muted ? 'red' : 'grey'}`
            }}
          >
            M
          </Button>
          <Button
            onClick={() => {}}
            type="text"
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 0,
              fontSize: '0.75rem',
              fontWeight: 'bold',
              background: `${track.solo ? 'yellow' : 'grey'}`
            }}
          >
            S
          </Button>
          </div>
        </div>
        <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <p style={{ padding: 0, margin: 0, fontFamily: 'Arial', color: '#111' }}>{ trackNumber }</p>
        </div>
      </div>
    </div>
  )
})