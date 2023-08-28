import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

function Messages({ loggedInUser }) {
  const [inbox, setInbox] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [content, setContent] = useState("");
  const [recipient, setRecipient] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  
  // Create a reference for the compose container
  const composeContainerRef = useRef(null);

  const [searchParams] = useSearchParams();
  const recipientParam = searchParams.get("recipient");

  useEffect(() => {
    if (recipientParam) {
      setRecipient(recipientParam);
      setShowCompose(true);
    }

    if (loggedInUser) {
      axios
        .get(`http://localhost:5555/messages?receiver_id=${loggedInUser.user_id}`)
        .then((response) => setInbox(response.data));

      axios
        .get(`http://localhost:5555/messages?sender_id=${loggedInUser.user_id}`)
        .then((response) => setSentMessages(response.data));
    }
  }, [loggedInUser, recipientParam]);

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
          console.error("Error sending message:", error.response.data.message);
        });
    } else {
    }
  };

  const handleCompose = () => {
    setShowCompose(true);
  };

  const handleReply = (sender) => {
    setRecipient(sender ? sender : "");
    setShowCompose(true);
    if (composeContainerRef.current) {
      composeContainerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      window.scrollTo(0, 0);
    }
  };
  
  if (!loggedInUser) {
    return <div>You must be logged in to use this feature.</div>;
  }

  const handleDeleteMessage = (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      axios
        .delete(`http://localhost:5555/messages/${messageId}`)
        .then(() => {
          setInbox(inbox.filter((message) => message.message_id !== messageId));
          alert('Message deleted successfully!');
        })
        .catch((error) => {
          console.error("Error deleting message:", error);
          alert('An error occurred while deleting the message. Please try again.');
        });
    }
  };

  return (
    <div className="container">
      <button className="button button-secondary" onClick={handleCompose}>Compose a new message</button>
      {/* Attached the ref to this div */}
      {showCompose && (
        <div className="compose-container" ref={composeContainerRef}>
          <input
            className="input" 
            type="text"
            placeholder="Recipient Username"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <textarea
            className="message-content-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Message Content"
          ></textarea>
          <button className="button button-secondary" onClick={() => sendMessage(recipient)}>Send</button>
        </div>
      )}

      <h2>Inbox</h2>
      <div className="message-container">
        {inbox.map((message) => (
          <div key={message.message_id} className="message">
            <p>From: {message.sender_username}</p>
            <p>{message.content}</p>
            <button className="button button-secondary" onClick={() => handleReply(message.sender_username)}>Reply</button>
            <button className="button button-secondary" onClick={() => handleDeleteMessage(message.message_id)}>Delete</button>
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
