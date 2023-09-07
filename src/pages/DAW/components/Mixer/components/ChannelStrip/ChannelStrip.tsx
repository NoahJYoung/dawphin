import React from "react";
import { Button, Slider,  } from "antd";
import { observer } from "mobx-react-lite";
import { Track } from "src/AudioEngine/Track";
import { Knob } from "src/pages/DAW/UIKit";

interface ChannelStripProps {
  track: Track;
}

export const ChannelStrip = observer(({ track }: ChannelStripProps) => {

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
          background: `radial-gradient(#555, ${track.color})`,
          borderRadius: '5px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          padding: '0.25rem 0 0.25rem 0',
        }}
      >
        <Knob
          size={30}
          value={track.pan || 0}
          onChange={track.setPan}
          min={-100}
          max={100}
        />
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
        <Slider
          min={-51}
          max={6}
          style={{ height: '140px', position: 'relative', marginTop: '10px', marginBottom: '10px' }}
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
            zIndex: '1000'
          }}
          railStyle={{
            background: '#111'
          }}
          trackStyle={{
            background: '#111'
          }}
        />
        <p style={{ width: '100%',  padding: 0, margin: 0, fontFamily: 'Arial', fontSize: '0.75rem', color: '#aaa' }}>{ track.name }</p>
      </div>
    </div>
  )
})