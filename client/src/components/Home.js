import React, { useState, useEffect } from "react";
import axios from "axios";
import DarkModeToggle from './DarkModeToggle';


function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Handle login logic here
  };

  const [featuredPets, setFeaturedPets] = useState([]);

  useEffect(() => {
    axios.get("/pets").then((response) => {
      setFeaturedPets(response.data);
    });
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
    <><div className="dark-mode-toggle-container">
          <DarkModeToggle />
      </div>
      <div>
              <h1>Welcome to Pet Adoption Connect</h1>
              <div className="login-section">
                  <h2>Login</h2>
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
                      <button className='task-button'type="submit">Login</button>
                  </form>
              </div>
              <div className="intro-text">
                  <p>Find your perfect pet companion here!</p>
                  <p>We connect pet owners with potential adopters.</p>
              </div>
              <div className="pets-list">
                  <h2>Featured Pets</h2>
                  {featuredPets.map((pet) => (
                      <div key={pet.pet_id} className="pet-card">
                          <img src={pet.image_url} alt={pet.petname} />
                          <h3>{pet.petname}</h3>
                          <p>{pet.breed}</p>
                          <p>{pet.gender}</p>
                      </div>
                  ))}
                  <div className="search-pets">
                      <h2>Search Pets</h2>
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
          </div></>
  );
}

export default Home;
