import React, { ComponentProps, useContext, useEffect, useRef, useState } from 'react'
import { CTX } from '../context/Store'
import { useSpring,animated } from '@react-spring/three'
import { BufferGeometry, Color, Mesh, MeshStandardMaterial, Object3D } from 'three'
import { FullKey } from './3dComponents/FullKey'
import { BlackKey } from './3dComponents/BlackKey'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { ThreeEvent } from '@react-three/fiber'


type Props = ComponentProps<"group">&{
    frequency:number
    button?:string
    baseColor?:string
    pressedColor?:string
    hoveredColor?:string
    type?:"Full"|"T"|"L"|"Black"|"InvertedL"
}

type GLTFResult = GLTF & {

  nodes: {
    any: Mesh
  }
  materials: {
    ['Material.001']: MeshStandardMaterial
  }
}
const Key = (props: Props) => {
  const type = props.type || "Full"
  const files= {
    Full:"/3DModels/FullKey.glb",
    Black:"/3DModels/BlackKey.glb",
    T:"/3DModels/TKey.glb",
    L:"/3DModels/LKey.glb",
    InvertedL:"/3DModels/LKey.glb"
  }
  const { nodes, materials } = useGLTF(files[type]) as GLTFResult
  const geometry:BufferGeometry|undefined = Object.values(nodes).find((e:any)=>e.geometry!==undefined)?.geometry

  const baseColor = props.baseColor ||"white"
  const pressedColor = props.pressedColor ||"black"

  const hoveredColor = props.hoveredColor || "grey"
  const [hovered,setHovered] =useState(false);
  const [appState,updateState]=useContext(CTX)
  const [pressed,setPressed]= useState(false);
  const springs= useSpring({ positionY:pressed?-0.25:0 ,color:pressed?pressedColor:(hovered?hoveredColor:baseColor) ,config: { mass: 1}})
  const frequency= useRef(props.frequency)
  const handleKeyDown=(e:KeyboardEvent)=>{

      if(e.code===props.button && !pressed && !e.repeat){
        e.preventDefault()
        pressKey()
      }
  }

  const handleKeyUp=(e:KeyboardEvent)=>{

      if(e.code===props.button){
        e.preventDefault()
        releaseKey()
      }
  }
  const pressKey = (e?:ThreeEvent<PointerEvent>)=>{
    e && e.stopPropagation()
    updateState({type:"MAKE_OSC",payload:{note:props.name,freq : frequency.current}})
    setPressed(true) 
  }
  const releaseKey = ()=>{
    updateState({type:"KILL_OSC",payload:{note:props.name,freq : frequency.current}})
    setPressed(false)
  }

  useEffect(()=>{
    frequency.current = props.frequency
  },[props.frequency])

  useEffect(()=>{
      window.addEventListener('keydown',(e)=>handleKeyDown(e))
      window.addEventListener('keyup',(e)=>handleKeyUp(e))
      
      return ()=>{
          window.removeEventListener('keydown',(e)=>handleKeyDown(e))
          window.removeEventListener('keyup',(e)=>handleKeyUp(e))
      }
  },[])
  return (
    <group {...props}>
      <animated.mesh 
          position-y={springs.positionY}
          onPointerDown={(e)=>pressKey(e)}
          onPointerUp={releaseKey}
          
          onPointerEnter={()=>setHovered(true)}
          onPointerLeave={()=>{releaseKey();setHovered(false)}}
          geometry={geometry}
          scale-x={type === "InvertedL"? -1:1}
          >
          <animated.meshToonMaterial color={springs.color}/>    
      </animated.mesh>
    </group>
  )
}

export default Key