from flask import Flask, Blueprint, request, make_response
from json2html import *
import json
import datetime
from api.functions.utilities import *
from api.functions.validation import *
from api.functions.helpers import *

observations_api = Blueprint('observations_api', __name__)

## ----------------------------------------------------------------------------------------##
## ENDPOINT Glossary
## ----------------------------------------------------------------------------------------##
##
## Create an Observation                        POST /api/observations
## Create an Observation for a Project          POST /api/project/<pid>/observations
## View an Observation                          GET /api/observations/<oid>
## View all Observations                        GET /api/observations
## View all Observations for Project            GET /api/projects/<pid>/observations
## Edit an Observation                          PATCH /api/observations/<oid>
## Delete an Observation                        DELETE  /api/observations/<oid>
## Assign Observation to Project                PUT /api/projects/<pid>/observations/<oid>
## Unassign Observation from Project            DELETE /api/projects/<pid>/observations/<oid>
##
## ----------------------------------------------------------------------------------------##

## Declare Return Messages
msg_pass = json.dumps({"Success": "Endpoint Called"}, indent=4, separators=(',', ':'))
msg_fail = json.dumps({"Error": "Richard, what did you do?"}, indent=4, separators=(',', ':'))
msg_accept_type = json.dumps({"Error": "Accept Type Invalid - Endpoint Only Returns JSON"}, indent=3, separators=(',', ':'))
msg_content_type = json.dumps({"Error": "Content-Type Invalid - Endpoint Requires JSON"}, indent=3, separators=(',', ':'))
msg_invl = json.dumps({"Error": "Invalid Input"}, indent=4, separators=(',', ':'))
msg_miss = json.dumps({"Error": "Missing At Least One Attribute"}, indent=4, separators=(',', ':'))
msg_none = json.dumps({"Error": "No asset exists with that ID"}, indent=4, separators=(',', ':'))


## -------------------------------------------##
## Create an Observation
## -------------------------------------------##
@observations_api.route('/api/observations', methods=['POST'])
def createObservation():
    if request.content_type != "application/json":
        return (makeResponse(msg_content_type), 406)
    elif 'application/json' not in request.accept_mimetypes:
        return (makeResponse(msg_accept_type), 406)
    else:
        try:
            # Retrieve request json
            content = request.get_json()

            # Check for All Required Attributes & Validate
            try:
                if content["date"] and content["title"] and content["notes"]:
                    if not validateAllObservationData(content):
                        return (makeResponse(msg_invl), 400)
            except:
                return (makeResponse(msg_miss), 400)


            # Check for All Required Image Attributes & Validate
            image = False
            try:
                if content["image"]:
                    try:
                        for i in content["image"]:
                            if i["file_name"] and i["file_type"] and i["file_path"]:
                                if not validateImage(i):
                                    return(makeResponse(msg_invl), 400)
                                else:
                                    image = True
                    except:
                        return(makeResponse(msg_miss), 400)
            except:
                pass

            # Check for optional field
            if "measurments" not in content:
                content["measurements"] = ""
            # Check for optional field
            if "latitude" not in content:
                content["latitude"] = 0
            # Check for optional field
            if "longitude" not in content:
                content["longitude"] = None

            # Create new Observation
            con = dbconnect()
            cursor = con.cursor()
            query = "INSERT INTO observations (date, title, notes, measurements, latitude, longitude) VALUES (%s, %s, %s, %s, %s, %s)"
            recordTuple = (content["date"], content["title"], content["notes"], content["measurements"], content["latitude"], content["longitude"])
            cursor.execute(query, recordTuple)
            con.commit()
            new_id = cursor.lastrowid

            img_list = []
            if image:

                for i in content["image"]:
                    img_query = ("INSERT INTO images (observation, file_name, file_type, file_path) VALUES ("
                                + str(new_id) + ", '"
                                + i["file_name"] + "', '"
                                + i["file_type"] + "', '"
                                + i["file_path"] + "');")

                    cursor.execute(img_query)
                    con.commit()
                    new_img_id = cursor.lastrowid

                    img_list.append({
                        "iid": new_img_id,
                        "observation": new_id,
                        "file_name": i["file_name"],
                        "file_type": i["file_type"],
                        "file_path": i["file_path"],
                        "self": request.host_url + "images/" + str(new_img_id)
                    })

            # Write success response
            msg_pass = json.dumps([{
                "oid": new_id, 
                "date": content["date"], 
                "title": content["title"], 
                "notes": content["notes"],
                "measurements": content["measurements"],
                "latitude": content["latitude"],
                "longitude": content["longitude"],
                "project_id": None,
                "image": img_list,
                "self": request.url + "/" + str(new_id)}],
                indent=4, separators=(',', ':'), default=str)
            
            cursor.close()
            disconnect(con)
            return (makeResponse(msg_pass), 201)

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
## Create an Observation for a Project
## -------------------------------------------##
@observations_api.route('/api/projects/<pid>/observations', methods=['POST'])
def createProjectObservation(pid):
    if request.content_type != "application/json":
        return (makeResponse(msg_content_type), 406)
    elif 'application/json' not in request.accept_mimetypes:
        return (makeResponse(msg_accept_type), 406)
    else:
        try:
            # Retrieve request json
            content = request.get_json()

            if not doesPidExist(pid):
                return(makeResponse(msg_none), 404)

            # Check for All Required Attributes & Validate
            try:
                if content["date"] and content["title"] and content["notes"]:
                    if not validateAllObservationData(content):
                        return (makeResponse(msg_invl), 400)
            except:
                return (makeResponse(msg_miss), 400)

            # Check for All Required Image Attributes & Validate
            image = False
            try:
                if content["image"]:
                    try:
                        for i in content["image"]:
                            if i["file_name"] and i["file_type"] and i["file_path"]:
                                if not validateImage(i):
                                    return(makeResponse(msg_invl), 400)
                                else:
                                    image = True
                    except:
                        return(makeResponse(msg_miss), 400)
            except:
                pass

            # Check for optional field
            if "measurments" not in content:
                content["measurements"] = ""
            # Check for optional field
            if "latitude" not in content:
                content["latitude"] = 0
            # Check for optional field
            if "longitude" not in content:
                content["longitude"] = 0

            # Create new Observation
            con = dbconnect()
            cursor = con.cursor()
            query = "INSERT INTO observations (date, title, notes, measurements, latitude, longitude, project_id) VALUES (%s, %s, %s, %s, %s, %s, %s)"
            recordTuple = (content["date"], content["title"], content["notes"], content["measurements"], content["latitude"], content["longitude"], pid)
            cursor.execute(query, recordTuple)
            con.commit()
            new_id = cursor.lastrowid

            img_list = []
            if image:

                for i in content["image"]:
                    img_query = ("INSERT INTO images (observation, file_name, file_type, file_path) VALUES ("
                                + str(new_id) + ", '"
                                + i["file_name"] + "', '"
                                + i["file_type"] + "', '"
                                + i["file_path"] + "');")

                    cursor.execute(img_query)
                    con.commit()
                    new_img_id = cursor.lastrowid

                    img_list.append({
                        "iid": new_img_id,
                        "observation": new_id,
                        "file_name": i["file_name"],
                        "file_type": i["file_type"],
                        "file_path": i["file_path"],
                        "self": request.host_url + "images/" + str(new_img_id)
                    })

            # Write success response
            msg_pass = json.dumps([{
                "oid": new_id, 
                "date": content["date"], 
                "title": content["title"], 
                "notes": content["notes"],
                "measurements": content["measurements"],
                "latitude": content["latitude"],
                "longitude": content["longitude"],
                "project_id": pid,
                "image": img_list,
                "self": request.host_url + "api/observations/" + str(new_id)}],
                indent=4, separators=(',', ':'), default=str)
            
            cursor.close()
            disconnect(con)
            return (makeResponse(msg_pass), 201)

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
## View an Observation
## -------------------------------------------##
@observations_api.route('/api/observations/<oid>', methods=['GET'])
def viewObservation(oid):

    if 'application/json' in request.accept_mimetypes:

        try:
            con = dbconnect()
            query = ("SELECT oid, title, date, notes, measurements, latitude, longitude, project_id from observations "
                    "WHERE oid = " + oid + ";")
            cursor = con.cursor()
            cursor.execute(query)
            row_headers=[x[0] for x in cursor.description]
            row_headers.append('images')
            row_headers.append('self')
            results = cursor.fetchall()

            observation_list = []

            # Write results to JSON object
            if len(results) > 0:
                for row in results:
                    img_query = ("SELECT iid, project, file_name, file_type, file_path from images WHERE observation = " + str(row[0]))

                    cursor.execute(img_query)
                    img_results = cursor.fetchall()

                    img_list = []
                    if len(img_results) > 0:
                        for i in img_results:
                            img_list.append({"iid": i[0],
                                            "project": i[1],
                                            "file_name": i[2],
                                            "file_type": i[3],
                                            "file_path": i[4],
                                            "self": request.host_url + "api/images/" + str(i[0])
                                            })

                    imgs = (img_list,)
                    img_tup = row + imgs
                    url = (request.url,)
                    url_tup = img_tup + url
                    observation_list.append(dict(zip(row_headers, url_tup)))

                cursor.close()
                disconnect(con)
                msg_pass = json.dumps(
                    observation_list,
                    indent=4,
                    separators=(',', ':'),
                    default=str)
                
                return(makeResponse(msg_pass), 200)

            else:
                cursor.close()
                disconnect(con)
                return(makeResponse(msg_none), 404)

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
## View all Observations
## -------------------------------------------##
@observations_api.route('/api/observations', methods=['GET'])
def viewAllObservations():
    # Check for valid accept type
    if 'application/json' in request.accept_mimetypes:

        try:
            con = dbconnect()
            query = ("SELECT oid, title, date, notes, measurements, latitude, longitude, project_id from observations;")
            cursor = con.cursor()
            cursor.execute(query)
            row_headers=[x[0] for x in cursor.description]
            row_headers.append('images')
            row_headers.append('self')
            results = cursor.fetchall()

            observation_list = []

            # Write results to JSON object
            if len(results) > 0:
                for row in results:
                    img_query = ("SELECT iid, project, file_name, file_type, file_path from images WHERE observation = " + str(row[0]))

                    cursor.execute(img_query)
                    img_results = cursor.fetchall()

                    img_list = []
                    if len(img_results) > 0:
                        for i in img_results:
                            img_list.append({"iid": i[0],
                                            "project": i[1],
                                            "file_name": i[2],
                                            "file_type": i[3],
                                            "file_path": i[4],
                                            "self": request.host_url + "api/images/" + str(i[0])
                                            })

                    imgs = (img_list,)
                    img_tup = row + imgs
                    url = (request.url + "/" + str(row[0]),)
                    url_tup = img_tup + url
                    observation_list.append(dict(zip(row_headers, url_tup)))

            cursor.close()
            disconnect(con)
            msg_pass = json.dumps(
                observation_list,
                indent=4,
                separators=(',', ':'),
                default=str)
            
            return(makeResponse(msg_pass), 200)


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
## View all Observations for Project
## -------------------------------------------##
@observations_api.route('/api/projects/<pid>/observations', methods=['GET'])
def viewAllProjectObservations(pid):

    # Check for valid accept type
    if 'application/json' in request.accept_mimetypes:

        try:
            con = dbconnect()
            query = ("SELECT oid, title, date, notes, measurements, latitude, longitude, project_id from observations "
                    "WHERE project_id = " + pid + ";")
            cursor = con.cursor()
            cursor.execute(query)
            row_headers=[x[0] for x in cursor.description]
            row_headers.append('images')
            row_headers.append('self')
            results = cursor.fetchall()

            observation_list = []

            # Write results to JSON object
            if len(results) > 0:
                for row in results:
                    img_query = ("SELECT iid, project, file_name, file_type, file_path from images WHERE observation = " + str(row[0]))

                    cursor.execute(img_query)
                    img_results = cursor.fetchall()

                    img_list = []
                    if len(img_results) > 0:
                        for i in img_results:
                            img_list.append({"iid": i[0],
                                            "project": i[1],
                                            "file_name": i[2],
                                            "file_type": i[3],
                                            "file_path": i[4],
                                            "self": request.host_url + "api/images/" + str(i[0])
                                            })

                    imgs = (img_list,)
                    img_tup = row + imgs
                    url = (request.url + "/" + str(row[0]),)
                    url_tup = img_tup + url
                    observation_list.append(dict(zip(row_headers, url_tup)))

                cursor.close()
                disconnect(con)
                msg_pass = json.dumps(
                    observation_list,
                    indent=4,
                    separators=(',', ':'),
                    default=str)
                
                return(makeResponse(msg_pass), 200)

            else:
                cursor.close()
                disconnect(con)
                return(makeResponse(msg_none), 404)

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
## Edit an Observation
## -------------------------------------------##
@observations_api.route('/api/observations/<oid>', methods=['PATCH'])
def patchObservation(oid):
    # Check for valid content type
    if request.content_type != "application/json":
        return (makeResponse(msg_content_type), 406)
    elif 'application/json' not in request.accept_mimetypes:
        return (makeResponse(msg_accept_type), 406)
    else:
        try:
            # Retrieve request json
            content = request.get_json()

            valid = doesOidExist(oid)
            if not valid:
                return(makeResponse(msg_none), 404)

            update = createObservationUpdateQuery(content, oid)
            
            if update[0]:
                con = dbconnect()
                cursor = con.cursor()
                cursor.execute(update[1])
                con.commit()
                cursor.close()
                disconnect(con) 

            ## Check for image Update
            try:
                imageContent = False
                for i in content:
                    if i == "image":
                        imageContent = True

                if imageContent:
                    for row in content["image"]:
                        imageExists = hasImage(pid)
                        # If there is already an image
                        if imageExists:
                            img_update = createImageUpdateQuery(row, pid)
                        # Otherwise create new image
                        else:
                            if not validateImage(row):
                                return(makeResponse(msg_miss), 400)
                            else:
                                img_update = (True,
                                ("INSERT INTO images (observation, file_name, file_type, file_path) VALUES ("
                                    + str(oid) + ", '"
                                    + row["file_name"] + "', '"
                                    + row["file_type"] + "', '"
                                    + row["file_path"] + "');"))

                        if img_update[0]:
                            con = dbconnect()
                            cursor = con.cursor()
                            cursor.execute(img_update[1])
                            con.commit()
                            cursor.close()
                            disconnect(con) 
                      
            except:
                pass


            ## Retrieve updated object
            new_query = ("select oid, project_id, date, title, notes, measurements, latitude, longitude "
                    "from observations where oid = " + oid + ";")
            con = dbconnect()
            cursor = con.cursor()
            cursor.execute(new_query)
            row_headers=[x[0] for x in cursor.description]
            row_headers.append('image')
            row_headers.append('self')
            results = cursor.fetchall()

            observation_list = []
            if len(results) > 0:
                for row in results:
                    img_query = ("SELECT iid, observation, file_name, file_type, file_path from images WHERE observation = " + str(row[0]))

                    cursor.execute(img_query)
                    img_results = cursor.fetchall()
                    img_list = []
                    if len(img_results) > 0:
                        for i in img_results:
                            img_list.append({"iid": i[0],
                                            "observation": i[1],
                                            "file_name": i[2],
                                            "file_type": i[3],
                                            "file_path": i[4],
                                            "self": request.host + "/api/images/" + str(i[0])
                    
                            })
    
                    imgs = (img_list,)
                    img_tup = row + imgs
                    url = (request.url,)
                    url_tup = img_tup + url
                    observation_list.append(dict(zip(row_headers, url_tup)))

            ## Return the new object JSON
            cursor.close()
            disconnect(con)
            return(makeResponse(json.dumps(
                observation_list, 
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
## Delete an Observation
## -------------------------------------------##
@observations_api.route('/api/observations/<oid>', methods=['DELETE'])
def deleteObservation(oid):
    try:

        if not doesOidExist(oid):
            return(makeResponse(msg_none), 404)
        else:
            # Delete Project
            query = ("DELETE from observations WHERE oid = " + oid + ";")
            con = dbconnect()
            cursor = con.cursor()
            cursor.execute(query)
            con.commit()
            cursor.close()
            disconnect(con)
            return (makeResponse(''), 204)

    except:
        try: 
            if cursor:
                cursor.close()
            if con:
                disconnect(con)
        except:
            pass
        return(makeResponse(msg_fail), 500)


## --------------------------------------------------------------------##
## Linking Operations Between Projects and Observations
## --------------------------------------------------------------------##

## -------------------------------------------##
## Assign Observation to Project
## -------------------------------------------##
@observations_api.route('/api/projects/<pid>/observations/<oid>', methods=['PUT'])
def assignObservation(pid, oid):

    if 'application/json' in request.accept_mimetypes:
        try:
            ## Check for valid IDs

            pidValid = doesPidExist(pid)
            if not pidValid:
                return(makeResponse(msg_none), 404)

            oidValid = doesOidExist(oid)
            if not oidValid:
                return(makeResponse(msg_none), 404)

            query = ("UPDATE observations SET project_id = " + pid +
                    " WHERE oid = " + oid + ";")
            
            con = dbconnect()
            cursor = con.cursor()
            cursor.execute(query)
            con.commit()

            get_query = ("select oid, project_id, date, title, notes, measurements, latitude, longitude "
                        "from observations where oid = " + oid + ";")
            cursor.execute(get_query)
            row_headers=[x[0] for x in cursor.description]
            row_headers.append('self')
            results = cursor.fetchall()
            cursor.close()
            disconnect(con)

            item_list = []
            for row in results:
                url = (request.host_url + "api/observations/" + str(row[0]),)
                new_tup = row + url
                item_list.append(dict(zip(row_headers, new_tup)))

            msg_pass = json.dumps(
                item_list,
                indent=4,
                separators=(',', ':'),
                default=str
            )
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

    else:

        return(makeResponse(msg_accept_type), 406)

    

## -------------------------------------------##
## Unassign Observation from Project
## -------------------------------------------##
@observations_api.route('/api/projects/<pid>/observations/<oid>', methods=['DELETE'])
def unassignObservation(pid, oid):
    
    if 'application/json' in request.accept_mimetypes:
        try:

            ## Check for valid IDs
            pidValid = doesPidExist(pid)
            if not pidValid:
                return(makeResponse(msg_none), 404)

            oidValid = doesOidExist(oid)
            if not oidValid:
                return(makeResponse(msg_none), 404)

            query = ("UPDATE observations SET project_id = Null WHERE oid = " + oid + ";")

            con = dbconnect()
            cursor = con.cursor()
            cursor.execute(query)
            con.commit()

            get_query = ("select oid, project_id, title, notes, measurements, latitude, longitude "
                        "from observations where oid = " + oid + ";")
            cursor.execute(get_query)
            row_headers=[x[0] for x in cursor.description]
            row_headers.append('self')
            results = cursor.fetchall()
            cursor.close()
            disconnect(con)

            item_list = []
            for row in results:
                url = (request.host_url + "api/observations/" + str(row[0]),)
                new_tup = row + url
                item_list.append(dict(zip(row_headers, new_tup)))

            msg_pass = json.dumps(
                item_list,
                indent=4,
                separators=(',', ':'),
                default=str
            )
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
    else:
        return(makeResponse(msg_accept_type), 406)

## --------------------------------------------------------------------##
## Linking Operations Between Observations and Images
## --------------------------------------------------------------------##

## -------------------------------------------##
## Assign Image to Observation
## -------------------------------------------##
@observations_api.route('/api/observations/<oid>/images/<iid>', methods=['PUT'])
def assignImageToObservation(oid, iid):

    if 'application/json' in request.accept_mimetypes:
        try:
            ## Check for valid IDs

            iidValid = doesIidExist(iid)
            if not iidValid:
                return(makeResponse(msg_none), 404)

            oidValid = doesOidExist(oid)
            if not oidValid:
                return(makeResponse(msg_none), 404)

            query = ("UPDATE images SET observation = " + oid +
                    " WHERE iid = " + iid + ";")
            
            con = dbconnect()
            cursor = con.cursor()
            cursor.execute(query)
            con.commit()

            get_query = ("select iid, project, observation, file_name, file_type, file_path "
                        "from images where iid = " + iid + ";")
            cursor.execute(get_query)
            row_headers=[x[0] for x in cursor.description]
            row_headers.append('self')
            results = cursor.fetchall()
            cursor.close()
            disconnect(con)

            item_list = []
            for row in results:
                url = (request.host_url + "api/images/" + str(row[0]),)
                new_tup = row + url
                item_list.append(dict(zip(row_headers, new_tup)))

            msg_pass = json.dumps(
                item_list,
                indent=4,
                separators=(',', ':'),
                default=str
            )
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

    else:

        return(makeResponse(msg_accept_type), 406)

    

## -------------------------------------------##
## Unassign Observation from Project
## -------------------------------------------##
@observations_api.route('/api/observations/<oid>/images/<iid>', methods=['DELETE'])
def unassignImageFromObservation(oid, iid):
    
    if 'application/json' in request.accept_mimetypes:
        try:

            iidValid = doesIidExist(iid)
            if not iidValid:
                return(makeResponse(msg_none), 404)

            oidValid = doesOidExist(oid)
            if not oidValid:
                return(makeResponse(msg_none), 404)

            query = ("UPDATE images SET observation = Null WHERE iid = " + iid + ";")

            con = dbconnect()
            cursor = con.cursor()
            cursor.execute(query)
            con.commit()

            get_query = ("select iid, project, observation, file_name, file_type, file_path "
                        "from images where iid = " + iid + ";")
            cursor.execute(get_query)
            row_headers=[x[0] for x in cursor.description]
            row_headers.append('self')
            results = cursor.fetchall()
            cursor.close()
            disconnect(con)

            item_list = []
            for row in results:
                url = (request.host_url + "api/images/" + str(row[0]),)
                new_tup = row + url
                item_list.append(dict(zip(row_headers, new_tup)))

            msg_pass = json.dumps(
                item_list,
                indent=4,
                separators=(',', ':'),
                default=str
            )
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
    else:
        return(makeResponse(msg_accept_type), 406)