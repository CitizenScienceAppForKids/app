from flask import Flask, request, make_response, Blueprint
<<<<<<< Updated upstream:app/app.py
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from api.ProjectsAPI import projects_api
from api.ObservationsAPI import observations_api
from api.functions.dbconnection import *
from json2html import *
import json
from frontend.views import mod
=======
from ProjectsAPI import projects_api
from ObservationsAPI import observations_api
from ImagesAPI import images_api
from json2html import *
import json
>>>>>>> Stashed changes:api/MainAPI.py

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

<<<<<<< Updated upstream:app/app.py
limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["100 per day"],
)

@app.route("/")
def root():
    return "Home Route"
=======
app = Flask(__name__)
app.register_blueprint(projects_api)
app.register_blueprint(observations_api)
app.register_blueprint(images_api)
>>>>>>> Stashed changes:api/MainAPI.py

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)