import forms from '../assets/styles/Forms.module.css';

import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

function Login(){
    return (
        // <div className={`w-100 row ${forms.center}`}>
        <div className={forms.center}>
            {/* <div className='col-6 text-center'> */}
            <div className={forms.logo}>
                <Logo />
            </div>
            {/* <div className='col-6 mt-4'> */}
            <div className='mt-4'>
                <form className='text-center'>
                    <div className='text-center'>
                        <label htmlFor="email">Correo</label>
                        <input className='form-control' type="email" name="email" id="email"/>
                    </div>
                    <div className='text-center'>
                        <label htmlFor="password">Contraseña</label>
                        <input className='form-control' type="password" name="password" id="password"/>
                    </div>
                    <div className='text-center'>
                        <Link to='/login'><button className={forms.button_form}>Ingresar</button></Link>
                        <Link to='/register'><button className={forms.button_form}>Registrarse</button></Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default Login;