import React, { ComponentProps, useContext } from 'react'
import { CTX } from '../context/Store'
import Slider from './Slider'
import { SliderModel } from './SliderModel'

type Props = ComponentProps<"group">&{
    gap:number
}

const Adsr = (props: Props) => {
    const [appState,updateState]=useContext(CTX)
    const envelope = appState.envelope;
    
    const change =(value:number, id:string)=>{
        console.log(value)
        updateState({type: "CHANGE_ADSR",payload:{id,value}})
    }
    const asdr = [
        {max:2,name:"attack"},
        {max:1,name:"decay"},
        {max:1,name:"sustain"},
        {max:1,name:"release"},
    ]
  return (
    <group {...props}>
        {asdr.map((item,index)=>(
            <SliderModel range={[-0.4,0.7]} max={item.max} position-x={index*props.gap}  onChange={e=>change(e,item.name)} value={envelope[item.name]} />
        ))}
    </group>
  )
}

export default Adsr