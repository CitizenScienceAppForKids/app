from flask import Flask, Blueprint, request, make_response
from json2html import *
import json
from functions.dbconnection import *
from functions.validation import *

projects_api = Blueprint('projects_api', __name__)

## --------------------------------------------------------------------##
## Projects ENDPOINT Glossary
## --------------------------------------------------------------------##
##
## Create a Project                             POST /projects
## View a Project                               GET /projects/<pid>
## View all Project                             GET /projects
## Edit a Project                               PATCH /projects/<pid>
## Delete a Project                             DELETE /projects/<pid>
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
## Create a Project
## -------------------------------------------##
@projects_api.route('/projects', methods=['POST'])
def createProject():

    ## Check for valid content-type
    if request.content_type != "application/json":
        rsp_json = make_response(msg_content_type)
        rsp_json.headers.set('Content-Type', 'application/json')
        return (rsp_json, 406)
    ## Check for valid accept-type
    elif 'application/json' not in request.accept_mimetypes:
        rsp_json = make_response(msg_accept_type)
        rsp_json.headers.set('Content-Type', 'application/json')
        return (rsp_json, 406)
    else:
        try:
            # Get request information
            content = request.get_json()
            
            # Check for All Required Attributes & Validate
            try:
                if content["type"] and content["title"] and content["description"]:
                    if not validateAllProjectData(content):
                        rsp_json = make_response(msg_invl)
                        rsp_json.headers.set('Content-Type', 'application/json')
                        return(rsp_json, 400)
            except:
                rsp_json = make_response(msg_miss)
                rsp_json.headers.set('Content-Type', 'application/json')
                return (rsp_json, 400)

            # Check for Uniqueness of Title
            con = dbconnect()
            cursor = con.cursor()
            uniq = ("SELECT title from projects "
                    " WHERE title = '" + content["title"] + "';")
            cursor.execute(uniq)
            results = cursor.fetchall()

            # If results returned, then not unique
            if len(results) > 0:
                cursor.close()
                disconnect(con)
                rsp_json = make_response(msg_uniq)
                rsp_json.headers.set('Content-Type', 'application/json')
                return (rsp_json, 403)

            # Create new Project
            query = ("INSERT INTO projects (type, title, description) VALUES ('"
                    + content["type"] + "', '"
                    + content["title"] + "', '" 
                    + content["description"] + "');")
            cursor.execute(query)
            con.commit()
            new_id = cursor.lastrowid

            # Write success response
            msg_pass = json.dumps([{
                "pid": new_id, 
                "type": content["type"], 
                "title": content["title"], 
                "description": content["description"], 
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
## View a Project
## -------------------------------------------##
@projects_api.route('/projects/<pid>', methods=['GET'])
def viewProject(pid):
    
    ## Check for valid accept-type
    if 'application/json' in request.accept_mimetypes:

        try:
            # Open connection and query database for project
            con = dbconnect()
            # query = ("SELECT p.pid, p.type, p.title, i.iid, i.file_name, i.file_type, i.file_path "
            #         "from projects p inner join images i ON i.project = p.pid "
            #         "WHERE p.pid = " + pid + ";")

            query= ("SELECT pid, type, title, description from projects WHERE pid = " + pid + ";")
            cursor = con.cursor()
            cursor.execute(query)
            row_headers=[x[0] for x in cursor.description]
            row_headers.append('self')
            results = cursor.fetchall()

            project_list = []

            ## Check for a project with this id
            if len(results) > 0:
                for row in results:
                    url = (request.url,)
                    new_tup = row + url
                    print(type(new_tup))
                    project_list.append(dict(zip(row_headers, new_tup)))

                cursor.close()
                disconnect(con)

                ## Write success message
                msg_pass = json.dumps(
                    project_list,
                    indent=4, separators=(',', ':'))
                rsp_json = make_response(msg_pass)
                rsp_json.headers.set('Content-Type', 'application/json')
                return (rsp_json, 200)
            ## No project with that id is found
            else:
                cursor.close()
                disconnect(con)
                rsp_json = make_response(msg_none)
                rsp_json.headers.set('Content-Type', 'application/json')
                return (rsp_json, 404)

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
## View all Project
## -------------------------------------------##
@projects_api.route('/projects', methods=['GET'])
def viewAllProjects():

    # Check for valid accept-type
    if 'application/json' in request.accept_mimetypes:

        try:
            # Open DB connection and query for projects
            con = dbconnect()
            # query = ("SELECT p.pid, p.type, p.title, i.iid, i.file_name, i.file_type, i.file_path "
            #         "from projects p left join images i ON i.project = p.pid;")
            query= ("SELECT pid, type, title, description from projects;")
            cursor = con.cursor()
            cursor.execute(query)
            row_headers=[x[0] for x in cursor.description]
            row_headers.append('self')
            results = cursor.fetchall()

            project_list = []

            # Write results to JSON object
            if len(results) > 0:
                for row in results:
                    url = (request.url + "/" + str(row[0]),)
                    new_tup = row + url
                    print(type(new_tup))
                    project_list.append(dict(zip(row_headers, new_tup)))

            msg_json = make_response(json.dumps(
                project_list, 
                indent=2,
                separators=(',', ':')))
            msg_json.headers.set('Content-Type', 'application/json')

            cursor.close()
            disconnect(con)
            return (msg_json, 200)

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
## Edit a Project
## -------------------------------------------##
@projects_api.route('/projects/<pid>', methods=['PATCH'])
def patchProject(pid):

    # Check for valid content-type
    if request.content_type != "application/json":
        rsp_json = make_response(msg_content_type)
        rsp_json.headers.set('Content-Type', 'application/json')
        return (rsp_json, 406)
    # Check for valid accept-type
    elif 'application/json' not in request.accept_mimetypes:
        rsp_json = make_response(msg_accept_type)
        rsp_json.headers.set('Content-Type', 'application/json')
        return (rsp_json, 406)
    else:
        try:
            # Get request values
            content = request.get_json()

            ## Open Connection
            con = dbconnect()
            cursor = con.cursor()

            ## Check if the pid exists
            precheck = ("SELECT pid from projects WHERE pid = '" + pid + "';")
            cursor.execute(precheck)
            results = cursor.fetchall()

            ## If no result, not a valid ID
            if len(results) <= 0:
                cursor.close()
                disconnect(con)
                rsp_json = make_response(msg_none)
                rsp_json.headers.set('Content-Type', 'application/json')
                return (rsp_json, 404)

            ## Build UPDATE String
            query = "UPDATE projects SET "

            first = True
            for i in content:
                
                if not first:
                    query += ", "
                else:
                    first = False

                if i == "title":
                    uniq = ("SELECT title from projects "
                    " WHERE title = '" + content["title"] + "';")
                    cursor.execute(uniq)
                    results = cursor.fetchall()

                    if len(results) > 0:
                        cursor.close()
                        disconnect(con)
                        rsp_json = make_response(msg_uniq)
                        rsp_json.headers.set('Content-Type', 'application/json')
                        return (rsp_json, 403)
                    else:
                        query += "title = '" + content["title"] + "'"

                elif i == "type":
                    query += "type = '" + content["type"] + "'"
                elif i == "description":
                    query += "description = '" + content["description"] + "'"

            query += " WHERE pid = " + pid + ";"
            cursor.execute(query)
            con.commit()

            ## Retrieve the updated object
            check = ("select pid, type, title, description "
                    "from projects where pid = " + pid + ";")

            cursor.execute(check)
            row_headers=[x[0] for x in cursor.description]
            row_headers.append('self')
            results = cursor.fetchall()

            project_list = []

            if len(results) > 0:
                for row in results:
                    url = (request.url,)
                    new_tup = row + url
                    project_list.append(dict(zip(row_headers, new_tup)))

            ## Return the new object JSON
            rsp_json = make_response(json.dumps(
                project_list, 
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
## Delete a Project
## -------------------------------------------##
@projects_api.route('/projects/<pid>', methods=['DELETE'])
def deleteProject(pid):
    try:
        # Open DB connection and see if pid exissts
        con = dbconnect()
        cursor = con.cursor()
        query = ("SELECT pid from projects WHERE pid = '" + pid + "';")
        cursor.execute(query)
        results = cursor.fetchall()

        # If no results, then no pid exists
        if len(results) <= 0:
            con.commit()
            cursor.close()
            rsp_json = make_response(msg_none)
            rsp_json.headers.set('Content-Type', 'application/json')
            return (rsp_json, 404)
        else:
            # Delete Project
            query = ("DELETE from projects WHERE pid = " + pid + ";")
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
