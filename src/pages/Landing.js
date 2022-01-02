import NavBar from '../components/NavBar';
import styles from '../assets/styles/Landing.module.css';

function Landing(props){

    return (
        <div>
            <NavBar username={null} />
            <div className={`text-center ${styles.content}`}>
                <h1>Video-reuniones libres para toda la comunidad.</h1>
                <button>Crear reunion</button>
            </div>
            <div className={`text-center input-group ${styles.joinInput}`}>
                <input type='text' id='meetingID' placeholder='Id reunion' className={`form-control mb-0`}/>
                <button className={`btn ${styles.joinBtn}`}>Unirse</button>
            </div>
        </div>
    );
}
export default Landing;