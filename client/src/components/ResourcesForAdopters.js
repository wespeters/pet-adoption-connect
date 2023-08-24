import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ResourcesForAdopters() {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5555/resources')
      .then(response => setResources(response.data))
      .catch(error => console.error('An error occurred while fetching resources:', error));
  }, []);

  return (
    <div className="container">
      <h1>Resources for Pet Adopters</h1>
      {resources.map(resource => (
        <Link to={`/resources/${resource.resource_id}`} key={resource.resource_id} className="resource-item">
          <h3>{resource.title}</h3>
          <div dangerouslySetInnerHTML={{ __html: resource.content }}/>
          <p><strong>Author:</strong> {resource.author}</p>
          <p><strong>Category:</strong> {resource.category}</p>
        </Link>
      ))}
    </div>
  );
}

export default ResourcesForAdopters;
