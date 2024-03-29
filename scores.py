from google.appengine.ext import db
from google.appengine.ext.db import polymodel
from player import Player, RegularPlayer
from statistics import ChallengeStats, PvPStats
from utils import render_template, get_template
from webapp2 import RequestHandler

import cgi
import datetime
import json


def newRankings(myScore, theirScore, points):#points will be 1 or 0
    #updates both player's ELO
    k = 32

    eAdenomiator = 1+10**((theirScore-myScore)/400.0)
    eA = 1.0/eAdenomiator

    eBdenomiator = 1+10**((myScore-theirScore)/400.0)
    eB = 1.0/eBdenomiator

    newMyScore = myScore + k*(points-eA)
    newTheirScore = theirScore+ k*(1-points-eB);

    return int(newMyScore), int(newTheirScore)


class UpdateScore(RequestHandler):
    def post(self):
        username = cgi.escape(self.request.get("username"))
        score = cgi.escape(self.request.get("hiScore"))
        username = str(username)
        hiScore = int(score)

        if username:
            users = db.GqlQuery("SELECT * FROM Player WHERE username = :1", username)
            for u in users:
                u.hiScore = hiScore
                u.put()

class UpdateChallengeScore(RequestHandler):
    '''Updates user's best challenge score if they surpass thier previous score'''
    def post(self):
        username = cgi.escape(self.request.get("username"))
        score = cgi.escape(self.request.get("timeSurvived"))

        username = str(username)
        time_survived = self.parseTime(int(score))

        if username:
            users = db.GqlQuery("SELECT * FROM Player WHERE username = :1",
                username)
            for u in users:
                if u.challengeScore < time_survived:
                    u.challengeScore = time_survived
                    u.put()

            ChallengeStats(username=username, date=datetime.datetime.now(),
                    survived=time_survived).put()

    def parseTime(self, time):
        minute, second = str(time / 60), str(time % 60)

        return minute.zfill(2) + ':' + second.zfill(2)

class UpdatePVPRating(RequestHandler):
    '''updates both players PvPRating (ELO) '''
    def post(self):
        username = cgi.escape(self.request.get("username"))
        # score = cgi.escape(self.request.get("pvpRating"))
        opponent = cgi.escape(self.request.get("oppositionUsername"))
        winner = cgi.escape(self.request.get("winner"))

        player = db.GqlQuery("SELECT * FROM Player WHERE username =  :1", username)
        pvpRating = player.get().pvpRating


        winner = str(winner)
        username = str(username)
        # pvpRating = int(score)
        opponent = str(opponent)

        opponentPVPRating= 0

        if winner == username:
            points = 1
        elif winner == opponent:
            points = 0

        if opponent:
            users = db.GqlQuery("SELECT * FROM Player WHERE username = :1", opponent)
            for u in users:
                opponentPVPRating = u.pvpRating;

        oldRating = pvpRating
        opponentOldRating = opponentPVPRating

        # print "--------------GETTING NEW RANKINGS------------"
        (pvpRating, opponentPVPRating) =newRankings(pvpRating, opponentPVPRating, points)

        PvPStats(username=username, date=datetime.datetime.now(), opponent=opponent,rating_change= pvpRating-oldRating).put()
        PvPStats(username=opponent, date=datetime.datetime.now(), opponent=username,rating_change= opponentPVPRating-opponentOldRating).put()

        self.response.headers['Content-Type'] = 'application/json'

        if username:
            users = db.GqlQuery("SELECT * FROM Player WHERE username = :1", username)
            for u in users:
                u.pvpRating = pvpRating
                u.put()

        if opponent:
            users = db.GqlQuery("SELECT * FROM Player WHERE username = :1", opponent)
            for u in users:
                u.pvpRating = opponentPVPRating
                u.put()

        self.response.out.write(json.dumps({"myELO": pvpRating, "myChange": pvpRating-oldRating, "oppELO": opponentPVPRating, "oppChange":opponentPVPRating-opponentOldRating }))
        #Writes message back so updates to player's ELO can be displayed to them in their browser

class UpdateCampaignLevel(RequestHandler):
    '''Stores user's campaign progress'''
    def post(self):
        username = cgi.escape(self.request.get("username"))
        campaignLevel = cgi.escape(self.request.get("campaignLevel"))

        username = str(username)
        campaignLevel = int(campaignLevel)

        if username:
            users = db.GqlQuery("SELECT * FROM Player WHERE username = :1", username)
            for u in users:
                u.campaignLevel = campaignLevel
                u.put()

class LoadCampaignLevel(RequestHandler):
    def get(self):
        username = str(cgi.escape(self.request.get("username")))

        self.response.headers['Content-Type'] = 'application/json'
        self.response.headers['Access-Control-Allow-Origin'] = '*'

        if username:
            users = db.GqlQuery("SELECT * FROM Player WHERE username = :1",
                    username)
            level = users[0].campaignLevel

        self.response.out.write(json.dumps([level]))

class HiscoresCampaignHandler(RequestHandler):
    def get(self, request=None, response=None):
        if "user" not in self.request.cookies.keys():
            self.redirect("/login")

        username = self.request.cookies.get('user')
        values = {'name': username}

        table_template = get_template("hiscores_campaign.html");

        page = 0
        score_per_page = 5

        start = page * score_per_page
        players_q = get_hiscore_players(start, score_per_page, "-campaignLevel")

        players_campaign = [{'username': p.username, 'score': p.campaignLevel}
                for p in players_q if p.campaignLevel]
        for i, p in enumerate(players_campaign):
            p['rank'] = i + 1

        for p in players_campaign:
            if p['username'] == username:
                colour_player(p)
                break
        else:
            player_one = next(get_player_one(username))
            if player_one.campaignLevel:
                p = {'username': player_one.username,
                        'score': player_one.campaignLevel,
                         'rank': get_player_rank(username, "-campaignLevel")}
                colour_player(p)
                players_campaign.append(p)

        values['players'] = players_campaign

        content = table_template.render(values)
        self.response.out.write(content)

class HiscoresChallengeHandler(RequestHandler):
    def get(self, request=None, response=None):

        if "user" not in self.request.cookies.keys():
            self.redirect("/login")

        username = self.request.cookies.get('user')
        values = {'name': username}

        table_template = get_template("hiscores_challenge.html")

        page = 0
        score_per_page = 5
        start = page * score_per_page
        players_c = get_hiscore_players(start, score_per_page, "-challengeScore")

        players_challenge = [{'username': p.username, 'score': p.challengeScore}
                for p in players_c if p.challengeScore is not None]
        for i, p in enumerate(players_challenge):
            p['rank'] = i + 1

        for p in players_challenge:
            if p['username'] == username:
                colour_player(p)
                break
        else:
            player_one = next(get_player_one(username))
            if player_one.challengeScore:
                p = {'username': player_one.username,
                        'score': player_one.challengeScore,
                         'rank': get_player_rank(username, "-challengeScore")}
                colour_player(p)
                players_challenge.append(p)

        values['players'] = players_challenge

        content = table_template.render(values)
        self.response.out.write(content)

class HiscoresPvPHandler(RequestHandler):
    def get(self, request=None, response=None):
        if "user" not in self.request.cookies.keys():
            self.redirect("/login")

        username = self.request.cookies.get('user')
        values = {'name': username}

        table_template = get_template("hiscores_pvp.html")

        page = 0
        score_per_page = 5
        start = page * score_per_page
        players_c = get_hiscore_players(start, score_per_page, "-pvpRating")

        players_pvp = [{'username': p.username, 'score': p.pvpRating}
                for p in players_c if p.pvpRating is not None]
        for i, p in enumerate(players_pvp):
            p['rank'] = i + 1

        for p in players_pvp:
            if p['username'] == username:
                colour_player(p)
                break
        else:
            player_one = next(get_player_one(username))
            if player_one.pvpRating:
                p = {'username': player_one.username,
                        'score': player_one.pvpRating,
                         'rank': get_player_rank(username, "-pvpRating")}
                colour_player(p)
                players_pvp.append(p)

        values['players'] = players_pvp

        content = table_template.render(values)
        self.response.out.write(content)

def get_player_rank(username, scoreType):
    players = Player.all().order(scoreType).run()

    for i, p in enumerate(players):
        if p.username == username:
            return i + 1

def get_hiscore_players(start, count, scoreType):
    return Player.all().order(scoreType).run(offset=start, limit=count)

def get_player_one(username):
    return Player.all().filter('username =', username).run()

def colour_player(player):
    span_start = '<span class=highlight-word>'
    span_end = '</span>'

    for key in player:
        player[key] = span_start + str(player[key]) + span_end
