import axios from 'axios';
import './login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {

    const [email,setmail]=useState('');
    const [pass,setpass]=useState('');
    const navigate=useNavigate();

    const logsub=async (e)=>{
        e.preventDefault();

        try{
            const res=await axios.post("http://localhost:3003/auth/login",
                {
                    email,pass
                }
            )
                console.log(res.data);
                navigate("/dashboard");
            
        }
        catch(err)
        {
            console.log(err);
        }

    }
    return (
        <div>
            <div>
                <form onSubmit={logsub}>
                    <input type="text" placeholder="email or username" value={email} onChange={(e)=>setmail(e.target.value)}>
                    </input>

                    <br></br>
                    <input type="password" placeholder="password" value={pass} onChange={(e)=>setpass(e.target.value)}>
                    </input>

                    <br />
                    <input type="submit" value="signin"></input>
                </form>
            </div>
        </div>
    );
}
export default Login;