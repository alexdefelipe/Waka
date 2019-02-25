# coding=utf-8

from app import app, csvs, db
from flask import jsonify, request
from werkzeug.utils import secure_filename
from app.predictor import ejecutar_predictor
from app.models import User, Works
import os
import json


@app.route('/')
def index():
    return "Hello, World!"


@app.route('/iniciarSesion', methods=['POST'])
def iniciarSesion():
    username = request.get_json()['username']
    password = request.get_json()['password']
    remember = request.get_json()['remember']

    try:
        user = User.query.filter_by(
            username=username, password=password).first_or_404()
        response = jsonify(payload=user.serialize(), remember=remember)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    except Exception as ex:
        plantilla = "Se ha producido un error de tipo {0}."
        mensaje = plantilla.format(type(ex).__name__, ex.args)
        print ex
        response = jsonify(payload=mensaje)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 500


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower(
           ) in app.config['ALLOWED_EXTENSIONS']


@app.route("/procesar", methods=['POST'])
def procesar():
    if 'file' not in request.files:
        print('No file part')
        return jsonify(code=500, message="Archivo incorrecto")
    file = request.files['file']
    # if user does not select file, browser also
    # submit an empty part without filename
    if file.filename == '':
        print('No selected file')
        return jsonify(code=500,
                       message="No se ha adjuntado ningun archivo")
    if file and allowed_file(file.filename):
        # save csv
        filename = secure_filename(file.filename)
        workname = request.form['trabajo']
        desc = request.form['desc']
        username = request.form['username']
        filename = csvs.save(request.files['file'],
                             os.path.join(username, workname))

        # prepare predictor path data
        paths = {}
        paths['csv'] = csvs.path(filename)
        paths['dir_trabajo'] = '/'.join(
            paths['csv'].split("/")[:-1])
        paths['id_trabajo'] = workname

        try:
            # launch predictor
            results = ejecutar_predictor(paths)

            # save work's info on database and send response
            user = User.query.filter_by(username=username).first_or_404()
            work = Works(name=workname, desc=desc, results=json.dumps(
                results), user_id=user.id)
            db.session.add(work)
            db.session.commit()
            response = jsonify(results=results)
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
        except Exception as ex:
            plantilla = "Se ha producido un error de tipo {0}."
            mensaje = plantilla.format(type(ex).__name__, ex.args)
            print ex
            response = jsonify(message=mensaje)
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response, 500
    else:
        response = jsonify(message="Solo se pueden enviar ficheros CSV")
        return response, 500


@app.route("/<username>/trabajos", methods=['GET'])
def getTrabajos(username):
    try:
        user = User.query.filter_by(username=username).first_or_404()
        works = Works.query.filter_by(user_id=user.id).all()

        works = [w.serialize() for w in works]
        response = jsonify({'works': works})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    except Exception as ex:
        print ex
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 500


# @app.route("/<username>/trabajos", methods=['POST'])
# def getTrabajos(username):
#     trabajo_recibido = request.get_json()["trabajo"]
#     print(trabajo_recibido)
#     trabajo['name'] = trabajo_recibido["id"]
#     trabajo['results'] = []
