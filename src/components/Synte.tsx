import React, { Component, ComponentProps, useContext, useState } from 'react'
import Key from './Key'
import Adsr from './Adsr'
import tinycolor from 'tinycolor2'
import { CTX } from '../context/Store'
import Slider from './Slider'
import BoutonPress from './BoutonPress'
import WaveShapeSelect from './WaveShapeSelect'
import KeyBoard from './KeyBoard'
import Screen from './Screen'
import Switch from './Switch'
import Pignon from './Pignon'
import LFOLed from './LFOLed'
import { SyntheModel } from './SyntheModel'
import { CommandBoard } from './CommandBoard'

type Props = ComponentProps<"group">&{}

const Synte = (props: Props) => {

    const [appState,updateState]=useContext(CTX)
    const [screenType, setScreenType] = useState<"onde"|"freq">("onde")
  return (
    <group {...props}>
        <group scale={3} position={[0,1,-4]}>
        <KeyBoard startingFrequency={appState.generalSettings.frequency} scale={[0.24,0.3,0.4]}  position={[0,-0.5,1]}/>
          <SyntheModel />
          <CommandBoard/>
        </group>
        
        {/* <Adsr rotation-x={Math.PI/4} position-x={5}/> */}
        {/* <Screen screenType={screenType} position={[0,2,-2]} scale={3} /> */}
        {/* <Slider rotation-x={Math.PI/4} position-x={-5} 
            min={60}
            max={40000}
            logarythm
            value={appState.generalSettings.frequency}
            onChange={(e)=>{
                 updateState({type:"CHANGE_GENERAL_SETTINGS",payload:{id:"frequency",value:e}})
            }} 
        /> */}
        {/* <Slider logarythm rotation-x={Math.PI/4} position-x={-5.5} 
            min={10}
            max={30000}
            value={appState.filterSettings.lowPass.frequency}
            onChange={(e)=>{
                updateState({type:"CHANGE_FILTER",payload:{id:"frequency",value:e,filter:"lowPass"}})
            }} 
        /> */}
                {/* <Slider logarythm rotation-x={Math.PI/4} position-x={-6} 
            min={0.1}
            max={20000}
            value={appState.filterSettings.hightPass.frequency}
            onChange={(e)=>{
                updateState({type:"CHANGE_FILTER",payload:{id:"frequency",value:e,filter:"hightPass"}})
            }} 
        /> */}
        {/* <Switch onChange={(value)=>setScreenType(value?"freq":"onde")} position={[0,5,-2]} amplitude={2}>
            <mesh>
                <boxGeometry/>
                <meshStandardMaterial/>
            </mesh>
        </Switch> */}
        {/* <WaveShapeSelect
            position-z={2} 
        /> */}
        {/* <Slider onChange={(e)=>{
            const values =["none","lowpass","gain","detune"]
            updateState({type:"CHANGE_LFO_SETTINGS",payload:{id:"destination",value:values[e]||"none"}})
        }} position={[0,0,3.5]} min={0} max={3} permitedValues={[0,1,2,3]} rotation-y={Math.PI/2}/> */}
        {/* <Pignon position={[-0.5,0,3]} scale={1} min={0.1} max={15}
            onChange={(e)=>{updateState({type:"CHANGE_LFO_SETTINGS",payload:{id:"frequency",value:e}})}}
        /> */}
        {/* <Pignon position={[0.5,0,3]} scale={1} min={0} max={3000} valuePerTurn={3000}
            onChange={(e)=>{updateState({type:"CHANGE_LFO_SETTINGS",payload:{id:"gain",value:e}})}}
        /> */}
        {/* <Pignon position={[1,0,3]} scale={1} min={5} max={10} valuePerTurn={2.5} onChange={(value)=>{console.log(value)}} /> */}
        {/* <mesh position={[-4,3,0]}>
                <boxGeometry/>
                <LFOLed/>
        </mesh> */}
    </group>
  )
}

export default Synte