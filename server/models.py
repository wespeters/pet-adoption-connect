from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from extensions import db
from sqlalchemy import Boolean, Column, Integer, String, ForeignKey, DateTime, TIMESTAMP, func
from flask_login import UserMixin
from sqlalchemy.orm import validates
from datetime import datetime
from urllib.parse import urlparse
import re

class User(db.Model, SerializerMixin, UserMixin):
    __tablename__ = 'users'
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String)
    password = Column(String)
    email = Column(String)
    role = Column(String)
    contactinfo = Column(String)
    organization_id = Column(Integer, ForeignKey('organizations.organization_id'))
    organization = db.relationship('Organization', backref='users', foreign_keys=[organization_id])
    authenticated = Column(Boolean, default=False)

    serialize_rules = (
        '-organization.users',
    )

    @validates('username')
    def validate_username(self, key, username):
        assert 5 <= len(username) <= 20, "Username must be between 5 and 20 characters long."
        return username

    @validates('password')
    def validate_password(self, key, password):
        assert len(password) >= 8, "Password must be at least 8 characters long."
        assert re.search("[A-Z]", password), "Password must contain at least one uppercase letter."
        assert re.search("[a-z]", password), "Password must contain at least one lowercase letter."
        assert re.search("[0-9]", password), "Password must contain at least one number."
        return password
    
    @validates('role')
    def validate_role(self, key, role):
        assert role in ['owner', 'adopter'], "Role must be either 'owner' or 'adopter'."
        return role

    def is_active(self):
        return True

    def is_authenticated(self):
        return self.authenticated

    def is_anonymous(self):
        return False

    def get_id(self):
        return self.user_id

class Pet(db.Model, SerializerMixin):
    __tablename__ = 'pets'
    pet_id = Column(Integer, primary_key=True, autoincrement=True)
    petname = Column(String)
    species = Column(String)
    breed = Column(String)
    age = Column(String)
    gender = Column(String)
    medical_conditions = Column(String)
    status = Column(String)
    image_url = Column(String)
    owner_id = Column(Integer, ForeignKey('users.user_id'))
    owner = db.relationship('User', backref='pets')  # Added this line
    organization_id = Column(Integer, ForeignKey('organizations.organization_id'))

    serialize_rules = (
        '-owner',
        '-organization.pets',
    )

    # ... rest of the class definition ...


    @validates('species')
    def validate_species(self, key, species):
        assert species in ['dog', 'cat', 'reptiles', 'birds', 'small mammals'], "Species must be one of 'dog', 'cat', 'reptiles', 'birds', or 'small mammals'."
        return species

    @validates('gender')
    def validate_gender(self, key, gender):
        assert gender in ['Male', 'Female'], "Gender must be either 'Male' or 'Female'."
        return gender

    @validates('image_url')
    def validate_image_url(self, key, image_url):
        parsed_url = urlparse(image_url)
        assert bool(parsed_url.scheme) and bool(parsed_url.netloc), "Invalid URL format for image."
        return image_url
    
    def to_dict_with_owner_username(self):
        data = self.to_dict()  # Serialize using existing rules
        data['owner_username'] = self.owner.username if self.owner else "Unknown"  # Add owner's username
        return data

class Message(db.Model, SerializerMixin):
    __tablename__ = 'messages'
    message_id = Column(Integer, primary_key=True, autoincrement=True)
    sender_id = Column(Integer, ForeignKey('users.user_id'))
    receiver_id = Column(Integer, ForeignKey('users.user_id'))
    content = Column(String)
    time = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    def to_dict_with_usernames(self):
        sender = User.query.get(self.sender_id)
        receiver = User.query.get(self.receiver_id)
        return {
            'message_id': self.message_id,
            'sender_username': sender.username if sender else "Unknown",
            'receiver_username': receiver.username if receiver else "Unknown",
            'content': self.content,
            'time': self.time.isoformat() if self.time else None
        }


    serialize_rules = (
        '-sender.organization',
        '-receiver.organization',
    )

class Appointment(db.Model, SerializerMixin):
    __tablename__ = 'appointments'
    appointment_id = Column(Integer, primary_key=True, autoincrement=True)
    pet_id = Column(String, ForeignKey('pets.pet_id'))
    adopter_id = Column(Integer, ForeignKey('users.user_id'))
    date_time = Column(DateTime, nullable=True)
    status = Column(String)

    serialize_rules = (
        '-adopter.organization',
    )

class Organization(db.Model, SerializerMixin):
    __tablename__ = 'organizations'
    organization_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    contact_info = Column(String)
    description = Column(String)
    location = Column(String)
    website = Column(String)
    admin_id = Column(Integer, ForeignKey('users.user_id'))  
    pets = db.relationship('Pet', backref='organization', lazy=True)

    serialize_rules = (
        '-admin.organization',
        '-pets.organization',
    )  

class AppResource(db.Model, SerializerMixin):
    __tablename__ = 'resources'
    resource_id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String)
    content = Column(String)
    author = Column(String)
    category = Column(String)
    created_at = Column(TIMESTAMP)

