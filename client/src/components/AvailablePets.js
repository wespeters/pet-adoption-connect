import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import the Link component

function AvailablePets() {
  const [availablePets, setAvailablePets] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5555/pets/available`)
      .then((response) => setAvailablePets(response.data))
      .catch((error) => console.error("Error fetching available pets:", error));
  }, []);

  return (
    <div className="container">
      <h2>Available Pets</h2>
      <div className="available-pets-container">
        {availablePets.map((pet) => (
          <Link to={`/pets/${pet.pet_id}`} key={pet.pet_id}> {/* Wrap pet card inside Link */}
            <div className="pet-card">
              <img src={pet.image_url} alt={pet.petname} />
              <p>Name: {pet.petname}</p>
              <p>Species: {pet.species}</p>
              <p>Breed: {pet.breed}</p>
              <p>Age: {pet.age}</p>
              <p>Gender: {pet.gender}</p>
              <p>Status: {pet.status}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AvailablePets;
