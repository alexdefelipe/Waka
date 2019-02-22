from app import app, csvs
from flask import jsonify, request
from werkzeug.utils import secure_filename
from app.predictor import ejecutar_predictor
import os


@app.route('/')
def index():
    return "Hello, World!"


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
        username = request.form['username']
        work = request.form['trabajo']
        filename = csvs.save(request.files['file'],
                             os.path.join(username, work))

        # prepare predictor path data
        paths = {}
        paths['csv'] = csvs.path(filename)
        paths['dir_trabajo'] = '/'.join(
            paths['csv'].split("/")[:-1])
        paths['id_trabajo'] = work

        # launch predictor
        ejecutar_predictor(paths)

        # send response
        response = jsonify(code=200, filename=filename)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    else:
        response = jsonify(
            code=500, message="Solo se pueden enviar ficheros CSV")
        return response
