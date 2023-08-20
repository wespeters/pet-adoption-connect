import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams

function ResourceDetail() {
  const [resource, setResource] = useState(null);

  // Destructure resource_id from the useParams hook
  const { resource_id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:5555/resources/${resource_id}`)
      .then(response => setResource(response.data))
      .catch(error => console.error('An error occurred while fetching the resource:', error));
  }, [resource_id]);

  if (!resource) return <div>Loading...</div>;

  return (
    <div className="resource-item">
      <h2>{resource.title}</h2>
      <p>{resource.content}</p>
      <p><strong>Author:</strong> {resource.author}</p>
      <p><strong>Category:</strong> {resource.category}</p>
    </div>
  );
}

export default ResourceDetail;
