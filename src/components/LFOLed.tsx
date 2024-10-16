import { useSpring,animated } from '@react-spring/three'
import React, { useContext } from 'react'
import { CTX } from '../context/Store'
import { useFrame } from '@react-three/fiber'
import Log from './logarithm/log'

type Props = {}

const LFOLed = (props: Props) => {
    const [appState,updateState]=useContext(CTX)
    const lfo:AnalyserNode = appState.lfo.node
    const log = new Log({    minpos :0,
      maxpos : 255,
      minval :0,
      maxval : 2})
 const [spring, api] = useSpring(() => ({luminosity:0}))
    useFrame(()=>{
        var buffer = new Uint8Array(lfo.fftSize);
        lfo.getByteTimeDomainData(buffer);
        /* RMS stands for Root Mean Square, basically the root square of the
        * average of the square of each value. */
        lfo.fftSize = 32;
        var rms = 0;
        for (var i = 0; i < buffer.length; i++) {
            rms += buffer[i] * buffer[i];
        }
        rms /= buffer.length;
        rms = Math.sqrt(rms);
        /* rms now has the value we want. */
        // console.log(rms)
        api.start({luminosity:((rms-30)/225)})
    })
    // 
  return (
    <animated.meshStandardMaterial color={"grey"} emissive={"yellow"} emissiveIntensity={spring.luminosity}/>
  )
}

export default LFOLed