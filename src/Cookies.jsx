import { useState, useEffect } from 'react';
import './App.css';
import './Navigations';
import Navbar from './Navigations';



function Cookies() {
  const [cookies, setCookies] = useState([]);
  const [error, setError] = useState(null);
  const [singleCookie, setSingleCookie] = useState(null);

  useEffect(() => {
    async function getCookies() {
      try {
      
        const response = await fetch('http://localhost:3000/api/cookies'); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const json = await response.json();
        console.log (json)
        if (json) {
          setCookies(json);
        } else {
          throw new Error('Cookies data is not available');
        }
      } catch (error) {
        setError(error.message);
      }
    }

    getCookies();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (singleCookie) {
    return (
      <>
        <h1 id="title">Whip'd Cookies!</h1>
        <a href="/" className="home-link">Home</a>
        <div className="cookie-detail">
          <h2>{singleCookie.name}</h2>
          <p>${singleCookie.price} per cookie.</p>
          <img id= "cookie-pics" src={singleCookie.img_url} alt={singleCookie.name} />
          <p>{singleCookie.description}</p>
          <button onClick={() => setSingleCookie(null)}>Back to list</button>
        </div>
      </>
    );
  }

  return (
  <>
    <h1 id="title">Whip'd Cookies!</h1>
    <Navbar />
    {cookies.length === 0 ? (
      <div>No cookies available</div>
    ) : (
      <div className="cookie-container">
        {cookies.map((cookie) => (
          <div className="cookie" key={cookie.id}>
            <h2>{cookie.name}:</h2>
            <img id="img" src={cookie.img_url} alt={cookie.name} />
            <button onClick={() => setSingleCookie(cookie)}>See Details</button>
          </div>
        ))}
      </div>
    )}
  </>
);
}
export default Cookies;


