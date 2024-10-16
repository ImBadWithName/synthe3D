import React, { ChangeEvent, ComponentProps, HtmlHTMLAttributes, useState } from 'react'
import Log from './log'

type Props = ComponentProps<"input"> & {
    onChange?:(e:number)=>void,
    defaultValue:number,
    minpos:number,
    maxpos :number
    minval:number
    maxval:number
}

const LogarithmicRange = (props: Props) => {

    const [position,setPosition] = useState()
    const log = new Log({
       minpos: props.minpos,
       maxpos: props.maxpos,
       minval: props.minval,
       maxval: props.maxval,
    })
    const calculateValue= (position:number)=>{
        if(position ===0) return 0;
        const value = log.value(position)
        if(value>1000) return Math.round(value/100)*100
        if(value>500) return Math.round(value/10)*10
        return Math.round(value)

    }
    const handleChange = (e:any)=>{
        const newPosition = e.target.valueAsNumber
        setPosition(newPosition)
        if(props.onChange) {
            const newValues= {
                position :newPosition,
                value : calculateValue(newPosition)
            }
            onchange(newValues)
        }

        
    }
  return (
    <input {...props} onChange={handleChange} value={position} type="range" />
  )
}

export default LogarithmicRange