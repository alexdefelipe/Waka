from app import db
from datetime import datetime


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # username = db.Column(db.String(80), unique=True, nullable=False)
    username = db.Column(db.String(80), nullable=False, unique=True)
    password = db.Column(db.String(120), nullable=False)
    works = db.relationship('Works', backref='user', lazy=True)

    def __repr__(self):
        return '<User %r>' % self

    def serialize(self):
        return {"id": self.id,
                "username": self.username,
                "password": self.password,
                "works": [w.serialize() for w in self.works]}


class Works(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    desc = db.Column(db.String(120), nullable=True)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    results = db.Column(db.String(120), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                        nullable=False)

    def __repr__(self):
        return '<Results %r>' % self.results

    def serialize(self):
        user = User.query.filter_by(id=self.user_id).first_or_404()
        return {"id": self.id,
                "name": self.name,
                "desc": self.desc,
                "author": user.username,
                "results": self.results,
                "timestamp": str(self.timestamp)}
