import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Post({ loggedInUser }) {
    const [formValues, setFormValues] = useState({
        petname: '',
        species: '',
        breed: '',
        age: '',
        gender: '',
        medical_conditions: '',
        image_url: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prevValues => ({
            ...prevValues,
            [name]: value
        }));
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newPet = {
            ...formValues,
            owner_id: loggedInUser.user_id,
            status: 'Available',
            organization_id: null
        };

        try {
            const response = await axios.post('http://localhost:5555/pets', newPet);
            alert('Pet posted successfully!');
            navigate(`/pets/${response.data.pet_id}`);
        } catch (err) {
            console.error('Error posting pet:', err);
            alert('An error occurred while posting the pet. Please try again.');
        }
    };

    return (
        <div className="container">
            <h2>Post a New Pet</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="petname" placeholder="Pet's Name" required onChange={handleChange} />
                <select name="species" value={formValues.species} required onChange={handleChange}>
                    <option value="" disabled>Species</option>
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="reptiles">Reptiles</option>
                    <option value="birds">Birds</option>
                    <option value="small mammals">Small mammals</option>
                </select>
                <input type="text" name="breed" placeholder="Breed" required onChange={handleChange} />
                <input type="text" name="age" placeholder="Age" required onChange={handleChange} />
                <select name="gender" value={formValues.gender} onChange={handleChange}>
                    <option value="" disabled>Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>

                <textarea
                    name="medical_conditions"
                    placeholder="Medical Conditions (enter 'None' if none)"
                    required
                    onChange={handleChange}
                />
                <input type="text" name="image_url" placeholder="Photo of your pet (paste image URL here):" required onChange={handleChange} />
                <button className="button button-secondary" type="submit">Submit</button>
            </form>
        </div>
    );
}

export default Post;
