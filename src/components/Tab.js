import styles from '../assets/styles/Landing.module.css';

import React, { useEffect, useState } from 'react';

import { start } from '../utils/Devices';

export default function Tab(props){   
    
    useEffect(() => {
        start()
    }, []);

    if(props.tab === "audio"){

        return(
            <div>
                <div className="select">
                    <label htmlFor="audioSource">Microfono: </label><select id="audioSource"></select>
                </div>
                <button onClick={recordAudio}>Grabar</button>
                <div className="select">
                    <label htmlFor="audioOutput">Altavoces: </label><select id="audioOutput"></select>
                </div>
                {/* <button onClick={audio}>Escuchar</button> */}
                <audio id="audioTest" controls></audio>
            </div>
        );
    }else{
        return(
            <div>
                <div className="select">
                    <label htmlFor="videoSource">Camara: </label><select id="videoSource"></select>
                </div>
                <video id="myVideo" className={styles.myVideo} playsInline autoPlay></video>
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