import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

function Search() {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const queryParams = new URLSearchParams(location.search);

  const [searchCriteria, setSearchCriteria] = useState({
    petname: queryParams.get('petname') || "",
    species: queryParams.get('species') || "",
    breed: queryParams.get('breed') || "",
    age: queryParams.get('age') || "",
    gender: queryParams.get('gender') || "",
  });

  const handleSearch = () => {
    window.location.href = `/search?petname=${searchCriteria.petname}&species=${searchCriteria.species}&breed=${searchCriteria.breed}&age=${searchCriteria.age}&gender=${searchCriteria.gender}`;
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5555/pets/search`, { params: searchCriteria })
      .then((response) => setSearchResults(response.data))
      .catch((error) => console.error("Error fetching search results:", error));
  }, [location.search]);

  return (
    <div className="pets-list">
      <h2>Search Available Pets</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Name"
          value={searchCriteria.petname}
          onChange={(e) => setSearchCriteria({ ...searchCriteria, petname: e.target.value })}
        />
        <input
          type="text"
          placeholder="Species"
          value={searchCriteria.species}
          onChange={(e) => setSearchCriteria({ ...searchCriteria, species: e.target.value })}
        />
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
          <option value="" disabled selected>Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <p><button className='task-button' onClick={handleSearch}>Search</button></p>
      </div>
      <h3>Search Results</h3>
      {searchResults.length > 0 ? (
        searchResults.map((pet) => (
          <Link to={`/pets/${pet.pet_id}`} key={pet.pet_id}>
            <div className="pet-card">
              <img src={pet.image_url} alt={pet.petname} />
              <h3>{pet.petname}</h3>
              <p>{pet.breed}</p>
              <p>{pet.gender}</p>
            </div>
          </Link>
        ))
      ) : (
        <p>There are no available pets that match your search criteria.</p>
      )}
    </div>
  );  
}

export default Search;
