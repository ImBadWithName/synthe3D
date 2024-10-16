import { IAudioContext, IAudioNode, IGainNode, IOscillatorNode } from "standardized-audio-context"

export type Adsr ={
    attack : number
    decay : number
    sustain :number
    release : number
}
export default class Osc {
    actx : IAudioContext
    envelope : Adsr
    osc : IOscillatorNode<IAudioContext>
    easing: number
    gateGain:IGainNode<IAudioContext>
    constructor(actx:IAudioContext,type:OscillatorType,frequency:number,detune:number,envelope:Adsr|null,connection:IAudioNode<IAudioContext>){
        this.actx = actx;
        this.envelope =envelope ||{
            attack : 0.005,
            decay :0.1,
            sustain:0.6,
            release:0
        }
        this.osc = actx.createOscillator();
        this.osc.frequency.value = frequency;
        this.osc.detune.value = detune;
        this.osc.type = type;
        this.gateGain = actx.createGain();
        this.gateGain.gain.value=0
        this.osc.connect(this.gateGain);
        this.gateGain.connect(connection)
        this.easing = 0.03;
        this.osc.start()
        this.start();
    }
    start(){
        
        let {currentTime} = this.actx;
        this.gateGain.gain.cancelScheduledValues(currentTime)
        this.gateGain.gain.setValueAtTime(0,currentTime+this.easing);
        // this.gateGain.gain.linearRampToValueAtTime(0,currentTime+this.easing); //sounds dumb but don't remove, I'm dead serious, this shit will break on firefox if you do
        this.gateGain.gain.linearRampToValueAtTime(1,currentTime+this.envelope.attack+this.easing)
        this.gateGain.gain.linearRampToValueAtTime(this.envelope.sustain,currentTime+this.envelope.attack+this.envelope.decay+this.easing)
    }
    stop(){
        let {currentTime} = this.actx;
        // this.gateGain.gain.cancelScheduledValues(currentTime)

        // this.gateGain.gain.setTargetAtTime(value,currentTime,0);
          this.gateGain.gain.cancelAndHoldAtTime(currentTime)
         this.gateGain.gain.setTargetAtTime(0,currentTime+this.easing,this.envelope.release+this.easing)
        setTimeout(()=>this.osc.disconnect(),10000)
    }
}