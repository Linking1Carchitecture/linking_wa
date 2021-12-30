import forms from '../assets/styles/Forms.module.css';

import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

function Register(){
    return (
        <div className={forms.center}>
            <div className={forms.logo}>
                <Logo />
            </div>
            <form>
                <div className='text-center'>
                    <label className='' htmlFor="username">Usuario</label>
                    <input className='form-control' type="text" name="username" id="username"/>
                </div>
                <div className='text-center'>
                    <label htmlFor="email">Correo</label>
                    <input className='form-control' type="email" name="email" id="email"/>
                </div>
                <div className='text-center'>
                    <label htmlFor="password">Contraseña</label>
                    <input className='form-control' type="password" name="password" id="password"/>
                </div>
                <div className='text-center'>
                    <label htmlFor="repeatPassword">Verificar Contraseña</label>
                    <input className='form-control' type="password" name="repeatPassword" id="repeatPassword"/>
                </div>
                <div className='text-center'>
                    <Link to='/login'><button className={forms.button_form}>Ingresar</button></Link>
                    <Link to='/register'><button className={forms.button_form}>Registrarse</button></Link>
                </div>
            </form>
        </div>
    );
}
export default Register;