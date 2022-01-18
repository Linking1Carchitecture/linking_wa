/*
*  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
*
*  Use of this source code is governed by a BSD-style license
*  that can be found in the LICENSE file in the root of the source
*  tree.
*/

let videoElement = document.querySelector('#myVideo');
let audioElement = document.querySelector('#audioTest');
let audioInputSelect = document.querySelector('select#audioSource');
let audioOutputSelect = document.querySelector('select#audioOutput');
let videoSelect = document.querySelector('select#videoSource');
let selectors = [audioInputSelect, audioOutputSelect, videoSelect];
let outputDevice;

if(audioOutputSelect)  audioOutputSelect.disabled = !('sinkId' in HTMLMediaElement.prototype);

export function gotDevices(deviceInfos) {
  // Handles being called several times to update labels. Preserve values.
  // console.log("selectors: ", selectors)
  // console.log("deviceInfos: ", deviceInfos)
  const values = selectors.map(select => select.value);
  selectors.forEach(select => {
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
  });
  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    const option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'audioinput') {
      if(audioInputSelect){
        option.text = deviceInfo.label || `microphone ${audioInputSelect.length + 1}`;
        audioInputSelect.appendChild(option);
      }
    } else if (deviceInfo.kind === 'audiooutput') {
      if(audioOutputSelect){
        option.text = deviceInfo.label || `speaker ${audioOutputSelect.length + 1}`;
        audioOutputSelect.appendChild(option);
      }
    } else if (deviceInfo.kind === 'videoinput') {
      if(videoSelect){
        option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
        videoSelect.appendChild(option);
      }
    } else {
      console.log('Some other kind of source/device: ', deviceInfo);
    }
  }
  selectors.forEach((select, selectorIndex) => {
    if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
      select.value = values[selectorIndex];
    }
  });
}

navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

// Attach audio output device to video element using device/sink ID.
export function attachSinkId(element, sinkId) {
  audioOutputSelect = document.querySelector('select#audioOutput');
  if(element){
    if (typeof element.sinkId !== 'undefined') {
      element.setSinkId(sinkId)
          .then(() => {
            console.log(`Success, audio output device attached: ${sinkId}`);
            outputDevice = sinkId;
          })
          .catch(error => {
            let errorMessage = error;
            if (error.name === 'SecurityError') {
              errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
            }
            console.error(errorMessage);
            // Jump back to first output device in the list as it's the default.
            audioOutputSelect.selectedIndex = 0;
          });
          return sinkId;
    } else {
      console.warn('Browser does not support output device selection.');
    }
  }
}

export function changeAudioDestination() {
  const audioDestination = audioOutputSelect.value;
  videoElement = document.querySelector('#myVideo');
  audioElement = document.querySelector('#audioTest');
  if(videoElement) attachSinkId(videoElement, audioDestination);
  if(audioElement) attachSinkId(audioElement, audioDestination);
}

export function gotStream(stream) {
  window.stream = stream; // make stream available to console
  if(videoElement) videoElement.srcObject = stream;
  // Refresh button list in case labels have become available
  return navigator.mediaDevices.enumerateDevices();
}

export function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

export async function start() {
  
  if (window.stream) {
    window.stream.getTracks().forEach(track => {
      track.stop();
    });
  }

  let audioSource, videoSource;
  videoElement = document.querySelector('#myVideo');
  audioInputSelect = document.querySelector('select#audioSource');
  audioOutputSelect = document.querySelector('select#audioOutput');
  videoSelect = document.querySelector('select#videoSource');
  
  let constraints = { };

  if(audioInputSelect){
    audioSource = audioInputSelect.value;
    selectors = [audioInputSelect, audioOutputSelect];
    console.log("Audio :)")
    constraints['audio'] = {deviceId: audioSource ? {exact: audioSource} : undefined}
  }

  if(audioOutputSelect)  audioOutputSelect.disabled = !('sinkId' in HTMLMediaElement.prototype);

  if(videoSelect){
    videoSource = videoSelect.value;
    selectors = [videoSelect];
    console.log("Video :)")
    constraints['video'] = {deviceId: videoSource ? {exact: videoSource} : undefined}
  }
  
  console.log("constraints", constraints)
  if(audioInputSelect){
    // audioInputSelect.onchange = start;
    audioInputSelect.addEventListener(
      'change',
      function() { start().then((result)=>{
        sessionStorage.setItem('settings', JSON.stringify(result))
      })},
      false
   );
  }
  if(audioOutputSelect){
    // audioInputSelect.onchange = start;
    audioOutputSelect.addEventListener(
      'change',
      function() { changeAudioDestination(); start().then((result)=>{
        sessionStorage.setItem('settings', JSON.stringify(result))
      })},
      false
   );
  }
  if(videoSelect){
    // audioInputSelect.onchange = start;
    videoSelect.addEventListener(
      'change',
      function() { start().then((result)=>{
        sessionStorage.setItem('settings', JSON.stringify(result))
      })},
      false
   );
  }

  await navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleError);

  return [constraints, outputDevice];
}