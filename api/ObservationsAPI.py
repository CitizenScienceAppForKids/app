from flask import Flask, Blueprint, request, make_response
from json2html import *
import json
import datetime
from functions.dbconnection import *
from functions.validation import *


observations_api = Blueprint('observations_api', __name__)

## ----------------------------------------------------------------------------------------##
## ENDPOINT Glossary
## ----------------------------------------------------------------------------------------##
##
## Create an Observation                        POST /observations
## Create an Observation for a Project          POST /project/<pid>/observations
## View an Observation                          GET /observations/<oid>
## View all Observations                        GET /observations
## View all Observations for Project            GET /projects/<pid>/observations
## Edit an Observation                          PATCH /observations/<oid>
## Delete an Observation                        DELETE  /observations/<oid>
## Assign Observation to Project                PUT /projects/<pid>/observations/<oid>
## Unassign Observation from Project            DELETE /projects/<pid>/observations/<oid>
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
@observations_api.route('/observations', methods=['POST'])
def createObservation():
    # Check for valid content type
    if request.content_type != "application/json":
        rsp_json = make_response(msg_content_type)
        rsp_json.headers.set('Content-Type', 'application/json')
        return (rsp_json, 406)
    # Check for valid accept type
    elif 'application/json' not in request.accept_mimetypes:
        rsp_json = make_response(msg_accept_type)
        rsp_json.headers.set('Content-Type', 'application/json')
        return (rsp_json, 406)
    else:
        try:
            # Retrieve request json
            content = request.get_json()

            
            # Check for All Required Attributes & Validate
            try:
                if content["date"] and content["title"] and content["notes"]:
                    if not validateAllObservationData(content):
                        rsp_json = make_response(msg_invl)
                        rsp_json.headers.set('Content-Type', 'application/json')
                        return(rsp_json, 400)
            except:
                rsp_json = make_response(msg_miss)
                rsp_json.headers.set('Content-Type', 'application/json')
                return (rsp_json, 400)

            # Check for optional field
            if "measurments" not in content:
                content["measurements"] = ""
            # Check for optional field
            if "latitude" not in content:
                content["latitude"] = "0"
            # Check for optional field
            if "longitude" not in content:
                content["longitude"] = "0"

            #open db connection
            con = dbconnect()
            cursor = con.cursor()

            # Create new Observation
            query = ("INSERT INTO observations (date, title, notes, measurements, latitude, longitude) VALUES "
                    "('" + content["date"] + "', '" + content["title"] + "', '" + content["notes"] + "', '" 
                    + content["measurements"] + "', " + str(content["latitude"]) + ", " + str(content["longitude"]) + ");")
            
            cursor.execute(query)
            con.commit()
            new_id = cursor.lastrowid

            msg_pass = json.dumps([{
                "oid": new_id,
                "date": content["date"], 
                "title": content["title"], 
                "notes": content["notes"], 
                "measurements": content["measurements"],
                "latitude": float(content["latitude"]),
                "longitude": float(content["longitude"]),
                "self": request.url + "/" + str(new_id)}],
                indent=4, separators=(',', ':'))
            rsp_json = make_response(msg_pass)
            rsp_json.headers.set('Content-Type', 'application/json')
            cursor.close()
            disconnect(con)
            return (rsp_json, 201)

        except:
            if cursor:
                cursor.close()
            if con:
                disconnect(con)
            rsp_json = make_response(msg_fail)
            rsp_json.headers.set('Content-Type', 'application/json')
            return (rsp_json, 500)

## -------------------------------------------##
## Create an Observation for a Project
## -------------------------------------------##
@observations_api.route('/projects/<pid>/observations', methods=['POST'])
def createProjectObservation(pid):
    # Check for valid content type
    if request.content_type != "application/json":
        rsp_json = make_response(msg_content_type)
        rsp_json.headers.set('Content-Type', 'application/json')
        return (rsp_json, 406)
    # Check for valid accept type
    elif 'application/json' not in request.accept_mimetypes:
        rsp_json = make_response(msg_accept_type)
        rsp_json.headers.set('Content-Type', 'application/json')
        return (rsp_json, 406)
    else:
        try:
            # Retrieve request json
            content = request.get_json()

            #open db connection
            con = dbconnect()
            cursor = con.cursor()

            ## Check if pid exists
            precheck = ("SELECT pid from projects WHERE pid = " + pid + ";")
            cursor.execute(precheck)
            results = cursor.fetchall()

            if len(results) <= 0:
                cursor.close()
                disconnect(con)
                rsp_json = make_response(msg_none)
                rsp_json.headers.set('Content-Type', 'application/json')
                return (rsp_json, 404)
            
            # Check for All Required Attributes & Validate
            try:
                if content["date"] and content["title"] and content["notes"]:
                    if not validateAllObservationData(content):
                        cursor.close()
                        disconnect(con)
                        rsp_json = make_response(msg_invl)
                        rsp_json.headers.set('Content-Type', 'application/json')
                        return(rsp_json, 400)
            except:
                cursor.close()
                disconnect(con)
                rsp_json = make_response(msg_miss)
                rsp_json.headers.set('Content-Type', 'application/json')
                return (rsp_json, 400)

            # Check for optional field
            if "measurments" not in content:
                content["measurements"] = ""
            # Check for optional field
            if "latitude" not in content:
                content["latitude"] = "0"
            # Check for optional field
            if "longitude" not in content:
                content["longitude"] = "0"

            # Create new Observation
            con = dbconnect()
            cursor = con.cursor()

            query = ("INSERT INTO observations (project_id, date, title, notes, measurements, latitude, longitude) VALUES "
                    "(" + pid + ", '" + content["date"] + "', '" + content["title"] + "', '" + content["notes"] + "', '" 
                    + content["measurements"] + "', " + str(content["latitude"]) + ", " + str(content["longitude"]) + ");")

            cursor.execute(query)
            con.commit()
            new_id = cursor.lastrowid

            print("here")
            msg_pass = json.dumps([{
                "oid": new_id,
                "project_id": pid,
                "date": content["date"], 
                "title": content["title"], 
                "notes": content["notes"], 
                "measurements": content["measurements"],
                "latitude": float(content["latitude"]),
                "longitude": float(content["longitude"]),
                "self": request.url + "/" + str(new_id)}],
                indent=4, separators=(',', ':'))
            rsp_json = make_response(msg_pass)
            rsp_json.headers.set('Content-Type', 'application/json')
            cursor.close()
            disconnect(con)
            return (rsp_json, 201)

        except:
            if cursor:
                cursor.close()
            if con:
                disconnect(con)
            rsp_json = make_response(msg_fail)
            rsp_json.headers.set('Content-Type', 'application/json')
            return (rsp_json, 500)
    
## -------------------------------------------##
## View an Observation
## -------------------------------------------##
@observations_api.route('/observations/<oid>', methods=['GET'])
def viewObservation(oid):
    # Check for valid accept type
    if 'application/json' in request.accept_mimetypes:

        try:

            #open db connection
            con = dbconnect()
            cursor = con.cursor()

            ## Check if pid exists
            precheck = ("SELECT oid from observations WHERE oid = " + oid + ";")
            cursor.execute(precheck)
            results = cursor.fetchall()

            if len(results) <= 0:
                cursor.close()
                disconnect(con)
                rsp_json = make_response(msg_none)
                rsp_json.headers.set('Content-Type', 'application/json')
                return (rsp_json, 404)


            # query = ("SELECT p.pid, p.type, p.title, o.oid, o.title, o.date, o.notes, o.measurements, o.latitude, o.longitude "
            #         "from observations o inner join projects p ON p.pid = o.project_id WHERE o.oid = " + oid + " ORDER BY o.date;")

            query = ("SELECT oid, title, date, notes, measurements, latitude, longitude from observations where oid = " + oid + ";")
            cursor.execute(query)
            row_headers=[x[0] for x in cursor.description]
            row_headers.append('self')
            results = cursor.fetchall()

            observation_list = []

            if len(results) > 0:
                for row in results:
                    url = (request.url,)
                    new_tup = row + url
                    observation_list.append(dict(zip(row_headers, new_tup)))

            rsp_json = make_response(json.dumps(
                observation_list, 
                indent=2,
                separators=(',', ':'),
                default=str))
            rsp_json.headers.set('Content-Type', 'application/json')

            cursor.close()
            disconnect(con)
            return (rsp_json, 200)

        except:
            if cursor:
                cursor.close()
            if con:
                disconnect(con)
            rsp_json = make_response(msg_fail)
            rsp_json.headers.set('Content-Type', 'application/json')
            return (rsp_json, 500)
    else:
        rsp_json = make_response(msg_accept_type)
        rsp_json.headers.set('Content-Type', 'application/json')
        return (rsp_json, 406)

## -------------------------------------------##
## View all Observations
## -------------------------------------------##
@observations_api.route('/observations', methods=['GET'])
def viewAllObservations():
    # Check for valid accept type
    if 'application/json' in request.accept_mimetypes:

        try:
            con = dbconnect()
            # query = ("SELECT o.oid, o.title, o.date, o.notes, o.measurements, o.latitude, o.longitude, p.pid, p.type, p.title "
            #         "from observations o left join projects p ON p.pid = o.project_id ORDER BY p.pid;")

            query = ("SELECT oid, title, date, notes, measurements, latitude, longitude from observations;")
            cursor = con.cursor()
            cursor.execute(query)
            row_headers=[x[0] for x in cursor.description]
            row_headers.append('self')
            results = cursor.fetchall()

            observation_list = []

            if len(results) > 0:
                for row in results:
                    url = (request.url + "/" + str(row[0]),)
                    new_tup = row + url
                    observation_list.append(dict(zip(row_headers, new_tup)))

            rsp_json = make_response(json.dumps(
                observation_list, 
                indent=2,
                separators=(',', ':'),
                default=str))
            rsp_json.headers.set('Content-Type', 'application/json')

            cursor.close()
            disconnect(con)
            return (rsp_json, 200)

        except:
            if cursor:
                cursor.close()
            if con:
                disconnect(con)
            rsp_json = make_response(msg_fail)
            rsp_json.headers.set('Content-Type', 'application/json')
            return (rsp_json, 500)
    else:
        rsp_json = make_response(msg_accept_type)
        rsp_json.headers.set('Content-Type', 'application/json')
        return (rsp_json, 406)

## -------------------------------------------##
## View all Observations for Project
## -------------------------------------------##
@observations_api.route('/projects/<pid>/observations', methods=['GET'])
def viewAllProjectObservations(pid):
    # Check for valid accept type
    if 'application/json' in request.accept_mimetypes:

        try:
            con = dbconnect()
            query = ("SELECT o.oid, o.title, o.date, o.notes, o.measurements, o.latitude, o.longitude "
                    "from observations o left join projects p ON p.pid = o.project_id WHERE p.pid = " + pid + ";")

            cursor = con.cursor()
            cursor.execute(query)
            row_headers=[x[0] for x in cursor.description]
            row_headers.append('self')
            results = cursor.fetchall()

            observation_list = []

            if len(results) > 0:
                for row in results:
                    url = (request.url,)
                    new_tup = row + url
                    observation_list.append(dict(zip(row_headers, new_tup)))

            rsp_json = make_response(json.dumps(
                observation_list, 
                indent=2,
                separators=(',', ':'),
                default=str))
            rsp_json.headers.set('Content-Type', 'application/json')

            cursor.close()
            disconnect(con)
            return (rsp_json, 200)

        except:
            if cursor:
                cursor.close()
            if con:
                disconnect(con)
            rsp_json = make_response(msg_fail)
            rsp_json.headers.set('Content-Type', 'application/json')
            return (rsp_json, 500)
    else:
        rsp_json = make_response(msg_accept_type)
        rsp_json.headers.set('Content-Type', 'application/json')
        return (msg_accept_type, 406)
    
## -------------------------------------------##
## Edit an Observation
## -------------------------------------------##
@observations_api.route('/observations/<oid>', methods=['PATCH'])
def patchObservation(oid):
    # Check for valid content type
    if request.content_type != "application/json":
        rsp_json = make_response(msg_content_type)
        rsp_json.headers.set('Content-Type', 'application/json')
        return (rsp_json, 406)
    # Check for valid accept type
    elif 'application/json' not in request.accept_mimetypes:
        rsp_json = make_response(msg_accept_type)
        rsp_json.headers.set('Content-Type', 'application/json')
        return (rsp_json, 406)
    else:
        try:
            # Retrieve request json
            content = request.get_json()

            ## Open Connection
            con = dbconnect()
            cursor = con.cursor()

            ## Check if oid exists
            precheck = ("SELECT oid from observations WHERE pid = '" + pid + "';")
            cursor.execute(precheck)
            results = cursor.fetchall()

            if len(results) <= 0:
                cursor.close()
                disconnect(con)
                rsp_json = make_response(msg_none)
                rsp_json.headers.set('Content-Type', 'application/json')
                return (rsp_json, 404)

            ## Build Update String
            query = "UPDATE projects SET "

            first = True
            for i in content:
                
                if not first:
                    query += ", "
                else:
                    first = False

                if i == "project_id":
                    query += "[project_id] = '" + content["project_id"] + "'"
                elif i == "date":
                    query += "date = '" + content["date"] + "'"
                elif i == "title":
                    query += "title = '" + content["title"] + "'"
                elif i == "notes":
                    query += "notes = '" + content["notes"] + "'"
                elif i == "measurements":
                    query += "measurements = '" + content["measurements"] + "'"
                elif i == "latitude":
                    query += "latitude = '" + content["latitude"] + "'"
                elif i == "longitude":
                    query += "longitude = '" + content["longitude"] + "'"

            query += " WHERE oid = " + oid + ";"
            cursor.execute(query)
            con.commit()

            ## Retrieve updated object
            check = ("select oid, project_id, title, notes, measurements, latitude, longitude "
                    "from observations where oid = " + oid + ";")

            cursor.execute(check)
            row_headers=[x[0] for x in cursor.description]
            row_headers.append('self')
            results = cursor.fetchall()

            observation_list = []

            if len(results) > 0:
                for row in results:
                    url = (request.url,)
                    new_tup = row + url
                    observation_list.append(dict(zip(row_headers, new_tup)))

            ## Return object JSON
            rsp_json = make_response(json.dumps(
                observation_list, 
                indent=2,
                separators=(',', ':'),
                default=str))
            rsp_json.headers.set('Content-Type', 'application/json')
        
            cursor.close()
            disconnect(con)
            return (rsp_json, 201)

        except:
            if cursor:
                cursor.close()
            if con:
                disconnect(con)
            rsp_json = make_response(msg_fail)
            rsp_json.headers.set('Content-Type', 'application/json')
            return (rsp_json, 500)
 
## -------------------------------------------##
## Delete an Observation
## -------------------------------------------##
@observations_api.route('/observations/<oid>', methods=['DELETE'])
def deleteObservation(oid):
    try:
        con = dbconnect()
        cursor = con.cursor()
        query = ("SELECT oid from observations WHERE oid = '" + oid + "';")
        cursor.execute(query)
        results = cursor.fetchall()

        if len(results) <= 0:
            cursor.close()
            disconnect(con)
            rsp_json = make_response(msg_none)
            rsp_json.headers.set('Content-Type', 'application/json')
            return (rsp_json, 404)
        else:
            # Delete Project
            query = ("DELETE from observations WHERE oid = " + oid + ";")
            cursor.execute(query)
            con.commit()
            cursor.close()
            disconnect(con)
            rsp_json = make_response('')
            rsp_json.headers.set('Content-Type', 'application/json')
            return (rsp_json, 204)

    except:
        if cursor:
            cursor.close()
        if con:
            disconnect(con)
        rsp_json = make_response(msg_fail)
        rsp_json.headers.set('Content-Type', 'application/json')
        return (rsp_json, 500)


## --------------------------------------------------------------------##
## Linking Operations Between Projects and Observations
## --------------------------------------------------------------------##

## -------------------------------------------##
## Assign Observation to Project
## -------------------------------------------##
@observations_api.route('/projects/<pid>/observations/<oid>', methods=['PUT'])
def assignObservation(pid, oid):
    rsp_json = make_response(msg_pass)
    rsp_json.headers.set('Content-Type', 'application/json')
    return (rsp_json, 201)

## -------------------------------------------##
## Unassign Observation from Project
## -------------------------------------------##
@observations_api.route('/projects/<pid>/observations/<oid>', methods=['DELETE'])
def unassignObservation(pid, oid):
    rsp_json = make_response(msg_pass)
    rsp_json.headers.set('Content-Type', 'application/json')
    return (rsp_json, 201)

