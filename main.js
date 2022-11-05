let fs = require('fs');
const WavEncoder = require("wav-encoder");
const data = require('./data.js');

const sampleRate = 44100
const usec_sample = 1/sampleRate*1000000;
const halfperiod = 1/(38000)*1000000*2;

const s_gen = (us, isSpace = true) => {
  // console.log("gen",isSpace?"LOW":"HIGH","for",us,"uSec");
  const out = [];
  for(var i = 0; i<us;i+=usec_sample) {
    if(isSpace) {
      out.push(0);
    } else {
      out.push(Math.sin((i%halfperiod)/halfperiod*6.283));
    }
  }
  out.push(0);
  return out;
}
data.forEach((raw, i) => {

  const soundAmp = [];
  raw.forEach((value,idx) => {
    soundAmp.push(...s_gen(value,idx & 1));
  })
 
  const whiteNoise1sec = {
    sampleRate: sampleRate,
    channelData: [
      new Float32Array(soundAmp),
      new Float32Array(soundAmp.map(a => a===0?0:a<0?-a:-a ))
    ]
  };
   
  WavEncoder.encode(whiteNoise1sec).then((buffer) => {
    fs.writeFileSync("ir_"+(i+1)+".wav", Buffer.from(buffer));
    console.log("ir_"+(i+1)+".wav written");
  });

})