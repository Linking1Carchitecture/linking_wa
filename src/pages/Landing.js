import NavBar from '../components/NavBar';
import styles from '../assets/styles/Landing.module.css';

import axios from 'axios';

import config from '../config.json'
import { useEffect, useState } from 'react';
import Settings, { getImage } from '../components/Settings';
import useModal from '../utils/useModal';

function Landing(){
    
    const {toggle, visible} = useModal();
    const [userToken, setUserToken] = useState()
    const [userData, setUserData] = useState({
        username: null, email: null, image: null
    })
    const [userImage, setUserImage] = useState();

    const showModal = () => {
        toggle();
    };

    const sendDataToParent = (data) => { // the callback. Use a better name
        // console.log(data);
        setUserImage(data);
    };

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if (token) {
          setUserToken(token);
        }      

        const loggedUser = async() =>{
            if(userToken){
            
                userProfile(userToken).then((result) => {
                    const response = result.data.data
                    const errors = result.data.errors
                    if(errors){
                    errors.forEach((error) => {
                        alert("ERROR!")
                        console.log(error)
                    })
                    }
        
                    if(response != null){
                        // alert(JSON.stringify(response))
                        
                        setUserData({...userData, ...response.profile})
                        // console.log("user: ", response.profile)
                    }else{
                        alert("ERROR getting user data :(")
                    }
                    // console.log(JSON.stringify(response))
                    // console.log("Code: ",responseCode)
                }).catch((error) => {
                    alert("ERROR!!!")
                    console.log(error)
                });
            }
        }
        if(!userData.username){
            loggedUser();
        }
        
    }, [userToken,userData]);
    
    return (
        <div>
            <NavBar user={userData} sendImage={sendDataToParent} showModal={showModal} />
            {/* <NavBar user={userData} /> */}
            <div className={`text-center ${styles.content}`}>
                <h1>Video-reuniones libres para toda la comunidad.</h1>
                <button>Crear reunion</button>
            </div>
            <div className={`text-center input-group ${styles.joinInput}`}>
                <input type='text' id='meetingID' placeholder='Id reunion' className={`form-control mb-0`}/>
                <button className={`${styles.joinBtn}`}>Unirse</button>
            </div>
            <Settings visible={visible} toggle={toggle} showModal={showModal} user={userData} userImage={userImage} className={styles.modal}/>
        </div>
    );
}
export default Landing;

async function userProfile(token){

    const query = `query ($token: Usertoken!){
        profile(token: $token){
        username
        email
        image

        }
    }`;

    const variables = {
        token: {token: token}
    }

    // console.log(userToken)
    return await axios.post(config.apiURL, {
        query,
        variables
    }, { headers: { 'Content-Type': 'application/json'}
    })
    
}export {userProfile};