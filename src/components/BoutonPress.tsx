import { useSpring,animated } from '@react-spring/three'
import React, { Children, ComponentProps, useEffect, useState } from 'react'

type  Props = ComponentProps<"group">&{
    color?:string
    colorPressed?:string
    pressIntensity?:number
    onChange?:(e:boolean)=>void
    value?:boolean
    canChange?:boolean
    children?:JSX.Element
}

const BoutonPress = (props: Props) => {
    useEffect(()=>{
        if(props.value!==undefined){
            setIsPressed(props.value)
        }
    },[props.value])
    const pressIntensity = props.pressIntensity ||0.1
    const colorUnpressed = props.color || "white"
    const colorPressed = props.colorPressed ||"black"
    const [isPressed,setIsPressed] = useState(false)
    const{color,pressLevel} = useSpring({color:isPressed?colorPressed:colorUnpressed,pressLevel:isPressed?-pressIntensity:0,config: { mass: 1}})
    const handlePress =()=>{
        if(props.canChange || props.canChange===undefined){
            props.onChange && props.onChange(!isPressed)
            setIsPressed(!isPressed)
        }
    }
    return (
    <group {...props}>
        <animated.group position-y={pressLevel} onClick={handlePress}>
            {props.children}
            {/* <boxGeometry args={[0.2,0.2,0.2]}/>
            <animated.meshStandardMaterial color={color}/> */}
        </animated.group>
    </group>
  )
}

export default BoutonPress