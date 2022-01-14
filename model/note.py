from sqlalchemy import ForeignKey
from base import Model
from core import db


class Note(Model, db.Model):  # pylint: disable=too-few-public-methods
    __tablename__ = 'notes'
    id = db.Column(db.Integer, primary_key=True)
    checked = db.Column(db.Boolean(), nullable=False)
    todo = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
