#!/usr/bin/env python3
import os
from datetime import datetime
import mysql.connector
from mysql.connector import errorcode
from flask import Flask, request
import json


# Check that the project conforms to format
def validateAllProjectData(c):
    return validateProjectType(c["type"]) and validateProjectTitle(c["title"]) and validateProjectDescription(c["description"])

# Check that the project type conforms to format
def validateProjectType(ty):
    # Check for character limits
    if len(ty) > 20 or len(ty) <= 0:
        return False
    
    # Check if alpha-numeric 
    if not all(x.isalnum() or x.isspace() for x in ty):
        return False

    return True
    
# Check that the project title conforms to format
def validateProjectTitle(t):
    if len(t) > 100 or len(t) <= 0:
        return False
    
    # Check if alpha-numeric 
    if not all(x.isalnum() or x.isspace() for x in t):
        return False

    return True
    
# Check that the project description conforms to format
def validateProjectDescription(d):
    if len(d) > 1000 or len(d) <= 0:
        return False
    
    # Check if alpha-numeric 
    if not all(x.isalnum() or x.isspace() for x in d):
        return False

    return True




# Check that the observation conforms to format
def validateAllObservationData(c):
    return validateObservationDate(c["date"]) and validateObservationTitle(c["title"]) and validateObservationNotes(c["notes"])

# Check that the project type conforms to format
def validateObservationDate(d):

    if d != "":
        try:
            dt = datetime.strptime(d, '%Y-%m-%d %H:%M:%S')
            return True
        except:
            return False
    else:
        return False

    
# Check that the project title conforms to format
def validateObservationTitle(t):
    if len(t) > 100 or len(t) <= 0:
        return False
    
    # Check if alpha-numeric 
    if not all(x.isalnum() or x.isspace() for x in t):
        return False

    return True
    
# Check that the project description conforms to format
def validateObservationNotes(n):
    if len(n) > 1000 or len(n) <= 0:
        return False
    
    # Check if alpha-numeric 
    if not all(x.isalnum() or x.isspace() for x in n):
        return False

    return True

def validateImage(c):
    try:
        if c["file_name"] == "":
            return False
        
        if c["file_type"] != ".png" and c["file_type"] != ".jpg" and c["file_type"] != ".jpeg":
            return False
        
        if c["file_path"] == "":
            return False
    except:
        return False
    
    return True

def validateImages(c):
    try:
        for i in c:
            if i["file_name"] == "":
                return False
            
            if i["file_type"] != ".png" and i["file_type"] != ".jpg" and i["file_type"] != ".jpeg":
                return False
            
            if i["file_path"] == "":
                return False
    except:
        return False
    
    return True
