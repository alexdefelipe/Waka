from app import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # username = db.Column(db.String(80), unique=True, nullable=False)
    username = db.Column(db.String(80), nullable=False, unique=True)
    password = db.Column(db.String(120), nullable=False)
    questions = db.relationship('Question', backref='user', lazy=True)

    def __repr__(self):
        return '<User %r>' % self

    def serialize(self):
        return {"id": self.id,
                "username": self.username,
                "password": self.password}
