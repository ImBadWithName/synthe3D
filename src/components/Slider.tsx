import { useSpring,animated } from '@react-spring/three'
import { DragControls, useHelper } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useGesture } from '@use-gesture/react'
import React, { Component, ComponentProps, useEffect, useMemo, useRef, useState } from 'react'
import { Group, Plane, PlaneHelper, Vector3 } from 'three'
import Log from './logarithm/log'

export type SliderProps = ComponentProps<"group">&{
    onDrag?:()=>void
    onDragEnd?:()=>void
    range?:[number,number]
    value?:number
    min?:number
    max?:number
    onChange?:(e:number)=>void
    logarythm?:boolean
    permitedValues?:number[]
    children?:JSX.Element
}

const Slider = (props: SliderProps) => {
    const min = props.min || 0
    const max = props.max ||1
    const [value,setValue] = useState(props.value||min)
    const range = props.range || [-1,1]
    const log = new Log({minpos:range[0],maxpos:range[1],minval:min,maxval:max})
    const { raycaster,scene } = useThree();
    const planeOrigin1 = new Vector3()
    const planeOrigin2 = new Vector3()
    const planeOrigin3 = new Vector3()
    const intersectionPlane = useMemo(()=>  new Plane(),[]);
    const valueToPos =(e:number)=>{
        if(props.logarythm){
            // console.log(e,log.value(log.position(e)),log.position(e))
            return log.position(e)
        }
        return  ((e-min)/(max-min))*(range[1]-range[0])+range[0]
    }
    const posToValue =(pos:number)=>{
        const baseValue =pos
        let value;
        if(props.logarythm){
            if(baseValue === 0){
                value =0
            }
            else{
                value= log.value(baseValue)
                // if(value>1000) value =  Math.round(value/100)*100
                // if(value>500) value= Math.round(value/10)*10
            }

        }
        else {
            value = ((pos-range[0])/(range[1]-range[0]))*(max-min)+min
        }
        return value
    }
    useEffect(()=>{
        if(props.value!=undefined){
            api.start({position:[0,0,-valueToPos(props.value)]})
        }
    },[props.value])

    useEffect(()=>{
        api.start({position:[0,0,-valueToPos(value)]})
    },[value])
    
    useEffect(()=>{
        if(groupRef.current){
            groupRef.current.getWorldPosition(planeOrigin1)
            planeOrigin2.set(1,0,0)
            groupRef.current.localToWorld(planeOrigin2)
            planeOrigin3.set(1,0,1)
            groupRef.current.localToWorld(planeOrigin3)
            intersectionPlane.setFromCoplanarPoints(planeOrigin2,planeOrigin1,planeOrigin3)
        }
    })
    
    const groupRef = useRef<Group>(null)
    const [spring, api] = useSpring(() => ({position:[0,0,0]}))
   
    const bind = useGesture({
        onDrag: () => {
            props.onDrag&& props.onDrag()
            const result = new Vector3()
            raycaster.ray.intersectPlane(intersectionPlane,result);
            
            groupRef.current?.worldToLocal(result)
            const baseZ = -result.z
            
            let newValue = posToValue(baseZ)
            newValue = Math.min(Math.max(newValue,min),max)
            
             if(props.permitedValues){
                newValue = props.permitedValues.reduce(
                    (prev,curr)=>Math.abs(curr-newValue)<Math.abs(prev-newValue)?curr:prev
                )
             }
             setValue(newValue)
             const newZ = valueToPos(newValue)
             
             props.onChange && props.onChange(newValue)
        },
         onDragEnd: () => {
            props.onDragEnd && props.onDragEnd()
        }
    })
  return (
    <group  ref={groupRef}
    {...props} >
        {/* @ts-ignore */}
        <animated.group 
        
        {...bind() }
        {...spring}>
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

export default Slider