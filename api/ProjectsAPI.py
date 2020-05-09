from flask import Flask, Blueprint, request, make_response
from json2html import *
import json
from api.functions.utilities import *
from api.functions.validation import *
from api.functions.helpers import *

projects_api = Blueprint('projects_api', __name__)

## --------------------------------------------------------------------##
## Projects ENDPOINT Glossary
## --------------------------------------------------------------------##
##
## Create a Project                             POST /api/projects
## View a Project                               GET /api/projects/<pid>
## View all Project                             GET /api/projects
## Edit a Project                               PATCH /api/projects/<pid>
## Delete a Project                             DELETE /api/projects/<pid>
## Assign Image to Project                      PUT  /api/projects/<pid>/images/<iid>
## Unassign Image from Project                  DELETE /api/projects/<pid/images/<iid>
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
@projects_api.route('/api/projects', methods=['POST'])
def createProject():

    if request.content_type != "application/json":
        return(makeResponse(msg_content_type), 406)
    elif 'application/json' not in request.accept_mimetypes:
        return(makeResponse(msg_accept_type), 406)
    else:
        try:
            # Get request information
            content = request.get_json()
            
            # Check for All Required Project Attributes & Validate
            try:
                if content["type"] and content["title"] and content["description"]:
                    if not validateAllProjectData(content):
                        return(makeResponse(msg_invl), 400)
            except:
                return(makeResponse(msg_miss), 400)

            # Check for All Required Image Attributes & Validate
            image = False
            try:
                if content["image"]:
                    try:
                        if content["image"]["file_name"] and content["image"]["file_type"] and content["image"]["file_path"]:
                            if not validateImage(content["image"]):
                                return(makeResponse(msg_invl), 400)
                            else:
                                image = True
                    except:
                        return(makeResponse(msg_miss), 400)
            except:
                pass
            
            # Check for Uniqueness of Title
            isUnique = isValueUnique(content["title"])
            if not isUnique:
                return(makeResponse(msg_uniq), 403)

            # Create new Project
            con = dbconnect()
            cursor = con.cursor()
            query = ("INSERT INTO projects (type, title, description) VALUES ('"
                    + content["type"] + "', '"
                    + content["title"] + "', '" 
                    + content["description"] + "');")

            cursor.execute(query)
            con.commit()
            new_id = cursor.lastrowid

            if image:
                img_query = ("INSERT INTO images (project, file_name, file_type, file_path) VALUES ("
                            + str(new_id) + ", '"
                            + content["image"]["file_name"] + "', '"
                            + content["image"]["file_type"] + "', '"
                            + content["image"]["file_path"] + "');")

                cursor.execute(img_query)
                con.commit()
                new_img_id = cursor.lastrowid

                # Write success response
                msg_pass = json.dumps([{
                    "pid": new_id, 
                    "type": content["type"], 
                    "title": content["title"], 
                    "description": content["description"],
                    "image": {
                        "iid": new_img_id,
                        "project": new_id,
                        "file_name": content["image"]["file_name"],
                        "file_type": content["image"]["file_type"],
                        "file_path": content["image"]["file_path"],
                        "self": request.host_url + "images/" + str(new_img_id)
                    },
                    "self": request.url + "/" + str(new_id)}],
                    indent=4, separators=(',', ':'))
            else:
                msg_pass = json.dumps([{
                    "pid": new_id, 
                    "type": content["type"], 
                    "title": content["title"], 
                    "description": content["description"],
                    "image": None,
                    "self": request.url + "/" + str(new_id)}],
                    indent=4, separators=(',', ':'))
                
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
## View a Project
## -------------------------------------------##
@projects_api.route('/api/projects/<pid>', methods=['GET'])
def viewProject(pid):
    
    if 'application/json' in request.accept_mimetypes:

        try:
            # Open connection and query database for project
            con = dbconnect()
            query = ("SELECT p.pid, p.type, p.title, p.description, i.iid, i.project, i.file_name, i.file_type, i.file_path "
                    "from projects p inner join images i ON i.project = p.pid "
                    "WHERE p.pid = " + pid + ";")
            cursor = con.cursor()
            cursor.execute(query)
            row_headers=[x[0] for x in cursor.description]
            row_headers.append('self')
            results = cursor.fetchall()

            project_list = []

            if len(results) > 0:
                for row in results:
                    url = (request.url,)
                    new_tup = row + url
                    project_list.append(dict(zip(row_headers, new_tup)))

                cursor.close()
                disconnect(con)
                if project_list[0]["iid"]:
                    msg_pass = json.dumps([{
                            "pid": project_list[0]["pid"], 
                            "type": project_list[0]["type"], 
                            "title": project_list[0]["title"], 
                            "description": project_list[0]["description"],
                            "image": {
                                "iid": project_list[0]["iid"],
                                "project": project_list[0]["project"],
                                "file_name": project_list[0]["file_name"],
                                "file_type": project_list[0]["file_type"],
                                "file_path": project_list[0]["file_path"],
                                "self": request.host_url + "images/" + str(project_list[0]["iid"])
                            },
                            "self": request.url}],
                            indent=4, separators=(',', ':'))
                    return(makeResponse(msg_pass), 200)
                else:

                    ## Write success message
                    msg_pass = json.dumps(
                        project_list,
                        indent=4, separators=(',', ':'))
                    return(makeResponse(msg_pass), 200)

            ## No project with that id is found
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
## View all Project
## -------------------------------------------##
@projects_api.route('/api/projects', methods=['GET'])
def viewAllProjects():

    # Check for valid accept-type
    if 'application/json' in request.accept_mimetypes:

        try:
            # Open DB connection and query for projects
            con = dbconnect()
            query = ("SELECT pid, type, title, description from projects;")
            cursor = con.cursor()
            cursor.execute(query)
            row_headers=[x[0] for x in cursor.description]
            row_headers.append('images')
            row_headers.append('self')
            results = cursor.fetchall()

            project_list = []

            # Write results to JSON object
            if len(results) > 0:
                for row in results:
                    img_query = ("SELECT iid, project, file_name, file_type, file_path from images WHERE project = " + str(row[0]))

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
                                            "self": request.host + "/api/images/" + str(i[0])
                                            })
                    imgs = (img_list,)
                    img_tup = row + imgs
                    url = (request.url + "/" + str(row[0]),)
                    url_tup = img_tup + url
                    project_list.append(dict(zip(row_headers, url_tup)))

            cursor.close()
            disconnect(con)
            return(makeResponse(json.dumps(
                project_list, 
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
## Edit a Project
## -------------------------------------------##
@projects_api.route('/api/projects/<pid>', methods=['PATCH'])
def patchProject(pid):

    if request.content_type != "application/json":
        return(makeResponse(msg_content_type), 406)
    elif 'application/json' not in request.accept_mimetypes:
        return(makeResponse(msg_accept_type), 406)
    else:
        try:
            # Get request values
            content = request.get_json()

            valid = doesPidExist(pid)
            if not valid:
                return(makeResponse(msg_none), 404)

            # Check for Uniqueness of Title
            try:
                isUnique = isValueUnique(content["title"])
                if not isUnique:
                    return(makeResponse(msg_uniq), 403)
            except:
                pass

            ## Build UPDATE String
            update = createUpdateQuery(content, pid)
            
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
                    imageExists = hasImage(pid)
                    # If there is already an image
                    if imageExists:
                        img_update = createImageUpdateQuery(content["image"], pid)
                    # Otherwise create new image
                    else:
                        if not validateImage(content["image"]):
                            return(makeResponse(msg_miss), 400)
                        else:
                            img_update = (True,
                            ("INSERT INTO images (project, file_name, file_type, file_path) VALUES ("
                                + str(pid) + ", '"
                                + content["image"]["file_name"] + "', '"
                                + content["image"]["file_type"] + "', '"
                                + content["image"]["file_path"] + "');"))

                    print("-------------")
                    print(img_update)
                    print("-------------")
                    if img_update[0]:
                        con = dbconnect()
                        cursor = con.cursor()
                        cursor.execute(img_update[1])
                        con.commit()
                        cursor.close()
                        disconnect(con) 
                      
            except:
                pass

            ## Retrieve the updated object
            new_query = ("select pid, type, title, description "
                    "from projects where pid = " + pid + ";")
            con = dbconnect()
            cursor = con.cursor()
            cursor.execute(new_query)
            row_headers=[x[0] for x in cursor.description]
            row_headers.append('image')
            row_headers.append('self')
            results = cursor.fetchall()

            project_list = []
            # Write results to JSON object
            if len(results) > 0:
                for row in results:
                    img_query = ("SELECT iid, project, file_name, file_type, file_path from images WHERE project = " + str(row[0]))

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
                                            "self": request.host + "/api/images/" + str(i[0])
                                            })
                    imgs = (img_list,)
                    img_tup = row + imgs
                    url = (request.url,)
                    url_tup = img_tup + url
                    project_list.append(dict(zip(row_headers, url_tup)))

            ## Return the new object JSON
            cursor.close()
            disconnect(con)
            return(makeResponse(json.dumps(
                project_list, 
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
## Delete a Project
## -------------------------------------------##
@projects_api.route('/api/projects/<pid>', methods=['DELETE'])
def deleteProject(pid):
    try:
        
        # Check if Pid exists
        if not doesPidExist(pid):
            return(makeResponse(msg_none), 404)
        else:
            # Delete Project
            query = ("DELETE from projects WHERE pid = " + pid + ";")
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


## --------------------------------------------------------------------##
## Linking Operations Projects and Images
## --------------------------------------------------------------------##

## -------------------------------------------##
## Assign Image to Project
## -------------------------------------------##
@projects_api.route('/api/projects/<pid>/images/<iid>', methods=['PUT'])
def assignImageToProject(pid, iid):

    if 'application/json' in request.accept_mimetypes:
        try:
            ## Check for valid IDs
            iidValid = doesIidExist(iid)
            if not iidValid:
                return(makeResponse(msg_none), 404)

            pidValid = doesPidExist(pid)
            if not pidValid:
                return(makeResponse(msg_none), 404)

            query = ("UPDATE images SET project = " + pid +
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
## Unassign Image from Project
## -------------------------------------------##
@projects_api.route('/api/projects/<pid>/images/<iid>', methods=['DELETE'])
def unassignImageFromProject(pid, iid):
    
    if 'application/json' in request.accept_mimetypes:
        try:

            iidValid = doesIidExist(iid)
            if not iidValid:
                return(makeResponse(msg_none), 404)

            pidValid = doesPidExist(pid)
            if not pidValid:
                return(makeResponse(msg_none), 404)

            query = ("UPDATE images SET project = Null WHERE iid = " + iid + ";")

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