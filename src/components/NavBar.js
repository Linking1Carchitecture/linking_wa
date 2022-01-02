import { Link } from 'react-router-dom';
import Logo from './Logo';
import styles from '../assets/styles/Landing.module.css';

function NavBar(props){
    let options;
    if(props.username){
        options = <div>Hola {props.username}</div>
    }else{
        options = <div className="navbar-right">
                        <Link to='/login'><button className={styles.button_form}>Ingresar</button></Link>
                        <Link to='/register'><button className={styles.button_form}>Registrarse</button></Link>
                    </div>
    }

    return (
    <nav className='navbar navbar-inverse'>
        <div className="container-fluid">
            <div className='navbar-header'>
                <div className={styles.logo}>
                    <Logo />
                </div>
            </div>
            { options }
            
        </div>
    </nav>);
}

export default NavBar;