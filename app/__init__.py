from flask import Flask
from flask_cors import CORS
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_uploads import UploadSet, configure_uploads

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db, render_as_batch=True)
jwt = JWTManager(app)
csvs = UploadSet('csvs', 'csv')
configure_uploads(app, csvs)


from app import routes, models  # noqa
