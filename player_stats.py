from google.appengine.ext import db
from google.appengine.ext.db import polymodel
from player import Player, RegularPlayer
from statistics import ChallengeStats, PvPStats
from utils import render_template, get_template
from webapp2 import RequestHandler, WSGIApplication

import cgi
import datetime


class LoadChallengeStats(RequestHandler):
    def get(self):
        username = str(cgi.escape(self.request.cookies.get("user")))

        values = {'name': username}
        data = []
        if username:
            scores = getChallengeScores(username, 5)
            for s in scores:
                time_since = parseDate(s.date)
                data.append({'date': time_since, 'survived': s.survived})
        values['data'] = data

        page = render_template("challenge_stats.html", values)
        self.response.out.write(page)

class LoadPvPStats(RequestHandler):
    def get(self):
        username = str(cgi.escape(self.request.cookies.get("user")))

        values = {'name': username}
        data = []
        if username:
            scores = getPvPScores(username, 5)
            for s in scores:
                time_since = parseDate(s.date)
                strRatingChange = str(s.rating_change)
                if s.rating_change > 0:
                    strRatingChange = "+"+str(s.rating_change)# shows "+16" rather than just "16"
                data.append({'date': time_since, 'opponent': s.opponent,
                    'change': strRatingChange})
        values['data'] = data

        page = render_template("pvp_stats.html", values)
        self.response.out.write(page)

def getChallengeScores(username, count):
    q = ChallengeStats.all().filter("username =", username)
    q = q.order("-date")
    return q.run(limit=count)

def getPvPScores(username, count):
    q = PvPStats.all().filter("username =", username)
    q = q.order("-date")
    return q.run(limit=count)

def parseDate(date):
    seconds = datetime.timedelta(seconds=1)
    minutes = datetime.timedelta(minutes=1)
    hours = datetime.timedelta(hours=1)
    days = datetime.timedelta(days=1)
    years = datetime.timedelta(days=365)

    delta = datetime.datetime.now() - date
    if delta < seconds:
        return 'moments ago'
    elif delta < minutes:
        time = delta.seconds
        if time == 1:
            return str(time) + ' second ago'
        else:
            return str(time) + ' seconds ago'
    elif delta < hours:
        time = delta.seconds / 60
        if time == 1:
            return str(time) + ' minute ago'
        else:
            return str(time) + ' minutes ago'
    elif delta < days:
        time = delta.seconds / 3600
        if time == 1:
            return str(time) + ' hour ago'
        else:
            return str(time) + ' hours ago'
    elif delta < years:
        time = delta.days
        if time == 1:
            return str(time) + ' day ago'
        else:
            return str(time) + ' days ago'
    else:
        time = delta.days / 365
        if time == 1:
            return str(time) + ' year ago'
        else:
            return str(time) + ' years ago'
