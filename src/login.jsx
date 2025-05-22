import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Login ({setToken}) {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const nagivate = useNavigate();

const handleChange = (event) => {
    
    if (event.target.name === "email") {
      setEmail(event.target.value);
    } else {
      setPassword(event.target.value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try{const response = await fetch(
        "http://localhost:3000//api/auth/login", {method:"POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
      );
      const json = await response.json();
      console.log(json)
      setToken(json.token);
      nagivate('/')
    
    } catch(err){
        console.log(err)
    }
};

    return (
        <div>
            <h2 id="Login-Title">Login</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Email:{" "}
                    <input
                    value={email}
                    name="email"
                    onChange={handleChange}
                    />
                </label>
                <label>
                    Password:{" "}
                    <input
                    value={password}
                    name="password"
                    onChange={handleChange}
                    />
                </label>
                <button type="submit">Login</button>
            </form>
        </div>

    )
};

export default Login;