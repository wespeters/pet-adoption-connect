#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
from datetime import datetime

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Pet, Message, Appointment, Organization, Resource

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")

        # Deleting existing data
        db.session.query(User).delete()
        db.session.query(Pet).delete()
        db.session.query(Message).delete()
        db.session.query(Appointment).delete()
        db.session.query(Organization).delete()
        db.session.query(Resource).delete()

        # Creating Organizations
        organizations = [Organization(
            name=fake.company(),
            contact_info=fake.phone_number(),
            description=fake.text(),
            location=fake.address(),
            website=fake.url()
        ) for _ in range(5)]
        db.session.add_all(organizations)

        # Creating Users
        owners = []
        adopters = []
        generated_usernames = set()
        for _ in range(50):
            role = rc(['owner', 'adopter'])

            # Ensure unique and valid-length username
            username = fake.user_name()
            while username in generated_usernames or len(username) < 5 or len(username) > 20:
                username = fake.user_name()[:20]  # Truncate if necessary
                if len(username) < 5:
                    username = username.ljust(5, '0')  # Pad with zeros if too short
            generated_usernames.add(username)

            user = User(
                username=username,
                password=fake.password(),
                email=fake.email(),
                role=role,
                contactinfo=fake.phone_number(),
                organization_id=rc(organizations).organization_id
            )
            if role == 'owner':
                owners.append(user)
            else:
                adopters.append(user)

        users = owners + adopters
        db.session.add_all(users)

        # Commit users to the database
        db.session.commit()

        # Track generated pet_ids
        generated_pet_ids = set()

        # Creating Pets
        pets = []
        for _ in range(20):
            pet_id = str(randint(1000, 9999))

            # Ensure unique pet_id
            while pet_id in generated_pet_ids:
                pet_id = str(randint(1000, 9999))

            generated_pet_ids.add(pet_id)

            image_url = f"https://example.com/images/{pet_id}.jpg"

            pet = Pet(
                pet_id=pet_id,
                petname=fake.first_name(),
                species=rc(['Dog', 'Cat']),
                breed=fake.last_name(),
                age=str(randint(1, 15)),
                gender=rc(['Male', 'Female']),
                medical_conditions=fake.text(),
                status=rc(['Available', 'Adopted']),
                owner_id=rc(users).user_id,
                organization_id=rc(organizations).organization_id,
                image_url=image_url
            )
            pets.append(pet)

        db.session.add_all(pets)

        # Creating Messages
        messages = [Message(
            message_id=str(randint(1000, 9999)),
            sender_id=rc(users).user_id,
            receiver_id=rc(users).user_id,
            content=fake.text(),
            time=datetime.utcnow()
        ) for _ in range(30)]
        db.session.add_all(messages)

        # Creating Appointments
        appointments = [Appointment(
            appointment_id=str(randint(1000, 9999)),
            pet_id=rc(pets).pet_id,
            adopter_id=rc(adopters).user_id, # Use adopters list here
            date_time=datetime.utcnow(),
            status=rc(['Scheduled', 'Completed'])
        ) for _ in range(15)]
        db.session.add_all(appointments)

        # Creating Resources
        resources = [Resource(
            resource_id=randint(1000, 9999),
            title=fake.sentence(),
            content=fake.text(),
            author=fake.name(),
            category=rc(['adoption tips', 'preparation guide']),
            created_at=datetime.utcnow()
        ) for _ in range(10)]
        db.session.add_all(resources)

        # Committing the changes to the database
        db.session.commit()
        print("Seed completed!")
