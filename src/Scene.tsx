import { CameraControls, Environment, Grid, OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { useEffect, useRef } from 'react'
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three'

import Key from './components/Key'
import { colorRange } from '@heyeso/color-range'
import tinycolor from "tinycolor2";
import Slider from './components/Slider'
import Adsr from './components/Adsr'
import Synte from './components/Synte'
import { SyntheModel } from './components/SyntheModel'
import { CommandBoard } from './components/CommandBoard'

function Scene() {
  const setCameraControlEnabled = (enabled:boolean)=>{
    if(cameraControlRef.current){
      cameraControlRef.current.mouseButtons.left = enabled?1:0;
    }
  }
  const cameraControlRef = useRef<CameraControls>(null);
  const { performance } = useControls('Monitoring', {
    performance: false,
  })
  const handleClick = ()=>{
    setCameraControlEnabled(true)
  }
  useEffect(()=>{
    window.addEventListener('click',handleClick)
    return ()=>{
      window.removeEventListener("click",handleClick)
    }
  },[])

  return (
    <>
      {performance && <Perf position='top-left' />}
      <Environment preset="city" />
      <Grid position={[0, -0.01, 0]} args={[10.5, 10.5]} 
          cellSize= { 0.6}
          cellThickness= { 1 }
          cellColor = {'#6f6f6f'}
          sectionSize = {  3.3}
          sectionThickness = {1.5}
          sectionColor = {'#9d4b4b'}
          fadeDistance = { 25}
          fadeStrength = {1}
          followCamera = {false}
          infiniteGrid = {true}  />
      
      <CameraControls infinityDolly={false} ref={cameraControlRef}  makeDefault />
      <directionalLight
        position={[-2, 2, 3]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024 * 2, 1024 * 2]}
      />
      <ambientLight intensity={0.2} />

        <Synte position={[0,1.5,0]}
          onPointerDown={()=>setCameraControlEnabled(false)}
          // onPointerMissed={()=>setCameraControlEnabled(true)}
          // onPoi
        />


    </>
  )
}

export { Scene }
