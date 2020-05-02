#!/usr/bin/env python3
from flask import Flask, Blueprint, request, make_response
from json2html import *
import json
import os
from datetime import datetime
import mysql.connector
from mysql.connector import errorcode

def dbconnect():
    try:
        # Open Data Base Conneection
        connection = mysql.connector.connect(
            user        = os.getenv("DBUSER"),
            password    = os.getenv("DBPW"),
            host        = os.getenv("DBHOST"),
            database    = 'common',
            auth_plugin = 'mysql_native_password'
        )
        if connection:
            return connection
        else:
            return None
       
    except:
        connection.close()


def disconnect(connection):
    try:
        cursor.close()
        cnx.close()
    except:
        return 0

def makeResponse(message):
    rsp_json = make_response(message)
    rsp_json.headers.set('Content-Type', 'application/json')
    return rsp_json


