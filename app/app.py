from flask import Flask, request, make_response, Blueprint
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from api.ProjectsAPI import projects_api
from api.ObservationsAPI import observations_api
from api.ImagesAPI import images_api
from api.functions.utilities import *
from json2html import *
import json
from frontend.views import mod

## ----------------------------------------------------------------------------------------##
## Code Reference Credit
## ----------------------------------------------------------------------------------------##
##
## Blueprint Configuratiton for multiple API files:
## https://stackoverflow.com/questions/15231359/split-python-flask-app-into-multiple-files
##
## Code for adding result headers Sample taken from:
## https://stackoverflow.com/questions/43796423/python-converting-mysql-query-result-to-json
##
## ----------------------------------------------------------------------------------------##

def create_app():
    app = Flask(__name__, template_folder='template')
    app.register_blueprint(projects_api)
    app.register_blueprint(observations_api)
    app.register_blueprint(mod)
    return app

app = create_app()

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["100 per day"],
)


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
