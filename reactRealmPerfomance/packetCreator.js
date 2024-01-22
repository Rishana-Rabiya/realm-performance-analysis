export const dummyPacketCreator = (channelCount = 1925) => {
  let length = channelCount; // the sample count length
  let dummyconst = 288;

  let random = '';
  for (let k = 0; k < length; k++) {
    random = random + Math.round(Math.random() * 9);
  }

  let buffer = str2ab(random);
  let data = new Uint8Array(buffer);

  let dummyPacket = {
    type: 0,
    ch0Count: dummyconst,
    ch1Count: dummyconst,
    ch0SampleIndex: dummyconst,
    ch1SampleIndex: dummyconst,
    ch0Data: data,
    ch1Data: data,
    isEventPresent: false,
    ch0StartOffSet: dummyconst,
    ch1StartOffSet: dummyconst,
    ch2StartOffSet: dummyconst,
    blockIndex: dummyconst,
    isDiscontinuous: true,
    isEventPresent: false,
    time: 0,
  };
  return dummyPacket;
};

//converts the string to buffer
function str2ab(str) {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

//gives the packet array given the array length and samplelength of each packet
export const getPackets = (insertCount, sampleLength) => {
  let dummyPacket = dummyPacketCreator(sampleLength);

  let returnArray = [];
  for (let m = 0; m < insertCount; m++) {
    returnArray[m] = dummyPacket;
  }

  return returnArray;
};
