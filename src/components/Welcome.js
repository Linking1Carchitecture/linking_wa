import { useNavigate } from 'react-router-dom';
import styles from '../assets/styles/Landing.module.css';
import { newMeeting } from './Meeting';

function Welcome(props){
    
    let navigate = useNavigate();
    
    const meetingIdElement = document.getElementById("meetingID");

    const createMeeting = async()=>{
        if(props.token){
            newMeeting(props.token).then((result) => {
                const meetingData = result.data.data.normal
                console.log(meetingData)
                navigate(`/${meetingData.id_llam}`)    
            })
        }else{
            navigate("/login")
        }
    }

    const joinMeeting = (event)=>{
        if(meetingIdElement){
            const meetingID = meetingIdElement.value;
            if(meetingID.trim() === ""){
                alert("Ingresa el ID de la reunion")
            }else{
                navigate(`/${meetingID}`)
            }
        }
    }

    return (
        <div>
        <div className={`text-center ${styles.content}`}>
            <h1>Video-reuniones libres para toda la comunidad.</h1>
            <button onClick={createMeeting}>Crear reunion</button>
        </div>
        <div className={`text-center input-group ${styles.joinInput}`}>
            <input type='text' id='meetingID' placeholder='Id reunion' className={`form-control mb-0`}/>
            <button id='joinButton' onClick={joinMeeting} className={`${styles.joinBtn}`}>Unirse</button>
        </div>  
        </div>
    );
}
export default Welcome;

