import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"


function Home({ loggedInUser, setLoggedInUser }) {
  const navigate = useNavigate();
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
        setLoggedInUser(response.data.user);
        sessionStorage.setItem('loggedInUser', JSON.stringify(response.data.user));
      }
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    }
  };

  const [featuredPets, setFeaturedPets] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5555/pets/featured").then((response) => {
      setFeaturedPets(response.data);
    })

  }, []);

  const [searchCriteria, setSearchCriteria] = useState({
    petname: "",
    species: "",
    breed: "",
    age: "",
    gender: "",
  });

  const handleSearch = () => {
    window.location.href = `/search?petname=${searchCriteria.petname}&species=${searchCriteria.species}&breed=${searchCriteria.breed}&age=${searchCriteria.age}&gender=${searchCriteria.gender}`;
  };

  const navigateToRegister = () => {
    navigate("/register");
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
              <button className='button button-primary' type="submit">Login</button>
              <button className='button button-primary' type="button" onClick={navigateToRegister}>Register</button>
            </form>
          )}
          {error && <div className="error-message">{error}</div>}
        </div>
        <div className="intro-text">
          <p>Find your perfect pet companion here!</p>
          <p>We connect pet owners with potential adopters.</p>
        </div>
        <div className="search-pets">
          <h2>Search Available Pets</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="Name"
              value={searchCriteria.petname}
              onChange={(e) => setSearchCriteria({ ...searchCriteria, petname: e.target.value })}
            />
            <select
              value={searchCriteria.species}
              onChange={(e) => setSearchCriteria({ ...searchCriteria, species: e.target.value })}
              placeholder="Species"
            >
              <option value="" disabled>Species</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="reptiles">Reptiles</option>
              <option value="birds">Birds</option>
              <option value="small mammals">Small mammals</option>
            </select>
            <input
              type="text"
              placeholder="Breed"
              value={searchCriteria.breed}
              onChange={(e) => setSearchCriteria({ ...searchCriteria, breed: e.target.value })}
            />
            <input
              type="text"
              placeholder="Age"
              value={searchCriteria.age}
              onChange={(e) => setSearchCriteria({ ...searchCriteria, age: e.target.value })}
            />
            <select
              value={searchCriteria.gender}
              onChange={(e) => setSearchCriteria({ ...searchCriteria, gender: e.target.value })}
              placeholder="Gender"
            >
              <option value="" disabled>Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <button className='button button-secondary' onClick={handleSearch}>Search</button>
          </div>
        </div>
        <div className="pets-list">
          <h2>Featured Pets</h2>
          {featuredPets.map((pet) => (
            <Link to={`/pets/${pet.pet_id}`} key={pet.pet_id}>
              <div className="pet-card">
                <img src={pet.image_url} alt={pet.petname} className="pet-image" />
                <h3>{pet.petname}</h3>
                <p>{pet.breed}</p>
                <p>{pet.gender}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
