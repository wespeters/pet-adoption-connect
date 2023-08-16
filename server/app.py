#!/usr/bin/env python3

from flask import Flask, request
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api, Resource
from config import *
from extensions import db
from models import *

app = Flask(__name__)
app.config.from_object('config')

db.init_app(app)
migrate = Migrate(app, db)
api = Api(app)
CORS(app)

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

class Pets(Resource):
    def get(self, id=None):
        if id:
            pet = Pet.query.get_or_404(id)
            return pet.to_dict(), 200
        else:
            pets = Pet.query.all()
            return [pet.to_dict() for pet in pets], 200

    def post(self):
        data = request.get_json()
        pet = Pet(**data)
        db.session.add(pet)
        db.session.commit()
        return pet.to_dict(), 201

    def patch(self, id):
        pet = Pet.query.get_or_404(id)
        data = request.get_json()
        for key, value in data.items():
            setattr(pet, key, value)
        db.session.commit()
        return pet.to_dict()

    def delete(self, id):
        pet = Pet.query.get_or_404(id)
        db.session.delete(pet)
        db.session.commit()
        return '', 204

class Messages(Resource):
    def get(self, id=None):
        if id:
            message = Message.query.get_or_404(id)
            return message.to_dict(), 200
        else:
            messages = Message.query.all()
            return [message.to_dict() for message in messages], 200

    def post(self):
        data = request.get_json()
        message = Message(**data)
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
        return '', 204

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
            resource = AppResource.query.get_or_404(id)  # Change here
            return resource.to_dict(), 200
        else:
            resources = AppResource.query.all()  # Change here
            return [resource.to_dict() for resource in resources], 200

    def post(self):
        data = request.get_json()
        resource = AppResource(**data)  # Change here
        db.session.add(resource)
        db.session.commit()
        return resource.to_dict(), 201

    def patch(self, id):
        resource = AppResource.query.get_or_404(id)  # Change here
        data = request.get_json()
        for key, value in data.items():
            setattr(resource, key, value)
        db.session.commit()
        return resource.to_dict()

    def delete(self, id):
        resource = AppResource.query.get_or_404(id)  # Change here
        db.session.delete(resource)
        db.session.commit()
        return '', 204


# Add the resources to the API
api.add_resource(Users, '/users', '/users/<int:id>')
api.add_resource(Pets, '/pets', '/pets/<int:id>')
api.add_resource(Messages, '/messages', '/messages/<int:id>')
api.add_resource(Appointments, '/appointments', '/appointments/<int:id>')
api.add_resource(Organizations, '/organizations', '/organizations/<int:id>')
api.add_resource(Resources, '/resources', '/resources/<int:id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
