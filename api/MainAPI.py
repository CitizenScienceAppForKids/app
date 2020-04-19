
from flask import Flask, request, make_response, Blueprint
from ProjectsAPI import projects_api
from ObservationsAPI import observations_api
from json2html import *
import json
from functions.dbconnection import *

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


app = Flask(__name__)
app.register_blueprint(projects_api)
app.register_blueprint(observations_api)

@app.route("/")
def root():
    return "Home Route"

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)