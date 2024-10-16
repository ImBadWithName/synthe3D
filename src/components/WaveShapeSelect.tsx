import React, { ComponentProps, useContext } from 'react'
import BoutonPress from './BoutonPress'
import { CTX } from '../context/Store'
import { BufferGeometry, Mesh } from 'three'
import { useTexture } from '@react-three/drei'

type Props = ComponentProps<"group">&{
    geometry?:BufferGeometry
    materials:any
    gap?:number
    onChange?:(e:OscillatorType)=>void
    value?:OscillatorType
}

const WaveShapeSelect = (props: Props) => {
    // const [appState,updateState]=useContext(CTX)
    const waveShape = props.value
    // const textures = useTexture({
    //     sawtooth:"/Textures/Sawtooth wave.png",
    //     sine:"/Textures/Sin wave.png",
    //     square:"/Textures/Square wave.png",
    //     triangle:"/Textures/Triangle wave.png"})
    const types:OscillatorType[]=["sine","sawtooth","square","triangle"]
    const gap = props.gap||0.2
  return (
    <group {...props}>
        {types.map((item,index)=>(
            <BoutonPress 
                position-z={-(types.length-1)*gap/2+gap*index} 
                onChange={ (e)=>props.onChange &&props.onChange(item)} 
                
                key={item}
                value = {waveShape===item}
                canChange= {waveShape!==item}
                pressIntensity={0.35}
            >
                <mesh
                    name="SawTooth"
                    castShadow
                    receiveShadow
                    geometry={props.geometry}

                >
                <meshStandardMaterial 
                 {...props.materials[item]} 

                    emissive={"yellow"} 
                    emissiveIntensity={waveShape===item?2:0} 
                    emissiveMap={props.materials[item].map}
                />
                </mesh>
            </BoutonPress>
        ))}

    </group>
  )
}

export default WaveShapeSelect