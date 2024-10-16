import React, { ComponentProps, useContext, useMemo, useRef, useState } from 'react'
import { CanvasTexture, Mesh, PlaneGeometry } from 'three'
import { CTX } from '../context/Store'
import { useFrame } from '@react-three/fiber'
import tinycolor from 'tinycolor2'

type Props = ComponentProps<"group">&{
  screenType?:"onde"|"freq"
}

const Screen = (props: Props) => {
  // const [mode,setMode] = useState<"onde"|"freq">(props.screenType||"onde")
  const squareSize = 50
  const backgroundColor = tinycolor("#42160B").setAlpha(0.2)
  const primeryColor = tinycolor("white")
  const secondaryColor = tinycolor("white").setAlpha(0.08)

  const {canvas,ctx} = useMemo(()=>{
    const canvas = document.createElement("canvas")
    canvas.width = 300
    canvas.height = 300
    const ctx = canvas.getContext("2d")
    return {canvas,ctx}
  },[])
  const clean = ()=>{
    if(ctx){
      ctx.fillStyle = backgroundColor.toRgbString()
      ctx.fillRect(0,0,canvas.width,canvas.height)
      ctx.strokeStyle = secondaryColor.toRgbString();
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < canvas.width/squareSize; i++) {
        const x = canvas.width/2+i*squareSize -(Math.floor(canvas.width/squareSize)*squareSize)/2
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let i = 0; i < canvas.height/squareSize; i++) {
        const y = canvas.height/2+i*squareSize -(Math.floor(canvas.height/squareSize)*squareSize)/2
        ctx.moveTo(0, y);
        ctx.lineTo( canvas.width,y);
      }
      ctx.stroke()
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(canvas.width/2, 0);
      ctx.lineTo( canvas.width/2,canvas.height);
      ctx.moveTo(0,canvas.height/2);
      ctx.lineTo( canvas.width,canvas.height/2);
      ctx.stroke()
    }
  }

  clean()
  const texture = new CanvasTexture(canvas)
  const [appState,updateState]=useContext(CTX)
  const analyser:AnalyserNode = appState.analyser
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount/2;
  const dataArray = new Uint8Array(bufferLength);

const drawOnde = ()=>{
  if(ctx){
    analyser.getByteTimeDomainData(dataArray);
    ctx.lineWidth = 2;
    ctx.strokeStyle = primeryColor;
    ctx.beginPath();
    const sliceWidth = canvas.width / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = v * (canvas.height / 2);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }
  }
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke()
}
const drawFreq = ()=>{
  if(ctx){
    clean()
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    analyser.getByteFrequencyData(dataArray);
    
    const barWidth = (canvas.width / (bufferLength)) * 2.5;
    let barHeight;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] ;

      ctx.fillStyle = tinycolor.mix( primeryColor,backgroundColor, 60-Math.min(dataArray[i]*0.2,50)).toRgbString();
      ctx.fillRect(x, canvas.height/2 - barHeight / 2, barWidth, barHeight);
    
      x += barWidth + 1;
    }
    
  }
}
  useFrame(()=>{
    if(ctx){
      clean()
     if(props.screenType==="freq"){
        drawFreq()
      }
      else{
        drawOnde()
      }
      texture.needsUpdate =true
      // ref.current.up
      
    }
  })
  return (
    // <group {...props}>
    //   <mesh ref={ref} >
    //       <planeGeometry/>
          <meshStandardMaterial map={texture} emissive={primeryColor.toHexString()} emissiveIntensity={0.5} emissiveMap={texture}/>
    //   </mesh>
    // </group>
    
  )
}

export default Screen