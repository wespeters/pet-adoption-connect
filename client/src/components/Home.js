import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"


function Home({ loggedInUser, setLoggedInUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5555/users/login', {
        username,
        password,
      });

      if (response.data.status === 'success') {
        // Save logged-in user
        setLoggedInUser(response.data.user);
        sessionStorage.setItem('loggedInUser', JSON.stringify(response.data.user));
        console.log('Login successful:', response.data.user);
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setUsername("");
    setPassword("");
    sessionStorage.removeItem('loggedInUser');
  };

  const [featuredPets, setFeaturedPets] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5555/pets/featured").then((response) => {
      console.log(response.data);
      setFeaturedPets(response.data);
    })

  }, []);

  const [searchCriteria, setSearchCriteria] = useState({
    species: "",
    breed: "",
    gender: "",
    location: "",
  });

  const handleSearch = () => {
    // Implement the search logic here based on searchCriteria
    // You may make an API call to filter the pets based on the selected criteria
  };

  return (
    
      <div>
        <h1>Welcome to Pet Adoption Connect</h1>
        <div className="container">
        <div className="login-section">
          {loggedInUser ? (
            <>
              <p>Logged in as {loggedInUser.username}</p>
              <p><Link to="/messages">View Message Inbox</Link></p>
            </>
          ) : (
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} />
              <button className='task-button' type="submit">Login</button>
            </form>
          )}
          {error && <div className="error-message">{error}</div>}
        </div>
        <div className="intro-text">
          <p>Find your perfect pet companion here!</p>
          <p>We connect pet owners with potential adopters.</p>
        </div>
        <div className="pets-list">
          <h2>Featured Pets</h2>
          {featuredPets.map((pet) => (
            <Link to={`/pets/${pet.pet_id}`} key={pet.pet_id}>
              <div className="pet-card">
                <img src={pet.image_url} alt={pet.petname} />
                <h3>{pet.petname}</h3>
                <p>{pet.breed}</p>
                <p>{pet.gender}</p>
              </div>
            </Link>
          ))}
          <div className="search-pets">
            <h2>Search Available Pets</h2>
            <div className="search-container">
              <select
                value={searchCriteria.species}
                onChange={(e) => setSearchCriteria({ ...searchCriteria, species: e.target.value })}
              >
                {/* Populate options based on available species */}
              </select>
              <select
                value={searchCriteria.breed}
                onChange={(e) => setSearchCriteria({ ...searchCriteria, breed: e.target.value })}
              >
                {/* Populate options based on available breeds */}
              </select>
              <select
                value={searchCriteria.gender}
                onChange={(e) => setSearchCriteria({ ...searchCriteria, gender: e.target.value })}
              >
                {/* Populate options based on available genders */}
              </select>
              <input
                type="text"
                placeholder="Location"
                value={searchCriteria.location}
                onChange={(e) => setSearchCriteria({ ...searchCriteria, location: e.target.value })} />
              <button className='task-button' onClick={handleSearch}>Search</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
