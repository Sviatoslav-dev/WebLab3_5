from base import Model
from core import db


class User(Model, db.Model):  # pylint: disable=too-few-public-methods
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)  # pylint: disable=no-member
    name = db.Column(db.String(50), unique=True, nullable=False)  # pylint: disable=no-member
    password = db.Column(db.String(50), unique=True, nullable=False)  # pylint: disable=no-member
