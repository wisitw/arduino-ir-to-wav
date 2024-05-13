let fs = require("fs");
const WavEncoder = require("wav-encoder");
const data = require("./data.js");

const sampleRate = 44100;
const usec_sample = (1 / sampleRate) * 1000000;
const halfperiod = (1 / 38000) * 1000000 * 2;

function transformArray(inputArray) {
  const outputArray = [];

  // Set the first two elements to 9000
  outputArray.push(9000);

  // Set the next element to 4500
  outputArray.push(4500);

  // Convert other elements to the nearest multiple of 563
  for (let i = 2; i < inputArray.length - 1; i++) {
    const nearestMultiple = Math.round(inputArray[i] / 563) * 563;
    outputArray.push(nearestMultiple);
  }

  // Set the last element to 3000
  outputArray.push(3000);

  return outputArray;
}

const s_gen = (us, isSpace = true) => {
  // console.log("gen",isSpace?"LOW":"HIGH","for",us,"uSec");
  const out = [];
  for (var i = 0; i < us; i += usec_sample) {
    if (isSpace) {
      out.push(0);
    } else {
      out.push(Math.sin(((i % halfperiod) / halfperiod) * 6.283));
    }
  }
  out.push(0);
  return out;
};
data.forEach((raw, i) => {
  const form = transformArray(raw);
  console.log(form);
  const soundAmp = [];
  form.forEach((value, idx) => {
    soundAmp.push(...s_gen(value, idx & 1));
  });
  form.forEach((value, idx) => {
    soundAmp.push(...s_gen(value, idx & 1));
  });
  form.forEach((value, idx) => {
    soundAmp.push(...s_gen(value, idx & 1));
  });
  form.forEach((value, idx) => {
    soundAmp.push(...s_gen(value, idx & 1));
  });
  form.forEach((value, idx) => {
    soundAmp.push(...s_gen(value, idx & 1));
  });
  form.forEach((value, idx) => {
    soundAmp.push(...s_gen(value, idx & 1));
  });

  const whiteNoise1sec = {
    sampleRate: sampleRate,
    channelData: [
      new Float32Array(soundAmp),
      new Float32Array(soundAmp.map((a) => (a === 0 ? 0 : a < 0 ? -a : -a))),
    ],
  };

  WavEncoder.encode(whiteNoise1sec).then((buffer) => {
    fs.writeFileSync("ir_" + (i + 1) + ".wav", Buffer.from(buffer));
    console.log("ir_" + (i + 1) + ".wav written");
  });
});
