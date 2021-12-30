import forms from '../assets/styles/Forms.module.css';
// import landing from '../assets/styles/Landing.module.css';

import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

function Landing(props){

    return (
        <div >
            <div className={forms.logo}>
                <Logo />
            </div>
            <div className="text-center">
                <h1>HOLA {props.username}</h1>
            </div>
            <div className='text-center'>
                <Link to='/login'><button className={forms.button_form}>Ingresar</button></Link>
                <Link to='/register'><button className={forms.button_form}>Registrarse</button></Link>
            </div>
        </div>
    );
}
export default Landing;