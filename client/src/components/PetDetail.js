import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function PetDetail({ loggedInUser }) {
  const [pet, setPet] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [updateValues, setUpdateValues] = useState({});
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:5555/pets/${id}`).then((response) => {
      setPet(response.data);
    });
  }, [id]);

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

  const handleSendMessageToOwner = () => {
    if (pet.owner_username) {
      navigate(`/messages/compose?recipient=${pet.owner_username}`);
    } else {
      console.error('Owner information is not available');
    }    
  };  

  return (
    <div className="container">
      <div className="pet-detail">
        <img src={pet.image_url} alt={pet.petname} className="pet-image" />
        <h2>{pet.petname}</h2>
        <p>Species: {pet.species}</p>
        <p>Breed: {pet.breed}</p>
        <p>Age: {pet.age}</p>
        <p>Gender: {pet.gender}</p>
        <p>Medical Conditions: {pet.medical_conditions}</p>
        <p>Status: {pet.status}</p>
        <p>Owner: {pet.owner_username || "Unknown"}</p>
      </div>
      
      {loggedInUser && loggedInUser.role === "adopter" && (
        <button className=" button button-secondary" onClick={handleSendMessageToOwner}>Send Message to Owner</button>
      )}

      {loggedInUser && loggedInUser.user_id === pet.owner_id && !isEditing && (
        <>
          <button className="button button-secondary" onClick={() => setIsEditing(true)}>Update Pet Details</button>
          <button className="button button-secondary" onClick={handleDeletePet}>Delete Pet</button>
        </>
      )}
      {isEditing && (
        <form onSubmit={handleUpdateSubmit}>
          <input type="text" name="petname" placeholder="Pet's Name" defaultValue={pet.petname} onChange={handleUpdateChange} />
          <select name="species" defaultValue={pet.species} onChange={handleUpdateChange}>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="reptiles">Reptiles</option>
            <option value="birds">Birds</option>
            <option value="small mammals">Small mammals</option>
          </select>
          <select name="status" defaultValue={pet.status} onChange={handleUpdateChange}>
            <option value="Available">Available</option>
            <option value="Adopted">Adopted</option>
          </select>
          <p><label htmlFor="medical_conditions">Medical Conditions:</label></p>
          <textarea
            name="medical_conditions"
            label="Medical Conditions"
            defaultValue={pet.medical_conditions}
            placeholder="Medical Conditions (enter 'None' if none)"
            required
            onChange={handleUpdateChange}
          />
          <button className="button button-secondary" type="submit">Submit</button>
          <button className="button button-secondary" type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
}

export default PetDetail;
