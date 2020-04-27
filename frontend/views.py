"""Public section"""
from flask import (
    Blueprint,
    redirect,
    render_template,
    request,
    url_for,
)

mod = Blueprint('site', __name__, template_folder='templates', static_folder='static', static_url_path='/webapp/static')

@mod.route('/sw.js', methods=['GET'])
def sw():
    return mod.send_static_file('sw.js')

@mod.route('/test_image_upload', methods=['GET', 'POST'])
def image_upload():
    return render_template('public/test_image_upload.html')

@mod.route('/decode', methods=['GET', 'POST'])
def decode():
    print('Decode!', file=sys.stderr) 

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
