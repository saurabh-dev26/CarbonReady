const fs = require('fs');
const path = require('path');

function createWavBuffer(durationSeconds = 1.5, sampleRate = 16000, freq = 440) {
  const numChannels = 1;
  const bytesPerSample = 2; // 16-bit
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const dataSize = numSamples * numChannels * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF identifier
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20); // AudioFormat PCM = 1
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * bytesPerSample, 28); // byteRate
  buffer.writeUInt16LE(numChannels * bytesPerSample, 32); // blockAlign
  buffer.writeUInt16LE(16, 34); // bitsPerSample

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Modulated carrier tone to represent acoustic speech-like energy
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const modulation = Math.sin(2 * Math.PI * 4 * t); // 4Hz cadence modulation
    const carrier = Math.sin(2 * Math.PI * freq * t);
    const sampleVal = Math.floor(carrier * modulation * 14000);
    buffer.writeInt16LE(sampleVal, 44 + i * 2);
  }

  return buffer;
}

const dir = path.join(__dirname, '..', 'public', 'audio', 'samples');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(path.join(dir, 'shift-en-sample.wav'), createWavBuffer(2.0, 16000, 300));
fs.writeFileSync(path.join(dir, 'shift-hi-sample.wav'), createWavBuffer(2.5, 16000, 260));
fs.writeFileSync(path.join(dir, 'shift-mr-sample.wav'), createWavBuffer(2.2, 16000, 280));

console.log('Successfully generated sample WAV fixtures in public/audio/samples/');

