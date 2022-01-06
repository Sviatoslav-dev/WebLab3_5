import datetime
import os
from functools import wraps

from flask import render_template, Flask, request, jsonify, make_response, session
from werkzeug.utils import redirect
import jwt

from controllers.user import add_user, get_user_by_name
from controllers.note import get_notes_by_user_id, add_note, update_note, delete_note

from core import DB_URL, db


def create_app():
    new_app = Flask(__name__, instance_relative_config=False)
    new_app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
    new_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    new_app.config['SECRET_KEY'] = os.environ['SECRET_KEY']

    db.init_app(new_app)

    with new_app.app_context():
        db.create_all()

        return new_app


app = create_app()

def check_for_token(func):
    @wraps(func)
    def wrapped(*args, **kwargs):
        #print(request.get_json())
        token = request.form.get('token') #request.args.get('token')
        if token is None:
            token = request.get_json()
            token = token['token']
        if not token:
            return jsonify({'massage': 'missing token'}), 403

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
            session['id'] = data['id']
        except Exception:
            return redirect('')
        return func(*args, **kwargs)
    return wrapped

@app.route('/')
def index():
    return render_template("login.html")


@app.route('/todo_list', methods=["POST"])
@check_for_token
def todo_list():
    return render_template("todo_list.html")


@app.route('/todo_list/get_list', methods=["POST"])
def get_list():
    res = get_notes_by_user_id(session['id'])
    for i, _ in enumerate(res):
        del res[i]['user_id']
    res.sort(key=lambda variable: variable['id'])
    return make_response(jsonify(res), 200)


@app.route('/todo_list/add', methods=["POST"])
def add():
    req = request.get_json()
    req['user_id'] = session['id']
    res = add_note(req)
    return make_response(jsonify(res), 200)


@app.route('/todo_list/delete', methods=["POST"])
def delete():
    req = request.get_json()
    res = delete_note(req)
    return make_response(jsonify(res), 200)


@app.route('/todo_list/update', methods=["POST"])
def update():
    req = request.get_json()
    res = update_note(req)
    return make_response(jsonify(res), 200)


@app.route('/log_send', methods=["POST"])
def log_send():
    req = request.get_json()
    try:
        user = get_user_by_name(req)
        print(req)
        print(user)
        if user != -1 and req['password'] == user['password']:
            session['loged_in'] = True
            token = jwt.encode({
                'id': user['id'],
                'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=300)
            }, app.config['SECRET_KEY'])
            return jsonify({'token': token.decode('utf-8')})

        res = jsonify({"result": "wrong user or password"})
        return make_response(res, 400)
    except Exception:
        res = jsonify({"result": "error"})
        return make_response(res, 400)


@app.route('/register')
def register():
    return render_template("register.html")


@app.route('/register/send', methods=["POST"])
def send():
    try:
        req = request.get_json()
        add_user(req)
        res = jsonify({"result": "succes"})
        return make_response(res, 200)
    except Exception:
        res = jsonify({"result": "error"})
        return make_response(res, 400)


if __name__ == "__main__":
    app.run(debug=True)
