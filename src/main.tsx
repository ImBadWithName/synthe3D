import { act, Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'
import { Scene } from './Scene'
import './styles/main.css'
import Osc1 from './components/Osc1'
import Filter from './components/Filter'
import Store, { CTX } from './context/Store'
import Key from './components/Key'
import Adsr from './components/Adsr'


export type fltSet ={
  frequency:number,
  detune:number,
  type:BiquadFilterType,
  Q : number,
  gain : number
}
function Main() {
  const startingFrequency = 65.41;
  const keys =  Array(8).fill(0).map((item,index)=>startingFrequency+(startingFrequency/7)*index)

  const [appState,updateState]=useContext(CTX)
  return (
    <div className='main'>
      

        
        <a href='https://github.com/ImBadWithName/synthe3D' className='github'>
          <img  src='/Images/github-mark-white.png'/>
        </a>

      <a className="portfolio" href='https://francois.crouy-chanel.fr'>francois.crouy-chanel.fr</a>
     <Leva
      hidden
        collapsed={false}
        oneLineLabels={false}
        flat={true}
        theme={{
          sizes: {
            titleBarHeight: '28px',
          },
          fontSizes: {
            root: '10px',
          },
        }}
      />
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: ACESFilmicToneMapping,
          outputColorSpace: SRGBColorSpace,
        }}
        camera={{
          fov: 55,
          near: 0.1,
          far: 200,
          position: [3, 2, 9],
        }}
        shadows
      >
        <Scene />
      </Canvas>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
 
    <Store>
      <Main/>
    </Store>

)
