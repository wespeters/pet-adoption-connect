import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Messages({ loggedInUser }) {
  const [inbox, setInbox] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [content, setContent] = useState("");
  const [recipient, setRecipient] = useState("");
  const [showCompose, setShowCompose] = useState(false);

  useEffect(() => {
    if (loggedInUser) {
      axios
        .get(`http://localhost:5555/messages?receiver_id=${loggedInUser.user_id}`)
        .then((response) => setInbox(response.data));

      axios
        .get(`http://localhost:5555/messages?sender_id=${loggedInUser.user_id}`)
        .then((response) => setSentMessages(response.data));
    }
  }, [loggedInUser]);

  const getUserIdByUsername = (username) => {
    return axios
      .get(`http://localhost:5555/users/username/${username}`)
      .then((response) => response.data.user_id)
      .catch((error) => {
        console.error("Error fetching user ID by username:", error);
        return null;
      });
  };


  const sendMessage = async (recipientUsername) => {
    console.log('Logged-in user:', loggedInUser);
    const receiverId = await getUserIdByUsername(recipientUsername);
    if (receiverId) {
      axios.post(`http://localhost:5555/messages`, {
        sender_id: loggedInUser.user_id,
        receiver_id: receiverId,
        content: content,
      })
        .then(() => {
          setContent("");
          setRecipient("");
          setShowCompose(false);
        })
        .catch((error) => {
          // Handle the error and display the message
          console.error("Error sending message:", error.response.data.message);
        });
    } else {
      // Handle error (e.g., show an error message)
    }
  };


  const handleCompose = () => {
    setShowCompose(true);
  };

  const handleReply = (sender) => {
    setRecipient(sender ? sender : "");
    setShowCompose(true);
  };

  if (!loggedInUser) {
    return <div>You must be logged in to use this feature.</div>;
  }

  return (
    <div className="container">
      <button onClick={handleCompose}>Compose a new message</button>
      {showCompose && (
  <div className="compose-container">
    <input
      type="text"
      placeholder="Recipient Username"
      value={recipient}
      onChange={(e) => setRecipient(e.target.value)}
    />
    <textarea
      className="message-content-textarea" // Add a specific class to this textarea
      value={content}
      onChange={(e) => setContent(e.target.value)}
      placeholder="Message Content"
    ></textarea>
    <button onClick={() => sendMessage(recipient)}>Send</button>
  </div>
)}

      <h2>Inbox</h2>
      <div className="message-container">
        {inbox.map((message) => (
          <div key={message.message_id} className="message">
            <p>From: {message.sender_username}</p>
            <p>{message.content}</p>
            <button onClick={() => handleReply(message.sender_username)}>Reply</button>
          </div>
        ))}
      </div>
      <h2>Sent Messages</h2>
      <div className="message-container">
        {sentMessages.map((message) => (
          <div key={message.message_id} className="message">
            <p>To: {message.receiver_username}</p>
            <p>{message.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
  
}

export default Messages;
