from flask_sqlalchemy import SQLAlchemy

DB_URL = "postgresql+psycopg2://postgres:admin123@localhost:5432/weblab3"

db = SQLAlchemy()
