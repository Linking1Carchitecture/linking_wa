import { Link } from 'react-router-dom';
import styles from '../assets/styles/Landing.module.css';
import { RiCloseFill } from 'react-icons/ri'
import { BiEdit } from 'react-icons/bi'

import React, { useEffect, useState } from 'react';
import config from '../config.json'

import axios from 'axios';

import Tab, {stopVideo} from './Tab';

function Settings(props){

    const [currentTab, setCurrentTab] = useState('profile');
    const [imageProfile, setImageProfile] = useState();
    const [userToken, setUserToken] = useState()
    const [userInfo, setUserInfo] = useState({
        token: null, username: null, password: null, image: null
    })
    const [saved, setSaved] = useState(true);

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
          setUserInfo({token: userToken})
        }      
                
    }, [props, userToken, imageProfile]);

    if(!props.user.username){
        return null; 
    }

    function closeModal(){
        props.showModal()
        try{
            stopVideo();
        }catch{}
    }

    function toTitleCase(str) {
        return str.replace(
          /\w\S*/g,
          function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          }
        );
    }

    function previewImage(){
        // console.log("preview")
        const [file] = document.getElementById("imageUploader").files
        // console.log(file)
        if(file){
            setImageProfile(URL.createObjectURL(file))
            setSaved(false)
        }
    }

    function changeTab(tab){
        if(!saved){
            if (help) help.innerHTML = "<div class='mt-4 mb-1'>No has guardado los cambios</div>"
        }else{
            setCurrentTab(tab)
            stopVideo()
        }
    }

    function discart(){
        setSaved(true)
        help.innerHTML = ""
        // TODO: Load user settings again
    }

    function saveSettings(){
        // TODO: Update userSettings values on attribute update
        // TODO: Point save button to this function
        // updateUser(userSettings).then((result)=>{
        //     setSaved(true)
        // })
    }

    function editUsername(){
        document.querySelector("#username span").remove();
        let node = document.createElement("input")
        node.value = toTitleCase(props.user.username);
        node.type = "text";
        document.querySelector("#username").appendChild(node)
    }

    const tabList = [
        {
          name: 'profile',
          label: 'Mi perfil',
          content: (
            <div className="tab-content">
                <div id="username" className='my-2'><strong>Usuario:</strong> <span>{toTitleCase(props.user.username)}</span><BiEdit onClick={editUsername}/> </div>
                <div id="email" className='my-2'><strong>Correo: </strong> <span>{props.user.email}</span></div>
                <div id="image" className='my-2'><strong>Imagen: </strong> <BiEdit />
                    <input className="mt-4" accept='image/*' type="file" id="imageUploader" onChange={previewImage}/>
                    <div id="userImage" className={`text-center ${styles.imagePreview}`}></div>
                </div>
            </div>
          )
        },
        {
          name: 'audio',
          label: 'Audio',
          content: (
            <Tab tab={currentTab}/>
          )
        },
        {
          name: 'video',
          label: 'Video',
          content: (
            <Tab tab={currentTab}/>
          )
        }
      ];
    

    if(props.visible){
        console.log(props.user.image)
        
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
                        <div style={{position: 'relative', bottom: '0px'}}>
                            <strong id="settingsHelp" className="form-text text-danger"></strong>
                            {/* <hr className=''/>
                            <div className='text-center'>
                                <button className={`my-0 ${styles.button_form}`}>Guardar</button>
                                <button className={`my-0 ${styles.button_form}`} onClick={discart}>Descartar cambios</button>
                            </div> */}
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

export async function updateUser(fields){

    const query = `mutation ($user: UserupdInput!){
        profile(user: $user){
        username
        email
        image
        }
    }`;

    let variables = {
        user: {token: fields.token}
    }

    if(fields.username) variables.user['username'] = fields.username
    if(fields.password) variables.user['password'] = fields.password
    if(fields.image) variables.user['image'] = fields.image

    // console.log(userToken)
    return await axios.post(config.apiURL, {
        query,
        variables
    }, { headers: { 'Content-Type': 'application/json'}
    })
    
}