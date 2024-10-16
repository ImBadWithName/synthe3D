import React, { ComponentProps, useContext, useEffect } from 'react'
import { CTX } from '../context/Store'
import Key from './Key'
import tinycolor from 'tinycolor2'

type Props = ComponentProps<"group">&{
    sizeWhiteKey? : number
    sizeBlackKey? : number
    startingFrequency?:number
}

const KeyBoard = (props: Props) => {
    const sizeBlackKey = props.sizeBlackKey || 0.4
    const sizeWhitekKey = props.sizeWhiteKey || 0.4
    const startingFrequency = props.startingFrequency || 420
    // const handleKeyDown=(e:KeyboardEvent)=>{
    //     console.log(e.code)
    // }
    // useEffect(()=>{
    //     window.addEventListener('keydown',(e)=>handleKeyDown(e))
  
    //     return ()=>{
    //         window.removeEventListener('keydown',(e)=>handleKeyDown(e))
    //     }
    // },[])

    const colors ={white:["#3D9FE3","#7B3DE3"],black:["#000000","#303030"]}
    const blackkeysCodes = ["Digit1","Digit2","Digit3","Digit4","Digit5","Digit6","Digit7","Digit8","Digit9","Digit0","Minus","Equal","Backspace"]
    const whitekeysCodes = ["Tab","KeyQ","KeyW","KeyE","KeyR","KeyT","KeyY","KeyU","KeyI","KeyO","KeyP","BracketLeft","BracketRight","Backslash"]    
    const generateOctave= (a:number)=>{
        const noteOrder = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B","C1","C1#","D1","D1#","E1","F1","F1#","G1","G1#","A1","A1#","B1"]
        const octave =  noteOrder.map((item,index)=>{
            return {
                freq : a*(2**((index-noteOrder.length+3)/12)),
                name: item,
                white: !item.endsWith("#"),
            } 
        })
        return octave
    }
    const computeLength = (e:{white:boolean}[])=>{
        
        return e.reduce((prev,curr)=>curr.white?prev+sizeWhitekKey*2:prev,0)
    }
    const octave = generateOctave(startingFrequency)
    const getType =(index:number)=>{
        const note = octave[index]
        const prev = !(octave[index-1]?.white ===false)
        const next = !(octave[index+1]?.white ===false)
        if(!note.white) return "Black"
        // if((octave[index-1] ==undefined || octave[index-1].white)&& (octave[index+1] ==undefined || octave[index+1].white) )
        if(prev && next) return "Full"
        if(!prev && next) return "InvertedL"
        if(prev && !next) return "L"
        if(!prev && !next) return "T"
    }
  return (
    <group {...props}>
         {octave.map((e,index)=>
          <Key
            
            pressedColor={
                e.white?
                    tinycolor.mix(colors.white[0],colors.white[1],(100/octave.length)*index).toHexString():
                    tinycolor.mix(colors.black[0],colors.black[1],(100/octave.length)*index).toHexString()
            
            }
            hoveredColor={
                e.white?
                    tinycolor.mix(colors.white[0],colors.white[1],(100/octave.length)*index).lighten(15).toHexString():
                    tinycolor.mix(colors.black[0],colors.black[1],(100/octave.length)*index).lighten(15).toHexString()
            }
            baseColor={
                e.white?
                    'white':
                    'black'
            }
            key={index} 
            name={e.name}
            // position-z={e.white?0:-1}
            position-x={(-computeLength(octave)/2)+computeLength(octave.slice(0,index))-(e.white?0:sizeBlackKey)+sizeWhitekKey} 
            position-y={e.white?0:0.1} 

            // scale-x={e.white?sizeWhitekKey:sizeBlackKey}
            scale={[e.white?sizeWhitekKey:sizeBlackKey,0.2,1]}
            frequency={e.freq} 
            //  button={'Key'+keysCodes[index].toLocaleUpperCase()}
            type={getType(index)}
            button={e.white?
                whitekeysCodes[octave.slice(0,index).reduce((sum,elm)=>sum+=elm.white?1:0,0)] ||undefined
                :
                blackkeysCodes[octave.slice(0,index).reduce((sum,elm)=>sum+=elm.white?1:0,0)-1] ||undefined
            }
            />
            )} 
    </group>
  )
}

export default KeyBoard