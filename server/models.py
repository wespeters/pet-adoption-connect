from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from extensions import db
from sqlalchemy import Boolean, Column, Integer, String, ForeignKey, DateTime, TIMESTAMP, func
from flask_login import UserMixin
from sqlalchemy.orm import validates
from datetime import datetime
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
        '-organization.users',  # Exclude users from the organization during serialization
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
    organization_id = Column(Integer, ForeignKey('organizations.organization_id'))

    serialize_rules = (
        '-owner.organization', # Exclude organization from the owner during serialization
        '-organization.pets',  # Exclude pets from the organization during serialization
    )

class Message(db.Model, SerializerMixin):
    __tablename__ = 'messages'
    message_id = Column(Integer, primary_key=True, autoincrement=True)
    sender_id = Column(Integer, ForeignKey('users.user_id'))
    receiver_id = Column(Integer, ForeignKey('users.user_id'))
    content = Column(String)
    time = Column(DateTime, default=datetime.utcnow, nullable=False)

    serialize_rules = (
        '-sender.organization',  # Exclude organization from the sender during serialization
        '-receiver.organization', # Exclude organization from the receiver during serialization
    )

class Appointment(db.Model, SerializerMixin):
    __tablename__ = 'appointments'
    appointment_id = Column(Integer, primary_key=True, autoincrement=True)
    pet_id = Column(String, ForeignKey('pets.pet_id'))
    adopter_id = Column(Integer, ForeignKey('users.user_id'))
    date_time = Column(DateTime, nullable=True)
    status = Column(String)

    serialize_rules = (
        '-adopter.organization', # Exclude organization from the adopter during serialization
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
        '-admin.organization', # Exclude organization from the admin during serialization
        '-pets.organization',   # Exclude organization from the pets during serialization
    )  

class AppResource(db.Model, SerializerMixin):
    __tablename__ = 'resources'
    resource_id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String)
    content = Column(String)
    author = Column(String)
    category = Column(String)  # E.g., "adoption tips," "preparation guide," etc.
    created_at = Column(TIMESTAMP)

