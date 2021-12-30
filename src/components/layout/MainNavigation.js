import { Link } from 'react-router-dom';

function MainNavigation(){
    return (
    <header>
        <div>Linking App</div>    
        <nav>
            <ul>
                <li><Link to='/'>Inicio</Link></li>
                <li><Link to='/login'>Ingresar</Link></li>
                <li><Link to='/register'>Registrarse</Link></li>
            </ul>
        </nav>
    </header>);
}

export default MainNavigation;