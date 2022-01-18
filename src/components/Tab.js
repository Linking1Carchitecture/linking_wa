import styles from '../assets/styles/Landing.module.css';

import React, { useEffect, useState } from 'react';

import { start } from '../utils/Devices';

export default function Tab(props){   
    
    // const [settings, setSettings] = useState({
    //     config_id: null, user_email: null, in_video: null,
    //     background_id: null, in_audio: null, out_audio: null
    // })

    useEffect(() => {
         start().then(() => {
        //     let audioInputSelect = document.querySelector('select#audioSource');
        //     let audioOutputSelect = document.querySelector('select#audioOutput');
        //     let videoSelect = document.querySelector('select#videoSource');
        //     // if(audioInputSelect) audioInputSelect.value = props
        //     console.log("HOLA ", props.userSettings.in_audio)
        //     GetDevice(props.userSettings.in_audio)
        });
        // console.log("HOLA ", props.userSettings)
        // GetDevice(props.userSettings.in_video)
    
    }, [props]);

    
    if(props.tab === "audio"){
        
        return(
            <div >
                <div className="select">
                    <label htmlFor="audioSource">Microfono: </label><select id="audioSource" style={{maxWidth:'95%', marginLeft: '10px'}}></select>
                </div>
                {/* <button onClick={recordAudio}>Grabar</button> */}
                <div className="select" style={{marginTop:'20px'}}>
                    <label htmlFor="audioOutput">Altavoces: </label><select id="audioOutput" style={{maxWidth:'95%', marginLeft: '10px'}}></select>
                    <audio id="audioTest"></audio>
                </div>
                {/* <button onClick={audio}>Escuchar</button> */}
                
            </div>
        );
    }else{
        return(
            <div>
                <div className="select">
                    <label htmlFor="videoSource">Camara: </label><select id="videoSource" style={{maxWidth:'95%', marginLeft: '10px'}}></select>
                </div>
                <video id="myVideo" style={{marginTop: '10px'}} className={styles.myVideo} playsInline autoPlay></video>
            </div>
        );
    }
         
}

export function stopVideo(){   
    // console.log("Stopping Video...")
    const video = document.querySelector("#myVideo");
    if(video){
        video.pause();
        video.src = "";
        window.stream.getTracks().forEach(track => {if(track.kind==="video") track.stop()})
    }         
}

export async function recordAudio(){

    let audioSource;
    const audioInput = document.querySelector('select#audioSource');
    if(audioInput){
        audioSource = audioInput.value;
    }

    let device = navigator.mediaDevices.getUserMedia({ audio: {deviceId: audioSource } });
    const audioChunks = [];

    device.then(stream => {
        let recorder = new MediaRecorder(stream);
        recorder.ondataavailable = e => {
            audioChunks.push(e.data)
            // if(recorder.state === 'inactive'){
            let blob = new Blob(audioChunks, {type: 'audio/webm'});
            let audio = document.getElementById("audioTest")
            audio.innerHTML = '<source src="'+ URL.createObjectURL(blob)+'" type="video/webm"/>';
            // }
        }
        recorder.start();
        setTimeout(() => {
            recorder.stop();
          }, 5000);
    });

}

export async function playAudio(audio){
    audio.play();
}

export function GetDevice(id, ki){
    navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
      devices.forEach(function(device) {
  
        if(device.deviceId === id){
            console.log(device.kind + ": " + device.label !== undefined ? device.label : 'Default');
        }
      });
    })
    .catch(function(err) {
      console.log(err.name + ": " + err.message);
    });
  }

