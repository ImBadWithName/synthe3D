import React, { useContext, useEffect, useState } from 'react'
import { CTX } from '../context/Store'

type Props = {
    // oscSetting:{frequency:number,detune:number,type:string}
    // changeOscSetting:(id:string,value:number|string)=>void
}

const Osc1 = (props: Props) => {
    const [appState,updateState]=useContext(CTX)
    const {type,frequency,detune} = appState.osc1Settings;
    const change =  (id:string,value:number|OscillatorType)=>{
        updateState({type:"CHANGE_OSC1",payload:{id,value}})
    }
  return (
    <div>
        {/* <div>
            <h1>Frequency</h1>
            <input value={frequency} 
            onChange={(e)=>change("frequency",e.target.valueAsNumber)} type="range"  id="frequency" min={0} max={5000} />
        </div> */}
        <div>
            <h3>Detune</h3>
            <input 
            value={detune}
            onChange={(e)=>change("detune",e.target.valueAsNumber)}
            type="range"  
            id="Detune"/>
        </div>
        <div>
            <select 
             onChange={(e)=>change("type",e.target.value as OscillatorType)}

            value={type} name="type" id="type">
                
                <option value="square">Square</option>
                <option value="sawtooth">SawTooth</option>
                <option value="triangle">Triangle</option>
                <option  value="sine">Sine</option>
            </select>
        </div>
    </div>
  )
}

export default Osc1