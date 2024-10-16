import { useSpring,animated } from '@react-spring/three'
import React, { ComponentProps, useState } from 'react'

type Props = ComponentProps<"group"> &{
    value?:Boolean
    onChange?:(value:Boolean)=>void
    children?:JSX.Element
    amplitude?:number
}

const Switch = (props: Props) => {
    const amplitude = props.amplitude||1
    const [value,setValue] = useState(false)
    const{positionX} = useSpring({positionX:value?amplitude/2:-amplitude/2,config: { mass: 1}})
    const handleClick=()=>{
        props.onChange && props.onChange(!value)
        setValue(!value)
    }
  return (
    <group  {...props}>
        <animated.group onPointerDown={handleClick} position-x={positionX}>
            {props.children}
        </animated.group>
    </group>
  )
}

export default Switch