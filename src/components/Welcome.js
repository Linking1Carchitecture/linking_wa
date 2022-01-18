import { useNavigate } from 'react-router-dom';
import styles from '../assets/styles/Landing.module.css';
import { newMeeting } from './Meeting';

function Welcome(props){
    
    let navigate = useNavigate();

    const createMeeting = async()=>{
        if(props.token){
            newMeeting(props.token).then((result) => {
                const meetingData = result.data
                console.log(meetingData)
            })
        }else{
            navigate("/login")
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
            <button className={`${styles.joinBtn}`}>Unirse</button>
        </div>  
        </div>
    );
}
export default Welcome;

