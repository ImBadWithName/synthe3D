import React, { useContext } from 'react'
import { fltSet } from '../main'
import { CTX } from '../context/Store'

type Props = {
    // filterSettings:fltSet,
    // changeFilterSettings:(id:keyof fltSet,value:number|BiquadFilterType)=>void
}


const Filter = (props: Props) => {
    const [appState,updateState]=useContext(CTX)
    const {frequency,detune,gain,Q,type} = appState.filterSettings;
    const change =  (id:string,value:number|BiquadFilterType)=>{
        updateState({type:"CHANGE_FILTER",payload:{id,value}})
    }
    const filterType = ["allpass" , "bandpass" , "highpass" , "highshelf" , "lowpass" , "lowshelf" , "notch" , "peaking"]

  return (
    <div>
        <div>
            <h3>Frequency</h3>
            <input type="range" 
                onChange={(e)=>change("frequency",e.target.valueAsNumber)}
                max={10000}
                value={frequency}
            />
        </div>
        <div>
            <h3>Detune</h3>
            <input type="range" 
                onChange={(e)=>change("detune",e.target.valueAsNumber)}
                value={detune}
            />
        </div>
        <div>
            <h3>Gain</h3>
            <input type="range" 
                onChange={(e)=>change("gain",e.target.valueAsNumber)}
                 max={10}
                 step={0.1}
                value={gain}
            />
        </div>
        <div>
            <h3>Q</h3>
            <input type="range" 
            step={0.1}
                onChange={(e)=>change("Q",e.target.valueAsNumber)}
                 max={10}
                value={Q}
            />
        </div>
        <div>
            <select 
             onChange={(e)=>change("type",e.target.value as BiquadFilterType)}

            value={type} name="type" id="type">
                {filterType.map(e=>
                    <option value={e}>{e}</option>
                )}
            </select>
        </div>
    </div>
  )
}

export default Filter