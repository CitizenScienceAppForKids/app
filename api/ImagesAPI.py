from flask import Flask, Blueprint, request, make_response
from json2html import *
import json

from functions.utilities import *
from functions.validation import *
from functions.helpers import *

images_api = Blueprint('images_api', __name__)

## --------------------------------------------------------------------##
## Images ENDPOINT Glossary
## --------------------------------------------------------------------##
##
## Create an Image                             POST /api/iamges
## View an Image                               GET /api/images/<iid>
## View all Images                             GET /api/images
## Edit an Image                               PATCH /api/images/<iid>
## Delete an Image                             DELETE /api/images/<iid>
##
## --------------------------------------------------------------------##

## Declare Return Messages
msg_pass = json.dumps({"Success": "Endpoint Called"}, indent=4, separators=(',', ':'))
msg_fail = json.dumps({"Error": "Richard, what did you do?"}, indent=4, separators=(',', ':'))
msg_accept_type = json.dumps({"Error": "Accept Type Invalid - Endpoint Only Returns JSON"}, indent=3, separators=(',', ':'))
msg_content_type = json.dumps({"Error": "Content-Type Invalid - Endpoint Requires JSON"}, indent=3, separators=(',', ':'))
msg_invl = json.dumps({"Error": "Invalid Input"}, indent=4, separators=(',', ':'))
msg_miss = json.dumps({"Error": "Missing At Least One Attribute"}, indent=4, separators=(',', ':'))
msg_uniq = json.dumps({"Error": "Project 'title' must be unique"}, indent=4, separators=(',', ':'))
msg_none = json.dumps({"Error": "No asset exists with that ID"}, indent=4, separators=(',', ':'))


## -------------------------------------------##
## Create an Image
## -------------------------------------------##
@images_api.route('/api/images', methods=['POST'])
def createImage():

    if request.content_type != "application/json":
        return(makeResponse(msg_content_type), 406)
    elif 'application/json' not in request.accept_mimetypes:
        return(makeResponse(msg_accept_type), 406)
    else:
        try:
            # Get request information
            content = request.get_json()
            
            # Check for All Required Image Attributes & Validate
            try:
                if content["file_name"] and content["file_type"] and content["file_path"]:
                    if not validateImage(content):
                          return(makeResponse(msg_invl), 400)
                    
            except:
                return(makeResponse(msg_miss), 400)


            # project = None
            # observation = None
            # for i in content:
            #     if i == "project":
            #         project = content["project"]
            #     if i == "observation":
            #         observation = content["observation"]

            # Create new Project
            con = dbconnect()
            cursor = con.cursor()

            query = "INSERT INTO images (file_name, file_type, file_path) VALUES (%s, %s, %s)"
            recordTuple = (content["file_name"], content["file_type"], content["file_path"])
            cursor.execute(query, recordTuple)

            con.commit()
            new_id = cursor.lastrowid

            # Write success response
            msg_pass = json.dumps([{
                    "iid": new_id,
                    "file_name": content["file_name"],
                    "file_type": content["file_type"],
                    "file_path": content["file_path"],
                    "self": request.url + "/" + str(new_id)}],
                indent=4, separators=(',', ':'), default=str)
                
            cursor.close()
            disconnect(con)
            return(makeResponse(msg_pass), 201)

        except:
            try: 
                if cursor:
                    cursor.close()
                if con:
                    disconnect(con)
            except:
                pass
            return(makeResponse(msg_fail), 500)
    
## -------------------------------------------##
## View an Image
## -------------------------------------------##
@images_api.route('/api/images/<iid>', methods=['GET'])
def viewImage(iid):
    
    if 'application/json' in request.accept_mimetypes:

        try:
            # Open DB connection and query for images
            con = dbconnect()
            query = ("SELECT iid, project, observation, file_name, file_type, file_path from images "
                        "WHERE iid = " + iid + ";")
            cursor = con.cursor()
            cursor.execute(query)
            row_headers=[x[0] for x in cursor.description]
            row_headers.append('self')
            results = cursor.fetchall()

            image_list = []
            if len(results) > 0:
                for row in results:
                    url = (request.url,)
                    new_tup = row + url
                    image_list.append(dict(zip(row_headers, new_tup)))

            cursor.close()
            disconnect(con)

            return(makeResponse(json.dumps(
                image_list, 
                indent=2,
                separators=(',', ':'))), 200)

        except:
            try: 
                if cursor:
                    cursor.close()
                if con:
                    disconnect(con)
            except:
                pass
            return(makeResponse(msg_fail), 500)
    else:
        return(makeResponse(msg_accept_type), 406)

## -------------------------------------------##
## View all Images
## -------------------------------------------##
@images_api.route('/api/images', methods=['GET'])
def viewAllImages():

    # Check for valid accept-type
    if 'application/json' in request.accept_mimetypes:

        try:
            # Open DB connection and query for images
            con = dbconnect()
            query = ("SELECT iid, project, observation, file_name, file_type, file_path from images;")
            cursor = con.cursor()
            cursor.execute(query)
            row_headers=[x[0] for x in cursor.description]
            row_headers.append('self')
            results = cursor.fetchall()

            image_list = []
            if len(results) > 0:
                for row in results:
                    url = (request.url + "/" + str(row[0]),)
                    new_tup = row + url
                    image_list.append(dict(zip(row_headers, new_tup)))

            cursor.close()
            disconnect(con)

            return(makeResponse(json.dumps(
                image_list, 
                indent=2,
                separators=(',', ':'))), 200)

        except:
            try: 
                if cursor:
                    cursor.close()
                if con:
                    disconnect(con)
            except:
                pass
            return(makeResponse(msg_fail), 500)
    else:
        return(makeResponse(msg_accept_type), 406)

    

## -------------------------------------------##
## Edit an Image
## -------------------------------------------##
@images_api.route('/api/images/<iid>', methods=['PATCH'])
def patchImage(iid):

    if request.content_type != "application/json":
        return(makeResponse(msg_content_type), 406)
    elif 'application/json' not in request.accept_mimetypes:
        return(makeResponse(msg_accept_type), 406)
    else:
        try:
            # Get request values
            content = request.get_json()

            valid = doesIidExist(iid)
            if not valid:
                return(makeResponse(msg_none), 404)

            ## Build UPDATE String
            update = createImageUpdateQuery(content, iid)
            
            if update[0]:
                con = dbconnect()
                cursor = con.cursor()
                cursor.execute(update[1])
                con.commit()

            ## Retrieve the updated object
            new_query = ("select iid, project, observation, file_name, file_type, file_path "
                    "from images where iid = " + iid + ";")
            cursor.execute(new_query)
            row_headers=[x[0] for x in cursor.description]
            row_headers.append('self')
            results = cursor.fetchall()

            image_list = []
            for row in results:
                url = (request.url,)
                new_tup = row + url
                image_list.append(dict(zip(row_headers, new_tup)))

            ## Return the new object JSON
            cursor.close()
            disconnect(con)

            return(makeResponse(json.dumps(
                image_list, 
                indent=2,
                separators=(',', ':'),
                default=str)), 201)

        except:
            try: 
                if cursor:
                    cursor.close()
                if con:
                    disconnect(con)
            except:
                pass
            return(makeResponse(msg_fail), 500)
 
## -------------------------------------------##
## Delete an Image
## -------------------------------------------##
@images_api.route('/api/images/<iid>', methods=['DELETE'])
def deleteImage(iid):
    try:
        
        # Check if Iid exists
        if not doesIidExist(iid):
            return(makeResponse(msg_none), 404)
        else:
            # Delete Image
            query = ("DELETE from images WHERE iid = " + iid + ";")
            con = dbconnect()
            cursor = con.cursor()
            cursor.execute(query)
            con.commit()
            cursor.close()
            disconnect(con)
            return(makeResponse(''), 204)

    except:
        try: 
            if cursor:
                cursor.close()
            if con:
                disconnect(con)
        except:
            pass
        return(makeResponse(msg_fail), 500)
