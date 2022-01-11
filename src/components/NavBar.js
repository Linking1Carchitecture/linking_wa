import { Link } from 'react-router-dom';
import Logo from './Logo';
import styles from '../assets/styles/Landing.module.css';

import { FaUserCircle } from 'react-icons/fa'
import { Dropdown } from 'react-bootstrap'
import React, { useEffect, useState } from 'react';
import { getImage } from './Settings';

function NavBar(props){

    const [userImage, setUserImage] = useState();

    const logOut = () =>{
        localStorage.removeItem("userToken")
    }

    function toTitleCase(str) {
        return str.replace(
          /\w\S*/g,
          function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          }
        );
      }
    
    function showModal(){
        props.showModal()
    }

    useEffect(()=>{
        if(props.user.image){
            getImage(props.user.image).then((result)=>{
                setUserImage(result.data.data.image.image)
                if(userImage){
                    document.getElementById("userIcon").innerHTML = `<img src='data:image/jpeg;base64,${userImage}' alt='Imagen del usuario'/>`
                    props.sendImage(userImage)
                }
            }).catch((error) => {
                console.log(error);
            })
            
        }
    },[userImage, setUserImage, props])

    let options;
    let user = props.user;
    
    
    console.log(user)

    if(user.username){ 
        options = 
            <div className="navbar-right d-line">
                <div className={styles.greeting}>{toTitleCase(user.username.split(" ")[0])}</div>
                <Dropdown bsPrefix='d-inline'>
                    <Dropdown.Toggle variant="link" bsPrefix="p-0 mr-4" className={styles.userIcon}>
                        <div id="userIcon"><FaUserCircle /></div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={showModal}>Ajustes</Dropdown.Item>
                        <Dropdown.Item href="/" onClick={logOut}>Salir</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
          </div>
        
    }else{
        options = <div className="navbar-right">
                        <Link to='/login'><button className={styles.button_form}>Ingresar</button></Link>
                        <Link to='/register'><button className={styles.button_form}>Registrarse</button></Link>
                    </div>
    }

    return (
    <nav className='navbar navbar-inverse'>
        <div className="container-fluid">
            <div className='navbar-left'>
                <div className={styles.logo}>
                    <Logo />
                </div>
            </div>
            { options }            
        </div>
    </nav>);
}

export default NavBar;