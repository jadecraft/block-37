import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Register ({setToken}) {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [name, setName] = useState("")
const [username, setUsername] = useState("")
const navigate = useNavigate();

const handleChange = (event) => {
    const {name, value} = event.target;
    
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "name") {
        setName(value);
    } else if (name === "username") {
        setUsername(value);
    }

  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try{const response = await fetch(
        "/api/auth/register", {method:"POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, username, password }),
      }
      );
      const json = await response.json();
      console.log(json)
      setToken(json.token);
      navigate('/')
    
    } catch(err){
        console.log(err)
    }
};

    return (
        <div>
            <h2 id="Register-Title">Register</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:{""}
                    <input
                    name="name"
                    value={name}
                    onChange={handleChange}
                    />
                </label>
                <label>
                    Email:{" "}
                    <input
                    value={email}
                    name="email"
                    onChange={handleChange}
                    />
                </label>
                <label>
                    Username:{""}
                    <input
                    value={username}
                    name="username"
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
                <input type="submit" />
            </form>
        </div>

    )
};

export default Register;