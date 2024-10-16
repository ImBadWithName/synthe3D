import React from "react";
import Osc from "./Osc";
import {Adsr} from "./Osc"
import { AudioContext  as AC}  from 'standardized-audio-context';

const actx = new AC()
const out = actx.destination
const osc1 = actx.createOscillator();
const gain1 = actx.createGain()
const lowPass = actx.createBiquadFilter();
lowPass.frequency.value = 30000
const highPass = actx.createBiquadFilter();
const analyser = actx.createAnalyser();
const lfo = actx.createOscillator();
const lfoAnalyser = actx.createAnalyser();
lfo.connect(lfoAnalyser)
const lfoGain = actx.createGain();
lfoAnalyser.connect(lfoGain)
lfo.frequency.value=1;
lfoGain.gain.value = 1000
// lfoGain.connect(gain1.gain)
lfo.start()
analyser.connect(out)

osc1.connect(gain1)
gain1.gain.value = 0.5
gain1.connect(lowPass)

lowPass.frequency.value=20000
highPass.frequency.value=0
lowPass.type="lowpass"
highPass.type = "highpass"
// lowPass.connect(analyser)
lowPass.connect(highPass)
highPass.connect(analyser)

const CTX = React.createContext<any>(null);
let nodes:{note:string,osc:Osc}[] = [];
export{CTX}
export function reducer (state:any,action:any){
    let {id,value,note,freq,filter} = action.payload||{}
    switch(action.type){
        case "MAKE_OSC":
            // console.log(state.envelope)
            let newOsc:Osc = new Osc(
                actx,
                state.generalSettings.type,
                freq,state.generalSettings.detune,
                state.envelope,
                gain1
            )
            if(state.lfo.destination ==="detune"){
                lfoGain.connect(newOsc.osc.detune)
            }
            
            nodes.push({note:note,osc:newOsc})
            return {...state}
        case "KILL_OSC":
            let newNode:{osc:Osc,note:string}[] = [];
            
            nodes.forEach(node=>{
                const osc =  node.osc
                if(node.note===note){
                    osc.stop();
                }
                else(
                    newNode.push(node)
                )
            })
            nodes = newNode
            return {...state}
        case 'CHANGE_LFO_SETTINGS':
            // console.log(value)
                if(["frequency"].includes(id)){
                    //@ts-ignore
                    lfo[id].value = value
                  }
                  if(id ==="type"){
                    // console.log(id)
                    
                    lfo.type = value as OscillatorType
                  }
                  if(id==="gain"){
                    lfoGain.gain.value = value
                  }
                  if(id==="destination"){
                    lfoGain.disconnect()
                    switch(value){
                        case "none":
                            break;
                        case "lowpass":
                            lfoGain.connect(lowPass.detune)
                            break;
                        case "gain":
                            lfoGain.connect(gain1.gain)
                            break;
                        case "detune":
                            nodes.forEach(e=>{
                                lfoGain.connect(e.osc.osc.detune)
                            })
                    }

                  }
                return{...state,lfo:{...state.lfo,[id]:value}};
        case "START_OSC":
            osc1.start()
            return {...state}
        case "CHANGE_ADSR":
            return{...state,envelope:{...state.envelope,[id]:value}}
        case "STOP_OSC":
            osc1.stop()
            return {...state}
        default :
            console.log('reducer error. action :',action);
            return{...state};
        case 'CHANGE_GENERAL_SETTINGS':
            if(["frequency","detune"].includes(id)){
                //@ts-ignore
                osc1[id].value = value
              }
              if(id ==="type"){
                // console.log(id)
                osc1.type = value as OscillatorType
              }
            return{...state,generalSettings:{...state.generalSettings,[id]:value}};
        case 'CHANGE_FILTER':

                if(filter ==="lowPass"){//@ts-ignore
                    lowPass[id].value = value
                }
                if(filter ==="highPass"){//@ts-ignore
                    highPass[id].value = value
                }
                //   console.log(state.filter.lowPass)
                
              
            return{...state,filterSettings:{...state.filterSettings,[filter]:{...state.filterSettings[filter],[id]:value}}};
    }
}
type StoreProps ={
    children: JSX.Element
}
export default function Store(props:StoreProps){
    const stateHook = React.useReducer(reducer,{
        lfo:{
            frequency:lfo.frequency,
            type:lfo.type,
            // detune:lfo.detune,
            gain:lfoGain.gain.value,
            node:lfoAnalyser,
            destination:"none"
        },
        generalSettings : {
            frequency:440,
            detune:osc1.detune.value,
            type:osc1.type
        },
        filterSettings:{
            lowPass:{
                frequency:lowPass.frequency.value,
                Q : lowPass.Q.value,
            },
            highPass:{
                frequency:highPass.frequency.value,
                Q : highPass.Q.value,
            },
            // detune:filter.detune.value,
            // gain : filter.gain.value
        },
        envelope:{
            attack : 0.005,
            decay :0.1,
            sustain:0.6,
            release:0
        },
        analyser:analyser

    })
    return <CTX.Provider value={stateHook}>{props.children}</CTX.Provider>
}
