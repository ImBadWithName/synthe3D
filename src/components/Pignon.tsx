import { useSpring,animated } from '@react-spring/three'
import { DragControls, useHelper } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useGesture } from '@use-gesture/react'
import React, { Component, ComponentProps, useEffect, useMemo, useRef, useState } from 'react'
import { Group, Plane, PlaneHelper, Vector3 } from 'three'

export type PignonProps = ComponentProps<"group">&{
    onDrag?:()=>void
    onDragEnd?:()=>void
    range?:[number,number]
    value?:number
    min?:number
    max?:number
    onChange?:(e:number)=>void
    valuePerTurn?:number
    children?:JSX.Element
}

const Pignon = (props: PignonProps) => {
    
    const valuePerTurn = props.valuePerTurn ||1
    const sensibility = 0.01
    const min = props.min || 0
    const max = props.max ||1
    const [value,setValue] = useState(props.value||min)
    const range = props.range || [-1,1]

    const valueToAngle =(e:number)=>{
        const val = e%valuePerTurn
        return -(e*2*Math.PI)/valuePerTurn
        // return  range[1]-((value-min)/(max-min))*(range[1]-range[0])
    }
    // console.log("value to angle : 0.5",valueToAngle(0.5))
    const angleToValue=()=>{

    }
    useEffect(()=>{

        if(props.value!=undefined){

            // api.start({rotationY:})
        }
    },[props.value])
    
    const groupRef = useRef<Group>(null)
    const [spring, api] = useSpring(() => ({rotationY:0,config: { mass: 1}}))
    
    const bind = useGesture({
        onDrag: ({ down, delta: [mx, my], movement: [x, y] } ) => {
            if (down){
                const previousAngle = 1-((Math.atan2(x-mx,y-my)/2 )/ Math.PI+0.5)
                const currentAngle = 1-((Math.atan2(x,y)/2 )/ Math.PI+0.5)
                // console.log(previousAngle,currentAngle, currentAngle-previousAngle)
                let deltaAngle =  currentAngle-previousAngle
                if (Math.abs(deltaAngle)>0.5){
                    if(deltaAngle>0){
                        deltaAngle=1-deltaAngle
                    }
                    else{
                        deltaAngle=-1-deltaAngle
                    }
                    
                }
                console.log(deltaAngle)
                // const selectedAxis = Math.abs(mx)>Math.abs(my)?mx:-my
                // let newValue = value+(selectedAxis*sensibility*valuePerTurn)
                let newValue = value+deltaAngle*valuePerTurn*2
                newValue = Math.min(max,Math.max(newValue,min))

                // props.onDrag&& props.onDrag()
                api.start({rotationY:valueToAngle(newValue)})
                // const numberOfTurn = (spring.rotationY.get()+selectedAxis*sensibility)/(2*Math.PI)
                const range = max-min
                // const value = ((numberOfTurn*valuePerTurn)%range)+min
                // console.log("rotation value : ", numberOfTurn)
                // console.log(" value : ", newValue)
                // const value = max-((newZ-range[0])/(range[1]-range[0]))*(max-min)
                props.onChange && props.onChange(value)
                setValue(newValue)
            }

        },
         onDragEnd: () => {
            props.onDragEnd && props.onDragEnd()
        }
    })
  return (
    <group  
    {...props} >
        {/* @ts-ignore */}
        <animated.group   
            {...bind() }
            rotation-y={spring.rotationY}
        >
            {props.children}
            {!props.children &&
                <mesh>
                    <boxGeometry args={[0.2,0.2,0.2]}/>
                    <meshStandardMaterial/>
                </mesh>
            }

        </animated.group>
    </group>
  )
}

export default Pignon