#!/usr/bin/env python3

from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
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

if __name__ == '__main__':
    app.run(port=5555, debug=True)
