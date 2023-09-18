import { Slider, Typography} from "antd";
import { observer } from "mobx-react-lite";
import { MasterControl } from "src/AudioEngine/MasterControl";
import { MasterMeter } from "./components";

import styles from './MasterFader.module.scss';

const { Text } = Typography;

interface MasterFaderProps {
  masterControl: MasterControl
}

export const MasterFader = observer(({ masterControl }: MasterFaderProps) => {

  return (
    <div className={styles.masterFader}>
      <div
        style={{
          background: "#444",
          border: '1px solid #111',
          borderRadius: '5px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%',
          width: '120px',
        }}
      >
        <Text style={{ color: '#aaa' }}>Master</Text>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            gap: '20px',
            
            width: 'fit-content',
          }}
        >
        </div>
        <div
          style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'space-evenly',
            padding: '10px',
          }}
        >
          <MasterMeter
            master={masterControl}
            canvasHeight={225}
            canvasWidth={50}
          />
          <Slider
            min={-51}
            max={6}
            style={{ height: '200px', position: 'relative', marginTop: '10px', marginBottom: '10px' }}
            vertical
            value={masterControl.volume || 0}
            onChange={masterControl.setVolume}
            handleStyle={{
              width: '25px',
              height: '40px',
              background: 'radial-gradient(#bbb, #777)',
              borderRadius: '5px',
              border: '1px solid #111',
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
          </div>
        </div>
        <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        </div>
      </div>
    </div>
  )
})