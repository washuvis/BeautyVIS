import sys
import math
import time
import os
from flask import Flask, request, jsonify
from flask.globals import session
#from flaskext.mysql import MySQL
import json
import random
import datetime
import secrets
import csv
#import numpy as np
import pandas as pd
import db_conf
from flask import send_file

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
app.config['MYSQL_DATABASE_HOST'] = db_conf.host
app.config['MYSQL_DATABASE_USER'] = db_conf.user
app.config['MYSQL_DATABASE_PASSWORD'] = db_conf.password
app.config['MYSQL_DATABASE_DB'] = db_conf.db
db_table_prefix = 'miniVlat'

# Create a dictionary to keep track of the selected image counts
selected_image_counts = {}
global_session = {}
selected_image_counts_new = {}

print('ready')


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/get_time')
def get_time():
    return jsonify({'time': time.time()})


@app.route('/new_session_id', methods=['GET', 'POST'])
def get_new_session_id():
    """
        Returns a new session ID and sets up the session.
        """
    data = request.json
    print(data)

    # session id
    id = secrets.token_urlsafe(16)
    global_session[id] = {
    }

    # insert session into database
    '''
    conn = mysql.connect()
    cur = conn.cursor()
    sql_statement = f"insert into {db_table_prefix}_participants (id, data_condition, policy_condition, presentation_condition, tutorial_loaded_client_time, tutorial_loaded) values (" + ", ".join(
        [f"\"{str(item)}\"" for item in [id, data_condition, policy_condition, presentation_condition, tutorial_loaded_client_time, datetime.datetime.today()]]) + ")"
    cur.execute(sql_statement)
    conn.commit()
    cur.fetchall()
    conn.close()
    '''

    print('%d active users' % len(global_session.keys()))
    print(global_session.keys())

    return jsonify({'new_id': id})


@app.route('/record_responses_to_db', methods=['POST'])
def record_responses_to_db():
    data = request.json
    session_id = data['session_id']
    fname = str(session_id)+'.txt'
    fname = './surveys/' + fname
    with open(fname, 'w+') as test:
        test.write(json.dumps(data) + "\n")

    print('TODO: Record quiz responses into a file or DB')
    print('Collected quiz data: ', data)
    return {'response': "json post succeeded"}


@app.route('/get_random_images', methods=['GET', 'POST'])
def get_random_images():
    sub_list = fold_name()
    all_selected_images = []

    for sf in sub_list:
        if (sf != '.DS_Store' and sf != '.git'):
            selected_images = get_img(sf, 2)
            all_selected_images.extend(selected_images)

    # Shuffle the selected images to randomize their order
    random.shuffle(all_selected_images)

    # Limit each image to a maximum of 5 selections
    max_selections = 5
    final_selected_images = []

    # Determine which dictionary to use based on the current state of the experiment
    current_image_counts = selected_image_counts if all(val >= max_selections for val in selected_image_counts.values()) else selected_image_counts_new

    for image_name in all_selected_images:
        # Check if the image has already reached the maximum selections
        if image_name not in current_image_counts or current_image_counts[image_name] < max_selections:
            final_selected_images.append(image_name)
            # Update the selected count for the image
            current_image_counts[image_name] = current_image_counts.get(image_name, 0) + 1

        # Stop selecting images once we have 32 unique images or when each image has been selected by 5 participants
        if len(final_selected_images) == 16 or all(val >= 5 for val in current_image_counts.values()):
            break

    print("Number of times each image appeared in the current experiment:", current_image_counts)
    print("Number of times each image appeared in the new experiment:", selected_image_counts_new)
    print(final_selected_images)
    return jsonify({'files': final_selected_images})

@app.route('/get_image')
def get_image():
    print('get_image called')
    image_name = request.args['image_name']
    print(image_name)
    return send_file(f'../imageData/{image_name}', mimetype='image/gif')

def fold_name():
    fname = '../imageData/'
    file_list = os.listdir(fname)
    return file_list

def get_img(sub_fold, num_images):
    fname = '../imageData/' + sub_fold + "/"
    file_list = os.listdir(fname)
    selected_images = random.sample(file_list, num_images)
    selected_images = [sub_fold + "/" + x for x in selected_images]
    return selected_images
    

