#!/usr/bin/env python3

# Standard library imports
from random import randint, randrange, choice as rc
from datetime import datetime, timedelta

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Pet, Message, Appointment, Organization, AppResource

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
        db.session.query(AppResource).delete()

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
        pets = [Pet(
            petname=fake.first_name(),
            species=rc(['Dog', 'Cat']),
            breed=fake.last_name(),
            age=str(randint(1, 15)),
            gender=rc(['Male', 'Female']),
            medical_conditions=fake.text(),
            status=rc(['Available', 'Adopted']),
            owner_id=rc(users).user_id,
            organization_id=rc(organizations).organization_id,
            # Temporarily leaving image_url blank, will update later
        ) for _ in range(20)]
        db.session.add_all(pets)
        
        # Commit pets to the database to generate IDs
        db.session.commit()

        # Update image_url using the auto-incremented pet_id
        for pet in pets:
            pet.image_url = f"https://example.com/images/{pet.pet_id}.jpg"
        
        # Commit the updated pets
        db.session.commit()

        # Creating Messages
        messages = [Message(
            sender_id=rc(users).user_id,
            receiver_id=rc(users).user_id,
            content=fake.text(),
        ) for _ in range(30)]
        db.session.add_all(messages)

        # Creating Appointments
        appointments = [Appointment(
            pet_id=rc(pets).pet_id,
            adopter_id=rc(adopters).user_id,
            date_time=datetime.utcnow() + timedelta(days=randrange(30)),
            status=rc(['Scheduled', 'Completed'])
        ) for _ in range(15)]
        db.session.add_all(appointments)

        # Creating Resources
        resources = [AppResource(
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
