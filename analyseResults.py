# -*- coding: utf-8 -*-

from pymongo import MongoClient
import csv
import pprint
import re
import datetime

def getFinishedUsers(db):
    interactions = db.interactions
    users = findDistinctUserIds(interactions)
    finished = []
    unfinished = []

    for user in users:
        if findFinished(interactions,user):
            finished.append(user)
        else:
            unfinished.append(user)
    return [finished, unfinished]
        

def findFinished(interactions, userId):
    expl = interactions.find({'$and' : [ {'userId': userId} , { 'element' : 'button_postTaskQuestionnairesExpl'}]} ).count()
    base = interactions.find({'$and' : [ {'userId': userId} , { 'element' : 'button_postTaskQuestionnaires'}]} ).count()
    if expl > 0 and base > 0:
        return True
    else:
        return False

def checkFinished(db, userIds):
    interactions = db.interactions
    for userId in userIds:
        checkFinishedUser(interactions, userId)

def checkFinishedUser(interactions, userId):
    first = interactions.find({'$and' : [ {'userId': userId} , { 'first' : 'true'}]} ).count()
    second = interactions.find({'$and' : [ {'userId': userId} , { 'first' : 'false'}]} ).count()
    evaluations = interactions.find({'$and' : [ {'userId': userId} , { 'element' : 'button_evaluation'}]} ).count()

    print userId, first, second, evaluations

def findDistinctUserIds(interactions):
    return interactions.find({}).distinct('userId')

def findLengthStudy(db, userIds):
    interactions = db.interactions
    for userId in userIds:
        findLengthStudyUser(interactions, userId)


def findLengthStudyUser(interactions, userId):
    lastInteraction = interactions.find_one({'userId': userId},sort=[("date", -1)])["date"]
    firstInteraction = interactions.find_one({'userId': userId},sort=[("date", 1)])["date"]
    diff = lastInteraction - firstInteraction

    seconds=(diff/1000)%60
    seconds = int(seconds)
    minutes=(diff/(1000*60))%60
    minutes = int(minutes)
    hours=(diff/(1000*60*60))%24

    # print userId + ": " +  ("%d:%d:%d" % (hours, minutes, seconds))
    return [hours,minutes,seconds]


def findTimeFirstUser(interactions, userId):
    lastInteraction = interactions.find_one({'$and' : [ {'userId': userId} , { 'first' : 'true'}]},sort=[("date", -1)])["date"]
    firstInteraction = interactions.find_one({'$and' : [ {'userId': userId} , { 'first' : 'true'}]},sort=[("date", 1)])["date"]
    diff = lastInteraction - firstInteraction

    seconds=(diff/1000)%60
    seconds = int(seconds)
    minutes=(diff/(1000*60))%60
    minutes = int(minutes)
    hours=(diff/(1000*60*60))%24

    # print userId + ": " +  ("%d:%d:%d" % (hours, minutes, seconds))
    return [hours,minutes,seconds]

def findTimeSecondUser(interactions, userId):
    lastInteraction = interactions.find_one({'$and' : [ {'userId': userId} , { 'first' : 'false'}]},sort=[("date", -1)])["date"]
    firstInteraction = interactions.find_one({'$and' : [ {'userId': userId} , { 'first' : 'false'}]},sort=[("date", 1)])["date"]
    diff = lastInteraction - firstInteraction

    seconds=(diff/1000)%60
    seconds = int(seconds)
    minutes=(diff/(1000*60))%60
    minutes = int(minutes)
    hours=(diff/(1000*60*60))%24

    # print userId + ": " +  ("%d:%d:%d" % (hours, minutes, seconds))
    return [hours,minutes,seconds]

def findNbInteractions(interactions, userId):
    first = interactions.find({'$and' : [ {'userId': userId} , { 'first' : 'true'}]} ).count()
    second = interactions.find({'$and' : [ {'userId': userId} , { 'first' : 'false'}]} ).count()
    return [ first, second]

def findFirstInterfaceNameUser(interactions, userId):
    first = interactions.find_one({'$and' : [ {'userId': userId} , { 'first' : 'true'}]})["explanations"]
    if first == "true":
        return "explanations"
    else:
        return "baseline"

def findFirstTaskUser(interactions, userId):
    first = interactions.find_one({'$and' : [ {'userId': userId} , { 'first' : 'true'}]})["relaxing"]
    if first == "true":
        return "relaxing"
    else:
        return "fun"

def findInfoSession(db, userIds):
    interactions= db.interactions
    # create dict
    data = {}
    for userId in userIds:
        total = findLengthStudyUser(interactions, userId)
        first = findTimeFirstUser(interactions, userId)
        second = findTimeSecondUser(interactions, userId)
        nbInteractions = findNbInteractions(interactions, userId)
        firstName = findFirstInterfaceNameUser(interactions, userId)
        firstTask = findFirstTaskUser(interactions, userId)
        why = interactions.find({'$and' : [ {'userId': userId} , { 'element' : 'showPopUp'}]} ).count()

        data[userId] =  [total, first, second, nbInteractions, firstName, firstTask, why ]
    return data

def printDataTime(data):
    for key, value in data.iteritems():
        userId = key
        [hTotal, minTotal, sTotal] = value[0]
        [hFirst, minFirst, sFirst] = value[1]
        [hSecond, minSecond, sSecond] = value[2]
        [nbFirst, nbSecond] = value[3]
        name = value[4]
        # print userId
        print "Total:" , ("%d:%d:%d" % (hTotal, minTotal, sTotal)), "First:",  ("%d:%d:%d" % (hFirst, minFirst, sFirst)), "Second:", ("%d:%d:%d" % (hSecond, minSecond, sSecond))

def printDataInteractions(data):
    for key, value in data.iteritems():
        userId = key
        [hTotal, minTotal, sTotal] = value[0]
        [hFirst, minFirst, sFirst] = value[1]
        [hSecond, minSecond, sSecond] = value[2]
        [nbFirst, nbSecond] = value[3]
        name = value[4]
        print "First:", nbFirst, "Second", nbSecond

def printDataTimeBE(data):
    for key, value in data.iteritems():
        userId = key
        [hTotal, minTotal, sTotal] = value[0]
        [hFirst, minFirst, sFirst] = value[1]
        [hSecond, minSecond, sSecond] = value[2]
        [nbFirst, nbSecond] = value[3]
        name = value[4]
        
        if name == "explanations":
            print "Explanations:", ("%d:%d:%d" % (hFirst, minFirst, sFirst)), "Baseline:", ("%d:%d:%d" % (hSecond, minSecond, sSecond))
        else:
            print "Explanations:", ("%d:%d:%d" % (hSecond, minSecond, sSecond)) , "Baseline:", ("%d:%d:%d" % (hFirst, minFirst, sFirst))

def printDataInteractionsBE(data):
    for key, value in data.iteritems():
        userId = key
        [hTotal, minTotal, sTotal] = value[0]
        [hFirst, minFirst, sFirst] = value[1]
        [hSecond, minSecond, sSecond] = value[2]
        [nbFirst, nbSecond] = value[3]
        name = value[4]
        
        if name == "explanations":
            print "Explanations:", nbFirst, "Baseline", nbSecond           
        else:
            print "Explanations:", nbSecond, "Baseline", nbFirst          

def printDataTimeFR(data):
    for key, value in data.iteritems():
        userId = key
        [hTotal, minTotal, sTotal] = value[0]
        [hFirst, minFirst, sFirst] = value[1]
        [hSecond, minSecond, sSecond] = value[2]
        [nbFirst, nbSecond] = value[3]
        name = value[4]
        task = value[5]
        
        if task == "relaxing":
            print "Relaxing:", ("%d:%d:%d" % (hFirst, minFirst, sFirst)), "Fun:", ("%d:%d:%d" % (hSecond, minSecond, sSecond))
        else:
            print "Relaxing:", ("%d:%d:%d" % (hSecond, minSecond, sSecond)) , "Fun:", ("%d:%d:%d" % (hFirst, minFirst, sFirst))

def printDataInteractionsFR(data):
    for key, value in data.iteritems():
        userId = key
        [hTotal, minTotal, sTotal] = value[0]
        [hFirst, minFirst, sFirst] = value[1]
        [hSecond, minSecond, sSecond] = value[2]
        [nbFirst, nbSecond] = value[3]
        name = value[4]
        task = value[5]
 
        if name == "explanations":
            print "Relaxing:", nbFirst, "Fun", nbSecond           
        else:
            print "Relaxing:", nbSecond, "Fun", nbFirst   

def printCount(data):
    for key, value in data.iteritems():
        why = value[6]
        print why


def main():
    # Connect to localhost mongodb
    client = MongoClient('localhost', 27017)

    # Get the databases
    dbPilot = client.pilotWithin

    [finished, unfinished] = getFinishedUsers(dbPilot)
    print finished
    # checkFinished(dbPilot, finished)
    # checkFinished(dbPilot, unfinished)
    data = findInfoSession(dbPilot, finished)
    printCount(data)

    # first vs second
    # printDataTime(data)
    # printDataInteractions(data)
    # explanation vs baseline
    # printDataTimeBE(data)
    # printDataInteractionsBE(data)
    # relaxing vs fun
    # printDataTimeFR(data)
    # printDataInteractionsFR(data)



main()