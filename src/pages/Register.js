import React from 'react';
import axios from 'axios';

import forms from '../assets/styles/Forms.module.css';

import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

import config from '../config.json'

import { RiErrorWarningLine } from 'react-icons/ri'

function Register(){

  const [formValue, setformValue] = React.useState({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
  });
  
  const handleChange = (event) => {
    
    setformValue({...formValue,[event.target.name]: event.target.value});
    event.preventDefault();
    validateForm();
    
  }

  const handleSubmit = async(event) => {
    // console.log(formValue)
    if(!validateForm()){
      document.getElementById('formHelp').innerHTML = "<div>Revisa todos los campos</div>"
      return false
    }

    const query = `mutation ($user: UserInput!){
      signup(user: $user){
        username
        email
        status
      }
    }`;

    const variables = JSON.stringify({
      user: {username: formValue.username, email: formValue.email, password: formValue.password}
    })

    await axios.post(config.apiURL, {
      query,
      variables
    }, { headers: { 'Content-Type': 'application/json'}
    }).then((result) => {
      const response = result.data.data
      const errors = result.data.errors
      if(errors){
        errors.forEach((error) => {
          if(error.code === 11000){
            alert("Este usuario ya existe")
          }
        })
      }
      
      if(response != null){
        alert("Usuario registrado!!!")
      }
      // console.log(JSON.stringify(response))
      // console.log("Code: ",responseCode)
    }).catch((error) => {
      alert("ERROR!!!")
      console.log(error)
      console.log(query)
    });
  }


  function validateForm(){
    let valid = true;
    document.getElementById('formHelp').textContent = ""
    document.getElementById('passwordHelp').textContent = ""
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
      
      const ePassword = document.getElementById("password");
      const eConfirmation = document.getElementById("confirmPassword");
      if(ePassword.value !== eConfirmation.value){
        eConfirmation.nextSibling.style.display = "block";
        document.getElementById('passwordHelp').textContent = "Las contraseñas no coinciden"
        valid = false;
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

  return (
      <div className='container'>
          <div className={forms.logo}>
              <Logo />
          </div>
          <form noValidate>
              <div className='text-center'>
                  <label htmlFor="username">Usuario</label>
                  <input className='form-control' type="text" name="username" id="username" title='Usuario' onChange={handleChange} required/>
                  <div className={`text-danger ${forms.warningIcon}`}><RiErrorWarningLine /></div>
              </div>
              <div className='text-center'>
                  <label htmlFor="email">Correo</label>
                  <input className='form-control' type="email" name="email" id="email" title='Correo' onChange={handleChange} required/>
                  <div className={`text-danger ${forms.warningIcon}`}><RiErrorWarningLine /></div>
                  <small id="emailHelp" className="form-text text-danger"></small>
              </div>
              <div className='text-center'>
                  <label htmlFor="password">Contraseña</label>
                  <input className='form-control' type="password" name="password" id="password" title='Contraseña' onChange={handleChange} required/>
                  <div className={`text-danger ${forms.warningIcon}`}><RiErrorWarningLine /></div>
              </div>
              <div className='text-center'>
                  <label htmlFor="confirmPassword">Verificar Contraseña</label>
                  <input className='form-control' type="password" name="confirmPassword" id="confirmPassword" title='Contraseña' onChange={handleChange} required/>                  
                  <div className={`text-danger ${forms.warningIcon}`}><RiErrorWarningLine /></div>
                  <small id="passwordHelp" className="form-text text-danger"></small>
              </div>
              <div className='text-center'>
                  <strong id="formHelp" className="form-text text-danger"></strong>
                  <button type='button' className={forms.button_form} onClick={handleSubmit}>Registrarse</button>
                  <Link to='/login'><button className={forms.button_form}>Ya tengo cuenta</button></Link>                    
              </div>
          </form>
      </div>
  );
}
export default Register;