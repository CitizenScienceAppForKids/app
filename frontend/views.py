"""Public section"""
from flask import (
    Blueprint,
    redirect,
    render_template,
    request,
    url_for,
    current_app,
)
import base64

mod = Blueprint('site', __name__, template_folder='templates', static_folder='static', static_url_path='/webapp/static')

@mod.route('/sw.js', methods=['GET'])
def sw():
    return mod.send_static_file('sw.js')

@mod.route('/test_image_upload', methods=['GET', 'POST'])
def image_upload():
    return render_template('public/test_image_upload.html')

@mod.route('/decode', methods=['GET', 'POST'])
def decode():
    s = request.json
    d = base64.b64decode(s['base64_string'])
    current_app.logger.debug("%s is the decoded string", d)
    return "Works"

@mod.route('/')
def homepage():
    return render_template('public/home.html')

@mod.route('/about')
def about():
    return render_template('public/about.html')

@mod.route('/observations/new')
def add_observations_form():
    return render_template('forms/new_observation.html')

@mod.route('/observations')
def observations():
    return render_template('public/observations.html')

@mod.route('/projects')
def current_projects():
    return render_template('public/current_projects.html')

@mod.route('/projects/specific-project')
def specific_projects():
    return render_template('public/specific_projects.html')

@mod.route('/projects/visualization')
def visualization():
    return render_template('public/visualization.html')
