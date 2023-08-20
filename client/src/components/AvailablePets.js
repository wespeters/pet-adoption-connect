import React, { useState, useEffect } from "react";
import axios from "axios";

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
          <div key={pet.pet_id} className="pet-card">
            <img src={pet.image_url} alt={pet.petname} />
            <p>Name: {pet.petname}</p>
            <p>Species: {pet.species}</p>
            <p>Breed: {pet.breed}</p>
            <p>Age: {pet.age}</p>
            <p>Gender: {pet.gender}</p>
            <p>Medical Conditions: {pet.medical_conditions}</p>
            <p>Status: {pet.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AvailablePets;
