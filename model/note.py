from sqlalchemy import ForeignKey
from base import Model
from core import db


class Note(Model, db.Model):  # pylint: disable=too-few-public-methods
    __tablename__ = 'notes'
    id = db.Column(db.Integer, primary_key=True)  # pylint: disable=no-member
    checked = db.Column(db.Boolean(), nullable=False)  # pylint: disable=no-member
    todo = db.Column(db.String(50), nullable=False)  # pylint: disable=no-member
    user_id = db.Column(db.Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)  # pylint: disable=no-member
