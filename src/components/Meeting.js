import axios from 'axios';
import config from '../config.json'

function Meeting(props){
    
    return (
        <div>This is a meeting with ID: {props.data}</div>
    );
}
export default Meeting;

export async function getMeeting(meetingID){

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

    // console.log(variables)
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