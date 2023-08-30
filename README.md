# Pet Adoption Connect  - Capstone Project
---

## Introduction

Welcome to Pet Adoption Connect, your one-stop-shop where pet adopters can match with pet owners looking to rehome their furry friends. Our website is designed to make the process of adopting a pet as seamless and stress-free as possible.

## Installation

Use `pipenv install` to install the dependencies and create the environment to run the backend. `cd` into the `Server` folder and run `python app.py` to start the development server. The server will run on `http://127.0.0.1:5555`. 

Use `npm install` to install the dependencies for the frontend. Run `npm start` to start the client. You can view the client in the browser on `http://localhost:3000`. 

## User Stories
As a user, I want to be able to:

- register and login as an adopter or pet owner.
- search and filter through the available pets based on specific criteria, such as species and breed.
- use a messaging system that allows adopters to contact pet owners and vice versa.
-  if I am a pet owner, add, update, and delete information about my pets, and provide a status update when a pet has been adopted.
- view resources and information on pet adoption, including articles on how to prepare for a new pet, what to expect when adopting a pet, and tips for successful pet-parenting.

---

## Backend Structure and Code Description of Key Files

### Model Structure for SQLite Database

### `models.py`

This file is the model structure for the SQLite database using the SQLAlchemy ORM (Object 
Relational Mapping) in Python. Here is a breakdown of what it does:

### Import Statements
- Various modules and packages are imported to support SQLAlchemy ORM features, validations, and data types.

---

## Exception Class

### 1. `ValidationError`
- Custom exception class to handle validation errors.

---

## Model Classes

### 2. `User`

- **Columns**: Defines properties like `user_id`, `username`, `password`, etc. and their data types.
- **Relationship**: Establishes a foreign key relationship with `Organization`.
- **Validations**: Contains methods to validate `username`, `password`, `email`, and `role`.
- **Authentication**: Implements methods to support Flask-Login.

### 3. `Pet`

- **Columns**: Defines properties like `pet_id`, `petname`, `species`, etc. and their data types.
- **Relationship**: Establishes foreign key relationships with `User` and `Organization`.
- **Validations**: Contains methods to validate `species`, `gender`, and `image_url`.
- **Additional Method**: A method to convert the object to a dictionary and include the owner's username.

### 4. `Message`

- **Columns**: Defines properties like `message_id`, `sender_id`, `receiver_id`, etc. and their data types.
- **Additional Method**: A method to convert the object to a dictionary and include sender and receiver usernames.

### 5. `Appointment`

- **Columns**: Defines properties like `appointment_id`, `pet_id`, `adopter_id`, etc. and their data types.

### 6. `Organization`

- **Columns**: Defines properties like `organization_id`, `name`, `contact_info`, etc. and their data types.
- **Relationship**: Establishes a foreign key relationship with `User` and `Pet`.

### 7. `AppResource`

- **Columns**: Defines properties like `resource_id`, `title`, `content`, etc. and their data types.

### `app.py`

---

### Import Statements
- Various modules and packages are imported for functionalities like Flask web server, CORS, database migration, RESTful APIs, and configuration.

### Initialization
- The Flask application, database, migration, and RESTful API are initialized. CORS is set up for specific origins.

### Basic Route
- `@app.route('/')`: Defines the home page of the server, returning an HTML string.

---

## Resource Classes

### 1. Users Class
Manages CRUD operations for User entities.
- `get(self, id=None)`: Fetches a single user by ID or all users.
- `post(self)`: Creates a new user.
- `patch(self, id)`: Updates an existing user.
- `delete(self, id)`: Deletes a user.

### 2. UserLogin Class
Handles user login functionality.
- `post(self)`: Authenticates a user by username and password.

### 3. UserByUsername Class
Fetches a user by their username.
- `get(self, username)`: Retrieves a user by username.

### 4. Pets Class
Manages CRUD operations for Pet entities.
- `get(self, id=None)`: Fetches a single pet by ID or all pets.
- `post(self)`: Creates a new pet.
- `patch(self, id)`: Updates an existing pet.
- `delete(self, id)`: Deletes a pet.

### 5. AvailablePets Class
Fetches all available pets.
- `get(self)`: Retrieves all pets with the status 'Available'.

### 6. SearchPets Class
Performs a search among available pets.
- `get(self)`: Searches for pets based on various criteria like name, species, etc.

### 7. FeaturedPets Class
Fetches a random selection of available pets.
- `get(self)`: Retrieves a random set of 4 available pets.

### 8. Messages Class
Manages CRUD operations for Message entities.
- `get(self, id=None)`: Fetches messages by sender or receiver ID or all messages.
- `post(self)`: Creates a new message.
- `patch(self, id)`: Updates an existing message.
- `delete(self, id)`: Deletes a message.

### 9. Appointments Class
Manages CRUD operations for Appointment entities.
- `get(self, id=None)`: Fetches a single appointment by ID or all appointments.
- `post(self)`: Creates a new appointment.
- `patch(self, id)`: Updates an existing appointment.
- `delete(self, id)`: Deletes an appointment.

### 10. Organizations Class
Manages CRUD operations for Organization entities.
- `get(self, id=None)`: Fetches a single organization by ID or all organizations.
- `post(self)`: Creates a new organization.
- `patch(self, id)`: Updates an existing organization.
- `delete(self, id)`: Deletes an organization.

### 11. Resources Class
Manages CRUD operations for AppResource entities.
- `get(self, id=None)`: Fetches a single resource by ID or all resources.
- `post(self)`: Creates a new resource.
- `patch(self, id)`: Updates an existing resource.
- `delete(self, id)`: Deletes a resource.

---

### API Route Registration
- Endpoints for each resource class are registered with Flask-RESTful's `Api` object.

### Main Execution
- The Flask app is run on port 5555 with debugging enabled.

---

## Frontend Structure and Code Description of Key Files

### `App.js`

---

### Import Statements
- Various React hooks, components, and other utilities are imported.

---

## `App` Function Component

### Main Component in the React Application

- `const storedUser = sessionStorage.getItem('loggedInUser');`: Retrieves the logged-in user from the session storage.

- `useState(storedUser ? JSON.parse(storedUser) : null)`: Initializes `loggedInUser` state based on stored session data.

### `useEffect`

- `useEffect(() => {...}, [loggedInUser]);`: Syncs the `loggedInUser` state with session storage. It adds or removes the user from session storage whenever `loggedInUser` changes.

### `handleLogout`

- `const handleLogout = () => {...}`: Logs the user out by setting `loggedInUser` to `null` and removing it from session storage.

### JSX Return Statement

- `<DarkModeProvider>`: Provides dark mode context to all child components.

- `<BrowserRouter>`: Wraps all routes to enable client-side routing.

- `<NavBar loggedInUser={loggedInUser} handleLogout={handleLogout} />`: Renders the navigation bar.

- `<Routes>`: Contains all the application's routes.

  - **Home Route**: Displays the `Home` component. Passes `loggedInUser` and `setLoggedInUser` as props.
  
  - **Search Route**: Displays the `Search` component for pet searching.
  
  - **Pet Detail Route**: Displays the `PetDetail` component for individual pet details. Passes `loggedInUser` as a prop.
  
  - **Available Pets Route**: Displays the `AvailablePets` component listing all available pets.
  
  - **Messages Route**: Displays the `Messages` component for user messages. Passes `loggedInUser` as a prop.
  
  - **Resources Route**: Displays the `ResourcesForAdopters` component listing all resources for adopters.
  
  - **Resource Detail Route**: Displays the `ResourceDetail` component for individual resource details.
  
  - **Post Route**: Displays the `Post` component for creating posts. Passes `loggedInUser` as a prop.
  
  - **Register Route**: Displays the `Register` component for user registration.

---

### `NavBar.js`

---

### Import Statements

- The code imports React along with other necessary components and CSS files.

---

## `NavBar` Function Component

### Main Navigation Bar Component

- **Props**: Takes `loggedInUser` and `handleLogout` as props to manage login status and logout functionality.

### `handlePostNewPet`

- **Function**: A function that prevents non-owners from posting a new pet. It shows an alert if the condition is not met.

### JSX Return Statement

- `<div className="navbar">`: The main container for the navigation bar.

  - **Title Section**: Contains an `h1` element displaying the application name.
  
  - **Dark Mode Toggle**: Integrates the `DarkModeToggle` component for toggling dark mode.
  
  - **Navigation Links**: Provides a set of `Link` components for navigating through the application.
  
    - **Home**: Navigates to the home page.
    
    - **Post a New Pet**: Navigates to the pet posting page. The `handlePostNewPet` function is invoked when clicked.
    
    - **View All Available Pets**: Navigates to the page displaying all available pets.
    
    - **Resources for Pet Adopters**: Navigates to the resources page.
  
  - **Conditional Links**: Based on `loggedInUser`:
  
    - **If Logged In**: Displays the message inbox link and a logout button.
    
    - **If Not Logged In**: Displays a login/register link.

---

### `Home.js`

---

### Import Statements

- React hooks, Axios, and React Router functionalities are imported at the beginning of the file.

---

## `Home` Function Component

### Main Component for Home Page

- **Props**: Takes `loggedInUser` and `setLoggedInUser` as props to manage login status.

### `handleLogin`

- **Async Function**: Handles user login by making a POST request to the server and sets the logged-in user.

### `useState` and `useEffect` Hooks

- Multiple state variables (`username`, `password`, `error`, `featuredPets`, `searchCriteria`) are declared.
- An `useEffect` hook fetches the featured pets from the server.

### `handleSearch`

- **Function**: Handles the pet search by redirecting to the search page with the specified criteria.

### `navigateToRegister`

- **Function**: Navigates to the registration page using `useNavigate`.

### JSX Return Statement

- Main JSX structure containing various sections:

  - **Welcome Message**: A welcoming `h1` element.
  
  - **Login Section**: Conditionally renders login form or logged-in user details.
  
  - **Intro Text**: Contains promotional text for the application.
  
  - **Search Section**: Allows users to search for pets based on various criteria.
  
  - **Featured Pets**: Displays featured pets fetched from the server.

---

### `Register.js`

---

### Import Statements

- React hooks, Axios, and React Router functionalities are imported at the beginning of the file.

---

## `Register` Function Component

### Main Component for User Registration

- Initializes empty form data and error state variables using `useState`.

### `handleChange`

- **Function**: Manages the form field values, updating the state as the user types or selects options.

### `handleSubmit`

- **Async Function**: Handles the form submission by making a POST request to register a new user.

  - Redirects to the home page upon successful registration.
  
  - Sets an error message if registration fails.

### JSX Return Statement

- Main JSX structure containing:

  - **Registration Form**: A form with input fields for username, password, email, role selection, and contact information.
  
  - **Error Message**: Conditionally displays an error message if registration fails.

---

### `Post.js`

---

#### Imports

- `import React, { useState } from 'react';`
  - Importing the React library and the `useState` hook for state management.
  
- `import axios from 'axios';`
  - Importing the Axios library for making HTTP requests.
  
- `import { useNavigate } from 'react-router-dom';`
  - Importing the `useNavigate` hook from `react-router-dom` for programmatically navigating routes.

#### `function Post({ loggedInUser })`

- A functional React component for creating a new pet post. It receives `loggedInUser` as a prop to identify the owner of the pet.

##### `useState`

- Initializes the `formValues` state variable with an object to hold the form input values.

##### `handleChange(e)`

- Event handler function for form input changes. Updates the `formValues` state.

##### `useNavigate()`

- Utilizes the `useNavigate` hook to get the `navigate` function, enabling programmatic navigation.

##### `handleSubmit(e)`

- Asynchronous event handler function for form submission. Sends a POST request to create a new pet and navigates to the new pet's page if successful.

##### `return (...)`

- The JSX to render the pet posting form. Uses form elements and buttons to collect data from the user.

#### `export default Post;`

- Exports the `Post` component for use in other parts of the application.

---

### `PetDetail.js`

#### Imports

- `import React, { useState, useEffect } from "react";`
  - Imports the React library, along with the `useState` and `useEffect` hooks for state management and side-effects.

- `import axios from "axios";`
  - Imports the Axios library for making HTTP requests.

- `import { useParams, useNavigate } from "react-router-dom";`
  - Imports `useParams` and `useNavigate` hooks from `react-router-dom` for parameter extraction and navigation.

#### `function PetDetail({ loggedInUser })`

- A functional React component that displays details about a pet and provides options for updating or deleting the pet.

##### `useState`

- Initializes three state variables: `pet` for storing pet details, `isEditing` for toggling the editing mode, and `updateValues` for storing form updates.

##### `useParams()`

- Uses the `useParams` hook to extract the `id` parameter from the URL.

##### `useEffect()`

- A side-effect hook that fetches the pet details from the server when the component mounts or the `id` changes.

##### `handleUpdateChange(e)`

- An event handler for updating form fields. Modifies the `updateValues` state.

##### `handleUpdateSubmit(e)`

- An asynchronous function that handles the form submission for updating pet details.

##### `useNavigate()`

- Uses the `useNavigate` hook to get the `navigate` function for programmatic navigation.

##### `handleDeletePet()`

- An asynchronous function that deletes the pet if the user confirms the action.

##### `handleSendMessageToOwner()`

- A function to navigate to the message composing page to send a message to the pet owner.

##### `return (...)`

- The JSX code that renders the pet details and provides buttons for updating or deleting the pet.

#### `export default PetDetail;`

- Exports the `PetDetail` component for use in other parts of the application.

---

### `Search.js`

#### Imports

- `import React, { useState, useEffect } from "react";`
  - Imports the React library along with the `useState` and `useEffect` hooks for state management and side-effects.
  
- `import { useLocation } from "react-router-dom";`
  - Imports the `useLocation` hook from `react-router-dom` to access the current location object which contains information about the URL.
  
- `import axios from "axios";`
  - Imports the Axios library for making HTTP requests.
  
- `import { Link } from "react-router-dom";`
  - Imports the `Link` component from `react-router-dom` for client-side navigation.

#### `function Search()`

- A functional React component responsible for rendering a search form and displaying the search results for pets.

##### `useLocation()`

- Uses the `useLocation` hook to get the current URL location and extract query parameters.

##### `useState`

- Initializes two state variables: `searchResults` for storing the search results and `searchCriteria` for storing the search form's field values.

##### `handleSearch()`

- A function that updates the URL with the search parameters to trigger a new search.

##### `useEffect()`

- A side-effect hook that fires an Axios GET request to fetch the search results whenever the query string changes (`location.search`).

##### `return (...)`

- The JSX code that renders the search form and the list of pets that match the search criteria. It uses conditional rendering to display a message if no pets match the search criteria.

#### `export default Search;`

- Exports the `Search` component to be used in other parts of the application.

---

### `Messages.js` 

#### Imports

- `import React, { useState, useEffect, useRef } from "react";`
  - Imports the React library, along with hooks for state management (`useState`), side-effects (`useEffect`), and accessing DOM nodes (`useRef`).

- `import axios from "axios";`
  - Imports the Axios library for making HTTP requests.

- `import { useSearchParams } from "react-router-dom";`
  - Imports `useSearchParams` from `react-router-dom` to access the query parameters from the current URL.

#### `function Messages({ loggedInUser })`

- A functional React component for rendering the messaging interface. It receives `loggedInUser` as a prop.

##### `useState`

- Initializes state variables for inbox messages (`inbox`), sent messages (`sentMessages`), the message content (`content`), the recipient (`recipient`), and a flag for showing the compose form (`showCompose`).

##### `useRef`

- Creates a reference (`composeContainerRef`) to the compose container, allowing for scroll behavior control.

##### `useSearchParams`

- Uses `useSearchParams` to extract the "recipient" query parameter if present in the URL.

##### `useEffect`

- A side-effect hook that fetches inbox and sent messages for the logged-in user. It also sets the recipient and shows the compose form if a recipient parameter exists.

##### `getUserIdByUsername(username)`

- A helper function to fetch a user's ID by their username.

##### `sendMessage(recipientUsername)`

- An asynchronous function to send a message to a recipient.

##### `handleCompose()`

- A function to set the `showCompose` state to `true`, thus showing the compose form.

##### `handleReply(sender)`

- A function to set the recipient to the sender's username and show the compose form.

##### `handleDeleteMessage(messageId)`

- A function to delete a message based on its ID.

##### `return (...)`

- The JSX that renders the compose form, inbox, and sent messages. It uses conditional rendering to show messages or other UI components based on the state.

#### `export default Messages;`

- Exports the `Messages` component to be used in other parts of the application.

---

## License
MIT License

Copyright (c) [2023] [Wesley Peters]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
