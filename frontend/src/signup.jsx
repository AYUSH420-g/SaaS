import './signup.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {

    const [email,setmail]=useState('');
    const [name,setname]=useState('');
    const [pass,setpass]=useState('');
    const navigate=useNavigate();

    const subsign=async (e)=>{

        e.preventDefault();

        try{

            const res=await axios.post("http://localhost:3003/auth/signup",
                {
                    name,email,pass
                }
            );
            console.log(res.data);
            navigate("/login");


        }
        catch(err){
            console.log(err);
        }


    }
    return (
        <div>
            <form onSubmit={subsign}>
                <input type="text" placeholder="email" value={email} onChange={(e)=>
                    setmail(e.target.value)
                }>
                </input>

                <br></br>

                <input type="text" placeholder="username" value={name} onChange={(e)=>
                    setname(e.target.value)}>
                </input>

                <br></br>
                <input type="password" placeholder="password" value={pass} onChange={(e)=>
                    setpass(e.target.value)}>
                </input>

                <br />

                <input type="password" placeholder="confirm password">
                </input>

                <br />
                <input type="submit" value="signin"></input>
            </form>
        </div>
    );
}
export default Signup;