import logo from '../assets/images/logo.png'
import styles from '../assets/styles/MainNavigation.module.css'

import { Link } from 'react-router-dom';

function Logo(){
    return (
        <div className='my-4'>
            <Link to='/'><img src={logo} alt="Linking" className={styles.logo}/></Link>
        </div>
    );
}
export default Logo;