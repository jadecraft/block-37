import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Register ({setToken}) {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [name, setName] = useState("")
const nagivate = useNavigate();

const handleChange = (event) => {
    
    if (event.target.name === "email") {
      setEmail(event.target.value);
    } else if (name === "password") {
      setPassword(event.target.value);
    } else if (name === "name") {
        setName(event.target.value);
    }

  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try{const response = await fetch(
        "", {method:"POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
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
            <a href="/" className="home-link">Home</a>
            <h2 id="Register-Title">Register</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:{""}
                    <input
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