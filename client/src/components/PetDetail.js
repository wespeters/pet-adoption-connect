import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import useParams

function PetDetail() {
  const [pet, setPet] = useState({});
  const { id } = useParams(); // Destructure id from useParams

  useEffect(() => {
    // Use id directly here
    axios.get(`http://localhost:5555/pets/${id}`).then((response) => {
      setPet(response.data);
    });
  }, [id]); // Add id as a dependency

  return (
    <div className="pet-detail">
      <img src={pet.image_url} alt={pet.petname} />
      <h2>{pet.petname}</h2>
      <p>Species: {pet.species}</p>
      <p>Breed: {pet.breed}</p>
      <p>Age: {pet.age}</p>
      <p>Gender: {pet.gender}</p>
      <p>Medical Conditions: {pet.medical_conditions}</p>
      <p>Status: {pet.status}</p>
      {/* Add more details as needed */}
    </div>
  );
}

export default PetDetail;
