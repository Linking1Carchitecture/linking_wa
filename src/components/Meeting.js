import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config.json'

function Meeting(props){
    
    let navigate = useNavigate();
    const [meetingData, setMeetingData] = useState({
        id_llam: null, organization: null, begin_Date: null
    })

    useEffect(() => {
        if(props.user.username){
            getMeeting(props.data).then((result)=>{
                if(result.data.data){
                    setMeetingData(result.data.data.creationById)
                }
            })
        }else{
            alert("Debes ingresar!")
            navigate("/login")
        }   
    }, [props, navigate]);

    if(!props.user.username){
        
    }

    return (
        <div>
        { meetingData.id_llam ? 
            <div>
                <h1>Welcome to this meeting</h1>
                <h6>Meeting information</h6>
                <ul>
                    <li><strong>ID:</strong> {meetingData.id_llam}</li>
                    <li><strong>organization: </strong>{meetingData.organization}</li>
                    <li><strong>begin_Date: </strong>{meetingData.begin_Date}</li>
                </ul>
            </div>
            : <div>
                <h1>This meeting does not exist :|</h1>
              </div>
        }
        </div>
    );
}
export default Meeting;

export async function getMeeting(meetingID){

    const query = `query ($id_llam: String!){
        creationById(id_llam: $id_llam){
            id_llam
            organization
            begin_Date
        }
    }`;
    
    const variables = {
        id_llam: meetingID
    }

    // console.log(variables)
    return await axios.post(config.apiURL, {
        query,
        variables
    }, { headers: { 'Content-Type': 'application/json'}
    })
}

export async function newMeeting(token){
    // console.log("New Meeting!")
    const query = `mutation ($creation: CreationInput!){
        normal(creation: $creation){
            id_llam
            organization
            begin_Date
        }
    }`;

    const today = new Date();
    const date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();

    let id = generateID();
    
    const variables = {
        creation: {id_llam: id, organization: "unal", begin_Date: date, token: token}
    }

    console.log(variables)
    return await axios.post(config.apiURL, {
        query,
        variables
    }, { headers: { 'Content-Type': 'application/json'}
    })
    
};

export function generateID(){
    let result           = '';
    let characters       = 'abcdefghijklmnopqrstuvwxyz';
    let charactersLength = characters.length;
    let lengths = [3,4,3]
    lengths.forEach((length)=>{
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        result += "-";
    })
    return result.substring(0,12);
}