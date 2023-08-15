from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from config import db
from sqlalchemy import Boolean, Column, Integer, String, ForeignKey, DateTime, TIMESTAMP
from flask_login import Usermixin

class User(db.Model, SerializerMixin, Usermixin):
    __tablename__ = 'users'
    user_id = Column(Integer, primary_key=True)
    username = Column(String)
    password = Column(String)
    email = Column(String)
    role = Column(String)
    contactinfo = Column(String)
    organization_id = Column(Integer, ForeignKey('organizations.organization_id'))
    organization = db.relationship('Organization', backref='users')
    authenticated = Column(Boolean, default=False)

    def is_active(self):
        return True

    def is_authenticated(self):
        return self.authenticated

    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.user_id)

class Pet(db.Model, SerializerMixin):
    __tablename__ = 'pets'
    pet_id = Column(String, primary_key=True)
    petname = Column(String)
    species = Column(String)
    breed = Column(String)
    age = Column(String)
    gender = Column(String)
    medical_conditions = Column(String)
    status = Column(String)
    owner_id = Column(Integer, ForeignKey('users.user_id'))
    organization_id = Column(Integer, ForeignKey('organizations.organization_id'))

class Message(db.Model, SerializerMixin):
    __tablename__ = 'messages'
    message_id = Column(String, primary_key=True)
    sender_id = Column(Integer, ForeignKey('users.user_id'))
    receiver_id = Column(Integer, ForeignKey('users.user_id'))
    content = Column(String)
    time = Column(TIMESTAMP)

class Appointment(db.Model, SerializerMixin):
    __tablename__ = 'appointments'
    appointment_id = Column(String, primary_key=True)
    pet_id = Column(String, ForeignKey('pets.pet_id'))
    adopter_id = Column(Integer, ForeignKey('users.user_id'))
    date_time = Column(DateTime)
    status = Column(String)

class Organization(db.Model, SerializerMixin):
    __tablename__ = 'organizations'
    organization_id = Column(Integer, primary_key=True)
    name = Column(String)
    contact_info = Column(String)
    description = Column(String)
    location = Column(String)
    website = Column(String)
    admin_id = Column(Integer, ForeignKey('users.user_id'))  
    pets = db.relationship('Pet', backref='organization', lazy=True)  

class Resource(db.Model, SerializerMixin):
    __tablename__ = 'resources'
    resource_id = Column(Integer, primary_key=True)
    title = Column(String)
    content = Column(String)
    author = Column(String)
    category = Column(String)  # E.g., "adoption tips," "preparation guide," etc.
    created_at = Column(TIMESTAMP)

