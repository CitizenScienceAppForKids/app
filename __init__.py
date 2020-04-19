"""the public module that includes views"""
from flask import Flask

app = Flask(__name__, template_folder='template')

from webapp.frontend.views import mod

app.register_blueprint(frontend.views.mod)