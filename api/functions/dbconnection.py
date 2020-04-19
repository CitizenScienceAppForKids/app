#!/usr/bin/env python3
import os
import mysql.connector
from mysql.connector import errorcode

def dbconnect():
    try:
        # Open Data Base Conneection
        connection = mysql.connector.connect(
            user = os.getenv("DBUSER"),
            password = os.getenv("DBPW"),
            host = '127.0.0.1',
            database = 'common',
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
