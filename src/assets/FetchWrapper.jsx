import {project_url} from "./ProjectSettings.jsx";
export default function Fetch(endpoint,method="GET",headers={"Content-Type": "application/json"},Body,Query=''){
    if(method==="POST"){
        const sendPostRequest = async () => {
            try {
                const response = await fetch(project_url+endpoint, {
                    method: method,
                    headers: headers,
                    body: JSON.stringify(Body),
                });
               return {"result":await response.json().catch(() => ({})),"status":response.status};
            } catch (err) {
                console.log(err);
            }
        }
        return sendPostRequest();
    }
    else if(method==="GET"){
        const sendPostRequest = async () => {
            try {
                const response = await fetch(project_url+endpoint +Query, {
                    method: method,
                    headers: headers,
                });
                return {"result":await response.json().catch(() => ({})),"status":response.status};
            } catch (err) {
                console.log(err);
            }
        }
        return sendPostRequest();
    }
    else if(method==="PUT"){
        const sendPostRequest = async () => {
            try {
                const response = await fetch(project_url+endpoint, {
                    method: method,
                    headers: headers,
                    body: JSON.stringify(Body),
                });
                return {"result":await response.json().catch(() => ({})),"status":response.status};
            } catch (err) {
                console.log(err);
            }
        }
        return sendPostRequest();
    }else if(method==="DELETE"){
        const sendPostRequest = async () => {
            try {
                const response = await fetch(project_url+endpoint, {
                    method: method,
                    headers: headers,
                });
                return {"result":await response.json().catch(() => ({})),"status":response.status};
            } catch (err) {
                console.log(err);
            }
        }
        return sendPostRequest();
    }


}