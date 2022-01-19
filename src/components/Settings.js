import { Link } from 'react-router-dom';
import styles from '../assets/styles/Landing.module.css';
import { RiCloseFill } from 'react-icons/ri'
import { BiEdit } from 'react-icons/bi'

import React, { useEffect, useState } from 'react';
import config from '../config.json'

import axios from 'axios';

import Tab, {stopVideo} from './Tab';
import { login } from '../pages/Login';

import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function Settings(props){

    const [currentTab, setCurrentTab] = useState('profile');
    const [imageProfile, setImageProfile] = useState();
    const [image, setImage] = useState(null);
    const [srcImg, setSrcImg] = useState(null);
    const [crop, setCrop] = useState({aspect: 1, unit: 'px', x:10, y:10, width: 100, height: 100});
    const [userToken, setUserToken] = useState()
    const [userInfo, setUserInfo] = useState({
        username: null, password: null, image: null
    })
    const [saved, setSaved] = useState(false);
    const [userSettings, setUserSettings] = useState({
        config_id: null, user_email: null, in_video: null,
        background_id: null, in_audio: null, out_audio: null
    })

    const help = document.getElementById('settingsHelp')

    useEffect(() => {
        if(props.userImage && !imageProfile){
            setImageProfile(`data:image/jpeg;base64,${props.userImage}`)   
        }
        const imageElement = document.getElementById("userImage");
        if(imageElement && imageProfile){
            imageElement.innerHTML = `<img src='${imageProfile}' alt='Imagen'/>`;
        }
        const token = localStorage.getItem("userToken");
        if (token) {
          setUserToken(token);
          if(props.user.email){
            getUserSettings(props.user.email).then((result) => {
                setUserSettings(result.data.data.userConfig)
            })
          }
        }

        const getCroppedImg = async () => {
            try {
                const canvas = document.createElement("canvas");
                const scaleX = image.naturalWidth / image.width;
                const scaleY = image.naturalHeight / image.height;
                canvas.width = crop.width;
                canvas.height = crop.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(
                    image,
                    crop.x * scaleX,
                    crop.y * scaleY,
                    crop.width * scaleX,
                    crop.height * scaleY,
                    0,
                    0,
                    crop.width,
                    crop.height
                );
                setImageProfile(canvas.toDataURL());   
                setUserInfo({image: canvas.toDataURL()})
                setSaved(false)
                // console.log(imageProfile);
            } catch (e) {
                // console.log("crop the image");
            }
        };

        if(crop){
            getCroppedImg();
        }

       
        // console.log("User Settings from settings: ", userSettings)
                
    }, [props, imageProfile, crop, image]);

    if(!props.user.username){
        return null; 
    }

    function closeModal(){
        props.showModal()
        try{
            stopVideo();
        }catch{}
        if(saved){
            window.location.reload(false)
        }
    }

    function toTitleCase(str) {
        return str.replace(
          /\w\S*/g,
          function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          }
        );
    }

    const handleImage = async (event) => {
        let element =  document.getElementById("userImage")
        if(element) element.remove()
        setSrcImg(URL.createObjectURL(event.target.files[0]));
        // console.log(event.target.files[0]);
    };

    function changeTab(tab){
        // console.log("Changing tab")
        // if(!saved){
        //     if (help) help.innerHTML = "<div class='mt-4 mb-1'>No has guardado los ultimos cambios</div>"
        // }else{
            setCurrentTab(tab)
            stopVideo()
        // }
    }

    function saveSettings(){
        // TODO: Update userSettings values on attribute update
        // TODO: Change password functionality
        
        if(currentTab === "profile"){
            // getCroppedImg()
            // let inputElement = document.querySelector("#password span input");
            // if(inputElement){
            //     console.log("Trying logging! ", props.user.email," ", inputElement.value)
            //     login({email:props.user.email, password: inputElement.value}).then((result) => {
            //         const response = result.data.data
            //         const errors = result.data.errors
            //         if(errors){
            //         errors.forEach((error) => {
            //             console.log("ERROR!", error)
            //         })
            //         }
                
            //         if(response != null){
            //             const newPasswordInput = document.getElementById("newPassword");
            //             const confirmNewPasswordInput = document.getElementById("confirmNewPassword");
            //             if(newPasswordInput.value === confirmNewPasswordInput.value && newPasswordInput.value.trim() !== ""){
            //                 setUserInfo({password: newPasswordInput.value})
            //                 console.log("New password set!")
            //             }else{
            //                 alert("Confirmación incorrecta")
            //                 throw new Error("Confirmación incorrecta")
            //             }
            //         }else{
            //             alert("Contraseña incorrecta")
            //             throw new Error("Contraseña incorrecta")
            //         }
            //         // console.log(JSON.stringify(response))
            //         // console.log("Code: ",responseCode)
            //     }).then(() => {
            //         console.log("UserInfo: ", userInfo)
            //         updateUser(userInfo, userToken).then((result)=>{
            //             console.log("User data updated!")
            //             console.log(JSON.stringify(result))
            //             setSaved(true)
            //         })
            //     }).catch((error) => {
            //         // alert("ERROR!!!")
            //         console.log(error)
            //     });
            // }else{
            //     updateUser(userInfo, userToken).then((result)=>{
            //         console.log(JSON.stringify(result))
            //     })
            // }
            updateUser(userInfo, userToken).then((result)=>{
                // console.log(JSON.stringify(result))
                alert("Perfil Actualizado!")
                setSaved(true)
            });
        }
        if(currentTab === "audio"){
            console.log("Settings on update: ", userSettings)
            updateUserSettings(userSettings.config_id).then((result) => {
                alert("Perfil Actualizado!")
                setSaved(true)
            })
        }   
              
    }

    function editUsername(){
        console.log(toTitleCase(props.user.username))
        let element = document.querySelector("#username span");
        element.innerHTML = `<input type='text' value='${toTitleCase(props.user.username)}' />`;
        let inputElement = element.querySelector("input")
        inputElement.addEventListener("change", function(){
            setSaved(false)
            if(inputElement.value.trim() === ""){
                alert("El Usuario NO debe estar vacio")
            }else{
                setUserInfo({username: inputElement.value})
            }
        }, false)
    }

    function changePassword(){
        let element = document.querySelector("#password span");
        element.innerHTML = "<input class='mb-2' type='password'/><div><strong>Nueva Contraseña:</strong> <input type='password' id='newPassword' class='mb-2'/></div><div><strong>Confirmar Nueva Contraseña:</strong> <input type='password' id='confirmNewPassword' class='mb-2'/></div>";
        let inputElement = element.querySelector("input")
        inputElement.addEventListener("change", function(){
            setSaved(false)
            if(inputElement.value.trim() === ""){
                alert("La Contraseña NO debe estar vacia")
            }
        }, false)
    }

    const tabList = [
        {
          name: 'profile',
          label: 'Mi perfil',
          content: (
            <div className="tab-content">
                <div id="username" className='my-2'><strong>Usuario:</strong> <span>{toTitleCase(props.user.username)}<BiEdit onClick={editUsername} className={styles.editButton} title='Cambiar Usuario'/></span></div>
                <div id="password" className='my-2'><strong>Contraseña:</strong> <span>*****<BiEdit onClick={changePassword} className={styles.editButton} title='Cambiar Contraseña'/></span> </div>
                <div id="email" className='my-2'><strong>Correo: </strong> <span>{props.user.email}</span></div>
                <div id="image" className='my-2'><strong>Imagen: </strong>
                    <div id="userImage" className={`text-center mt-2 ${styles.imagePreview}`}></div>
                    {srcImg && (
                            <div className='text-center mt-2'>
                                <ReactCrop
                                    className={styles.imagePreview}
                                    style={{border: '1px solid gray'}}
                                    src={srcImg}
                                    onImageLoaded={setImage}
                                    crop={crop}
                                    onChange={setCrop}
                                />
                            </div>
                        )}
                    <input className="mt-4" accept='image/*' type="file" id="imageUploader" onChange={handleImage}/>
                </div>
            </div>
          )
        },
        {
          name: 'audio',
          label: 'Audio',
          content: (
            <Tab tab={currentTab} userSettings={userSettings}/>
          )
        },
        {
          name: 'video',
          label: 'Video',
          content: (
            <Tab tab={currentTab} userSettings={userSettings}/>
          )
        }
      ];
    

    if(props.visible){
        // console.log(props.user.image)
        
        return (
            <div>
                <div className={styles.background} onClick={closeModal}></div>
                <div className={`card ${styles.settings}`}>
                    <div className={`card-body`}>
                        <h3 className='card-title text-center'>Ajustes</h3>
                        <span className={styles.closeButton} onClick={closeModal}><RiCloseFill /></span>
                        <hr/>
                        <div className='row'>                    
                            <div className={`col-auto d-flex ${styles.tabButton}`}>
                                {
                                tabList.map((tab, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => {changeTab(tab.name)}} 
                                        className={(tab.name === currentTab) ? `${styles.tabs} ${styles.active}`  : `${styles.tabs}`}>
                                        {tab.label}
                                    </button>
                                ))
                                }
                            </div>
                            {
                                tabList.map((tab, i) => {
                                if(tab.name === currentTab) {
                                    return <div key={i} className={`col ${styles.tabContent}`}>{tab.content}</div>;
                                } else {
                                    return null;
                                }
                                })
                            }
                        </div>
                        </div>
                        <div className='row mx-auto mb-3' style={{width: '97%'}}>
                            <strong id="settingsHelp" className="form-text text-danger"></strong>
                            <hr className=''/>
                            <div className='text-center'>
                                <button className={`my-0 ${styles.button_form}`} onClick={saveSettings}>Guardar</button>
                                {/* <button className={`my-0 ${styles.button_form}`} onClick={discart}>Descartar cambios</button> */}
                            </div>
                        </div>
                    
                </div>
            </div>
            );
    }
    return null;
}
export default Settings;

async function getImage(image){
    const query = `query ($image: Imageinput!){
        image(image: $image){
            image   
        }
    }`;

    const variables = {
        image: {image: image}
    }

    // console.log(userToken)
    return await axios.post(config.apiURL, {
        query,
        variables
    }, { headers: { 'Content-Type': 'application/json'}
    });

}export {getImage}

export async function updateUser(fields, token){

    const query = `mutation ($user: UserupdInput!){
        profile(user: $user){
        username
        email
        image
        }
    }`;

    let variables = {
        user: {token: token}
    }

    if(fields.username) variables.user['username'] = fields.username
    if(fields.password) variables.user['password'] = fields.password
    if(fields.image) variables.user['image'] = fields.image

    console.log("variables: ", variables)
    // console.log(userToken)
    return await axios.post(config.apiURL, {
        query,
        variables
    }, { headers: { 'Content-Type': 'application/json'}
    })
    
}

export async function updateUserSettings(id){
    console.log("Update Settings: ", id)
    const settings = sessionStorage.getItem("settings");

    const query = `mutation ($configuration: updateConfig!){
        updateConfig(configuration: $configuration)
    }`;

    let variables = {
        configuration: {config_id: id}
    }

    if(settings){
        if(JSON.parse(settings)[0].video) variables.configuration['in_video'] = JSON.parse(settings)[0].video.deviceId.exact
        if(JSON.parse(settings)[0].audio) variables.configuration['in_audio'] = JSON.parse(settings)[0].audio.deviceId.exact
        if(JSON.parse(settings)[1]) variables.configuration['out_audio'] = JSON.parse(settings)[1]
    }

    console.log("variables: ", variables)
    // console.log(userToken)
    return await axios.post(config.apiURL, {
        query,
        variables
    }, { headers: { 'Content-Type': 'application/json'}
    })
    
}

export async function getUserSettings(userEmail){
    console.log("Getting user settings: ", userEmail)
    const query = `query ($user_email: String!){
        userConfig(user_email: $user_email){
            config_id
            user_email
            in_video
            background_id
            in_audio
            out_audio
        }
    }`;

    const variables = {
        user_email: userEmail
    }

    // console.log(userToken)
    return await axios.post(config.apiURL, {
        query,
        variables
    }, { headers: { 'Content-Type': 'application/json'}
    })
    
}