#!/usr/bin/env python3
from flask import Flask, Blueprint, request, make_response
from json2html import *
import json
import os
from datetime import datetime
import mysql.connector
from mysql.connector import errorcode
from functions.utilities import *


def makeResponse(message):
    rsp_json = make_response(message)
    rsp_json.headers.set('Content-Type', 'application/json')
    return rsp_json


def isValueUnique(title):
    con = dbconnect()
    cursor = con.cursor()
    uniq = ("SELECT title from projects "
            " WHERE title = '" + title + "';")
    cursor.execute(uniq)
    results = cursor.fetchall()
    cursor.close()
    disconnect(con)

    # If results returned, then not unique
    if len(results) > 0:
        return False
    else:
        return True

def doesPidExist(pid):
    con = dbconnect()
    cursor = con.cursor()
    query = ("SELECT pid from projects WHERE pid = '" + pid + "';")
    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    disconnect(con)

    ## If no result, not a valid ID
    if len(results) > 0:
        return True
    else:
        return False

def doesOidExist(oid):
    con = dbconnect()
    cursor = con.cursor()
    query = ("SELECT oid from observations WHERE oid = '" + oid + "';")
    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    disconnect(con)

    ## If no result, not a valid ID
    if len(results) > 0:
        return True
    else:
        return False


def doesIidExist(iid):
    con = dbconnect()
    cursor = con.cursor()
    query = ("SELECT iid from images WHERE iid = '" + iid + "';")
    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    disconnect(con)

    ## If no result, not a valid ID
    if len(results) > 0:
        return True
    else:
        return False
        
def createUpdateQuery(content, pid):
    query = "UPDATE projects SET "

    update = False
    first = True
    for i in content:
        if not first:
            query += ", "
        else:
            first = False
 
        if i == "title":
            update = True
            query += "title = '" + content["title"] + "'"

        elif i == "type":
            update = True
            query += "type = '" + content["type"] + "'"
        elif i == "description":
            update = True
            query += "description = '" + content["description"] + "'"

    query += " WHERE pid = " + pid + ";"
    return (update, query)

def createObservationUpdateQuery(content, oid):
    ## Build Update String
    query = "UPDATE observations SET "

    update = False
    first = True
    for i in content:
        
        if not first:
            query += ", "
        else:
            first = False

        if i == "project_id":
            update = True
            query += "[project_id] = '" + content["project_id"] + "'"
        elif i == "date":
            update = True
            query += "date = '" + content["date"] + "'"
        elif i == "title":
            update = True
            query += "title = '" + content["title"] + "'"
        elif i == "notes":
            update = True
            query += "notes = '" + content["notes"] + "'"
        elif i == "measurements":
            update = True
            query += "measurements = '" + content["measurements"] + "'"
        elif i == "latitude":
            update = True
            query += "latitude = '" + str(content["latitude"]) + "'"
        elif i == "longitude":
            update = True
            query += "longitude = '" + str(content["longitude"]) + "'"

    query += " WHERE oid = " + oid + ";"
    return (update, query)

def createImageUpdateQuery(content, iid):
    query = "UPDATE images SET "

    update = False
    first = True
    for i in content:
        if not first:
            query += ", "
        else:
            if i == "file_name" or i == "file_type" or i == "file_path":
                first = False

        if i == "file_name":
            update = True
            query += "file_name = '" + content[i] + "'"
        if i == "file_type":
            update = True
            query += "file_type = '" + content[i] + "'"
        if i == "file_path":
            update = True
            query += "file_path = '" + content[i] + "'"
    
    query += " WHERE iid = " + iid + ";"
    return (update, query)

def hasImage(pid):
    con = dbconnect()
    cursor = con.cursor()
    query = ("Select iid from images where project = " + pid)
    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    disconnect(con)

    ## If no result, not a valid ID
    if len(results) > 0:
        return True
    else:
        return False