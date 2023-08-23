#!/usr/bin/env python3

from flask import Flask, request
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api, Resource
from datetime import datetime
from sqlalchemy.exc import IntegrityError
from sqlalchemy.sql.expression import func
from sqlalchemy import or_
from config import *
from extensions import db
from models import *

app = Flask(__name__)
app.config.from_object('config')

db.init_app(app)
migrate = Migrate(app, db)
api = Api(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


@app.route('/')
def index():
    return '<h1>Pet Adoption Connect Server</h1>'

class Users(Resource):
    def get(self, id=None):
        if id:
            user = User.query.get_or_404(id)
            return user.to_dict(), 200
        else:
            users = User.query.all()
            return [user.to_dict() for user in users], 200

    def post(self):
        data = request.get_json()
        user = User(**data)
        db.session.add(user)
        db.session.commit()
        return user.to_dict(), 201

    def patch(self, id):
        user = User.query.get_or_404(id)
        data = request.get_json()
        for key, value in data.items():
            setattr(user, key, value)
        db.session.commit()
        return user.to_dict()

    def delete(self, id):
        user = User.query.get_or_404(id)
        db.session.delete(user)
        db.session.commit()
        return '', 204
    
class UserLogin(Resource):
    def post(self):
        username = request.json.get('username')
        password = request.json.get('password')

        user = User.query.filter_by(username=username).first()

        if user and user.password == password:
            response = {
                'status': 'success',
                'message': 'Login successful',
                'user': {
                    'username': user.username,
                    'role': user.role,
                    'user_id': user.user_id
                }
            }
            return response, 200
        else:
            response = {
                'status': 'error',
                'message': 'Invalid username or password'
            }
            return response, 401
        
class UserByUsername(Resource):
    def get(self, username):
        user = User.query.filter_by(username=username).first_or_404()
        return {'user_id': user.user_id}, 200

class Pets(Resource):
    def get(self, id=None):
        if id:
            pet = Pet.query.get_or_404(id)
            return pet.to_dict(), 200
        else:
            pets = Pet.query.all()
            return [pet.to_dict() for pet in pets], 200

    def post(self):
        try:
            data = request.get_json()
            pet = Pet(**data)
            db.session.add(pet)
            db.session.commit()
            return pet.to_dict(), 201
        except AssertionError as e:
            return {"status": "error", "message": str(e)}, 400
        except IntegrityError:
            db.session.rollback()
            return {"status": "error", "message": "An error occurred while saving the pet."}, 500

    def patch(self, id):
        try:
            pet = Pet.query.get_or_404(id)
            data = request.get_json()
            for key, value in data.items():
                setattr(pet, key, value)
            db.session.commit()
            return pet.to_dict()
        except AssertionError as e:
            return {"status": "error", "message": str(e)}, 400
        except IntegrityError:
            db.session.rollback()
            return {"status": "error", "message": "An error occurred while updating the pet."}, 500

    def delete(self, id):
        pet = Pet.query.get_or_404(id)
        db.session.delete(pet)
        db.session.commit()
        return '', 204

class AvailablePets(Resource):
    def get(self):
        try:
            pets = Pet.query.filter_by(status='Available').all()
            return [pet.to_dict() for pet in pets], 200
        except Exception as e:
            app.logger.error(f"An error occurred while fetching available pets: {str(e)}")
            return {"message": "An error occurred while fetching available pets"}, 500
        
class SearchPets(Resource):
    def get(self):
        try:
            petname = request.args.get('petname', '').strip().lower()
            species = request.args.get('species', '').strip().lower()
            breed = request.args.get('breed', '').strip().lower()
            age = request.args.get('age', '').strip().lower()
            gender = request.args.get('gender', '').strip()

            query = Pet.query.filter_by(status='Available')

            filters = []
            if petname:
                filters.append(Pet.petname.ilike(f"%{petname}%"))
            if species:
                filters.append(Pet.species.ilike(f"%{species}%"))
            if breed:
                filters.append(Pet.breed.ilike(f"%{breed}%"))
            if age:
                filters.append(Pet.age.ilike(f"%{age}%"))
            if gender:
                filters.append(Pet.gender == gender)

            if filters:
                query = query.filter(or_(*filters))

            pets = query.all()
            return [pet.to_dict() for pet in pets], 200
        except Exception as e:
            app.logger.error(f"An error occurred while fetching search results: {str(e)}")
            return {"message": "An error occurred while fetching search results"}, 500

class FeaturedPets(Resource):
    def get(self):
        try:
            pets = Pet.query.filter_by(status='Available').order_by(func.random()).limit(4).all()
            return [pet.to_dict() for pet in pets], 200
        except Exception as e:
            app.logger.error(f"An error occurred while fetching featured pets: {str(e)}")
            return {"message": "An error occurred while fetching featured pets"}, 500

class Messages(Resource):
    def get(self, id=None):
        sender_id = request.args.get('sender_id')
        receiver_id = request.args.get('receiver_id')

        if sender_id:
            messages = Message.query.filter_by(sender_id=sender_id).all()
        elif receiver_id:
            messages = Message.query.filter_by(receiver_id=receiver_id).all()
        else:
            messages = Message.query.all()

        return [message.to_dict_with_usernames() for message in messages], 200


    def post(self):
        data = request.get_json()
        print("Received data:", data)

        required_keys = ['sender_id', 'receiver_id', 'content']
        for key in required_keys:
            if key not in data:
                return {'message': f'Missing required field: {key}'}, 400

        sender_id = data['sender_id']
        receiver_id = data['receiver_id']
        content = data['content']
        message = Message(sender_id=sender_id, receiver_id=receiver_id, content=content)
        db.session.add(message)
        db.session.commit()
        return message.to_dict(), 201

    def patch(self, id):
        message = Message.query.get_or_404(id)
        data = request.get_json()
        for key, value in data.items():
            setattr(message, key, value)
        db.session.commit()
        return message.to_dict()

    def delete(self, id):
        message = Message.query.get_or_404(id)
        db.session.delete(message)
        db.session.commit()
        return 'message deleted', 204

class Appointments(Resource):
    def get(self, id=None):
        if id:
            appointment = Appointment.query.get_or_404(id)
            return appointment.to_dict(), 200
        else:
            appointments = Appointment.query.all()
            return [appointment.to_dict() for appointment in appointments], 200

    def post(self):
        data = request.get_json()
        
        if 'date_time' in data:
            data['date_time'] = datetime.strptime(data['date_time'], "%Y-%m-%dT%H:%M")
        
        appointment = Appointment(**data)
        db.session.add(appointment)
        db.session.commit()
        return appointment.to_dict(), 201

    def patch(self, id):
        appointment = Appointment.query.get_or_404(id)
        data = request.get_json()
        for key, value in data.items():
            setattr(appointment, key, value)
        db.session.commit()
        return appointment.to_dict()

    def delete(self, id):
        appointment = Appointment.query.get_or_404(id)
        db.session.delete(appointment)
        db.session.commit()
        return '', 204

class Organizations(Resource):
    def get(self, id=None):
        if id:
            organization = Organization.query.get_or_404(id)
            return organization.to_dict(), 200
        else:
            organizations = Organization.query.all()
            return [organization.to_dict() for organization in organizations], 200

    def post(self):
        data = request.get_json()
        organization = Organization(**data)
        db.session.add(organization)
        db.session.commit()
        return organization.to_dict(), 201

    def patch(self, id):
        organization = Organization.query.get_or_404(id)
        data = request.get_json()
        for key, value in data.items():
            setattr(organization, key, value)
        db.session.commit()
        return organization.to_dict()

    def delete(self, id):
        organization = Organization.query.get_or_404(id)
        db.session.delete(organization)
        db.session.commit()
        return '', 204


class Resources(Resource):
    def get(self, id=None):
        if id:
            resource = AppResource.query.get_or_404(id)
            return resource.to_dict(), 200
        else:
            resources = AppResource.query.all()
            return [resource.to_dict() for resource in resources], 200

    def post(self):
        data = request.get_json()
        resource = AppResource(**data)
        db.session.add(resource)
        db.session.commit()
        return resource.to_dict(), 201

    def patch(self, id):
        resource = AppResource.query.get_or_404(id)
        data = request.get_json()
        for key, value in data.items():
            setattr(resource, key, value)
        db.session.commit()
        return resource.to_dict()

    def delete(self, id):
        resource = AppResource.query.get_or_404(id)
        db.session.delete(resource)
        db.session.commit()
        return '', 204


# Add the resources to the API
api.add_resource(Users, '/users', '/users/<int:id>')
api.add_resource(UserLogin, '/users/login')
api.add_resource(UserByUsername, '/users/username/<string:username>')
api.add_resource(Pets, '/pets', '/pets/<int:id>')
api.add_resource(AvailablePets, '/pets/available')
api.add_resource(FeaturedPets, '/pets/featured')
api.add_resource(SearchPets, '/pets/search')
api.add_resource(Messages, '/messages', '/messages/<int:id>')
api.add_resource(Appointments, '/appointments', '/appointments/<int:id>')
api.add_resource(Organizations, '/organizations', '/organizations/<int:id>')
api.add_resource(Resources, '/resources', '/resources/<int:id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
