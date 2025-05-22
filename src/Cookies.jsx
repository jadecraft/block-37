
import { useState, useEffect } from 'react';
import './App.css';

function Cookies({ addToCart }) {
  const [cookies, setCookies] = useState([]);
  const [error, setError] = useState(null);
  const [singleCookie, setSingleCookie] = useState(null);
//fetching the cookies data
  useEffect(() => {
    async function getCookies() {
      try {
        const response = await fetch('http://localhost:3000/api/cookies');
        if (!response.ok) throw new Error('Network response was not ok');
        const json = await response.json();
        if (json) setCookies(json);
        else throw new Error('Cookies data is not available');
      } catch (error) {
        setError(error.message);
      }
    }

    getCookies();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }
//returning the data for the description 
  if (singleCookie) {
    return (
      <>
        <h1 id="title">Whip'd Cookies!</h1>
        <h2 id='by'>By Jade Craft</h2>
        <div className="cookie-detail">
          <h3>{singleCookie.name}</h3>
          <p>${singleCookie.price} per cookie.</p>
          <img id="cookie-pics" src={singleCookie.img_url} alt={singleCookie.name} />
          <p>{singleCookie.description}</p>
          <button onClick={() => setSingleCookie(null)}>Back to list</button>
        </div>
      </>
    );
  }
//retunring the data for the cookies to be shown on the home page
  return (
    <>
      <h1 id="title">Whip'd Cookies!</h1>
      <h2>By Jade Craft</h2>
      {cookies.length === 0 ? (
        <div>No cookies available</div>
      ) : (
        <div className="cookie-container">
          {cookies.map((cookie) => (
            <div className="cookie" key={cookie.id}>
              <h3>{cookie.name}:</h3>
              <img id="img" src={cookie.img_url} alt={cookie.name} />
              <button onClick={() => setSingleCookie(cookie)}>See Details</button>
              <button onClick={() => addToCart(cookie)}>Add to Cart</button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Cookies;
