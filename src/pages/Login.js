import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { RiErrorWarningLine } from 'react-icons/ri'
import forms from '../assets/styles/Forms.module.css';

import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

import { userProfile } from '../pages/Landing';

import config from '../config.json'

function Login(){

    let navigate = useNavigate();
    const [, setUserToken] = useState();

    const [formValue, setformValue] = React.useState({
        email: '',
        password: '',
    });    

    const handleChange = (event) => {
        setformValue({...formValue,[event.target.name]: event.target.value});
        validateForm();
    }

    const handleSubmit = async(event) =>{
      event.preventDefault();
      if(!validateForm()){
        document.getElementById('formHelp').innerHTML = "<div class='mt-4 mb-1'>Revisa todos los campos</div>"
        return false
      }
      login(formValue).then((result) => {
        const response = result.data.data
        const errors = result.data.errors
        if(errors){
          errors.forEach((error) => {
            alert("ERROR!")
            console.log(error)
          })
        }
    
        if(response != null){
          alert("Welcome!!!")
          setUserToken(response.signin.authtoken)
          localStorage.setItem('userToken', response.signin.authtoken)
          navigate('/')  
            
          
        }else{
          document.getElementById('formHelp').innerHTML = "<div class='mt-4'>Credenciales erróneas</div> <div>o</div> <div class='mb-3'>No has confirmado tu cuenta</div>"
        }
        console.log(JSON.stringify(response))
        // console.log("Code: ",responseCode)
      }).catch((error) => {
        alert("ERROR!!!")
        console.log(error)
      });

    }

    function validateForm(){
        let valid = true;
        document.getElementById('formHelp').textContent = ""
        document.getElementById('emailHelp').textContent = ""
    
        const fields = Array.from(document.querySelectorAll('input'));
        fields.forEach((box) => {
          box.nextSibling.style.display = "none";
          if(box.value.trim() === ""){
            box.nextSibling.style.display = "block";
            valid = false;
          }
    
          if(box.type === 'email'){
            if(!validateEmail(box.value)){
              document.getElementById('emailHelp').textContent = "Ingresa un correo válido"
              box.nextSibling.style.display = "block";
              valid = false;
            }
          }

        });
    
        return valid;
    }

    const validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
    };
    useEffect(() => {
      if(localStorage.getItem("userToken")){
        userProfile(localStorage.getItem("userToken")).then(
          navigate("/")  
        )
      }
    },[navigate]);
    
    return (
        // <div className={`w-100 row ${forms.center}`}>
        <div className='container'>
            {/* <div className='col-6 text-center'> */}
            <div className={forms.logo}>
                <Logo />
            </div>
            {/* <div className='col-6 mt-4'> */}
            <div>
                <form className='text-center' onSubmit={handleSubmit}>
                    <div className='text-center'>
                        <label htmlFor="email">Correo</label>
                        <input className='form-control' type="email" name="email" id="email" onChange={handleChange}/>
                        <div className={`text-danger ${forms.warningIcon}`}><RiErrorWarningLine /></div>
                        <small id="emailHelp" className="form-text text-danger"></small>
                    </div>
                    <div className='text-center'>
                        <label htmlFor="password">Contraseña</label>
                        <input className='form-control' type="password" name="password" id="password" onChange={handleChange}/>
                        <div className={`text-danger ${forms.warningIcon}`}><RiErrorWarningLine /></div>
                    </div>
                    <div className='text-center'>
                        <strong id="formHelp" className="form-text text-danger"></strong>
                        <button type='submit' className={forms.button_form}>Ingresar</button>
                        <Link to='/register'><button className={forms.button_form}>No tengo cuenta</button></Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default Login;

export async function login(fields){
  // console.log("LOGIN!")
  const query = `mutation ($user: LoginInput!){
    signin(user: $user){
      authtoken
    }
  }`;

  const variables = JSON.stringify({
    user: {email: fields.email, password: fields.password}
  })
  console.log("LOGIN: ", variables)
  return await axios.post(config.apiURL, {
    query,
    variables
  }, { headers: { 'Content-Type': 'application/json'}
  })
}