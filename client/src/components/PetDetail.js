import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function PetDetail({ loggedInUser }) {
  const [pet, setPet] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [updateValues, setUpdateValues] = useState({});
  const { id } = useParams(); // Destructure id from useParams

  useEffect(() => {
    // Use id directly here
    axios.get(`http://localhost:5555/pets/${id}`).then((response) => {
      setPet(response.data);
    });
  }, [id]); // Add id as a dependency

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5555/pets/${id}`, updateValues);
      alert('Pet updated successfully!');
      setIsEditing(false);
      // Refresh pet details
      axios.get(`http://localhost:5555/pets/${id}`).then((response) => {
        setPet(response.data);
      });
    } catch (err) {
      console.error('Error updating pet:', err);
      alert('An error occurred while updating the pet. Please try again.');
    }
  };

  const navigate = useNavigate();
  
  const handleDeletePet = async () => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        await axios.delete(`http://localhost:5555/pets/${id}`);
        alert('Pet deleted successfully!');
        navigate('/');
      } catch (err) {
        console.error('Error deleting pet:', err);
        alert('An error occurred while deleting the pet. Please try again.');
      }
    }
  };

  return (
    <div className="container">
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
      {loggedInUser && loggedInUser.user_id === pet.owner_id && !isEditing && (
        <>
          <button onClick={() => setIsEditing(true)}>Update Pet Details</button>
          <button onClick={handleDeletePet}>Delete Pet</button> {/* Delete Pet button */}
        </>
      )}
      {isEditing && (
        <form onSubmit={handleUpdateSubmit}>
          <input type="text" name="petname" placeholder="Pet's Name" defaultValue={pet.petname} onChange={handleUpdateChange} />
          <input type="text" name="status" placeholder="Status" defaultValue={pet.status} onChange={handleUpdateChange} />
          {/* Add other input fields as needed */}
          <button type="submit">Submit</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
}

export default PetDetail;
