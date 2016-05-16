
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Meteor.subscribe("tournaments");
Meteor.subscribe("draws");
Meteor.subscribe("rounds");
Meteor.subscribe("matches");
Meteor.subscribe("comments");
Meteor.subscribe("voters");
Meteor.subscribe("players");

Template.tournamentList.helpers({
  tid:function() {
    setupCurrentTournament();
    return Session.get("tid");
  },
  tournaments:function(){
    return Tournaments.find();
  }
})

Template.navbar.helpers({
  tournaments:function(){
    return Tournaments.find();
  },
  getAdmin:function(){
    console.log("navbar template - getAdmin");
    if(Meteor.user().emails[0].address == "pstanescu@gmail.com"){
      return true;
    }
    return false;
  }
})

Template.insertDrawForm.helpers({
  tid:function(){
    return Session.get("tid");
  },
  addDraw:function(draw){
    console.log("addDraw");
    return Meteor.call("addDraw",draw);
  },
  canEdit:function(){
    console.log("insertDrawForm - canEdit")
    console.log(Session.get("tid"));
    var tourney = Tournaments.findOne({_id:Session.get("tid")});
    console.log("insertDrawForm canEdit tourney "+tourney);
    if(tourney){
      return true;
    }
    return false;
  }
})

Template.insertMatchesForm.helpers({
  roundid:function(){
    console.log("drawid: "+Session.get("drawid"));
    var id = Rounds.findOne({drawid:Session.get("drawid"),roundOrder:1});
    console.log("roundid "+id);
    return id._id;
  },
  addMatch:function(match){
    console.log("addMatch");
    if(!Session.get("drawid")){
      alert('Draw was not selected!');
      return;
    }
    return Meteor.call("addMatch",match);
  },
  canEdit:function(){
    console.log("insertMatchForm - canEdit")
    console.log(Session.get("drawid"));
    var round = Rounds.find({drawid:Session.get("drawid"),roundOrder:1},{limit: 1}).fetch();
    console.log("round id: "+round[0]._id);
    var matches = Matches.find({roundid:round[0]._id},{sort:{matchOrder:1}}).fetch();
    console.log("insertMatchForm canEdit round "+round[0].roundSize);
    console.log("insertMatchForm canEdit matches length "+matches.length);
    if(round[0].roundSize > matches.length){
      return true;
    }
    return false;
  }
})

Template.drawMeta.helpers({
	draws: function() {
	    var draws = Draws.find({tid:Session.get("tid")},{sort: {drawType: -1,drawGender:1}}).fetch();
	    console.log("drawMeta");
	    return draws;
	}
})
/*
Template.voters.helpers({
  voters:function(){
    var round, eusers, users;
    round = Rounds.findOne({_id:Session.get("rid")});
    if(!round){return} //give up
    eusers = Voters.findOne({rid:round._id});
    if (!eusers) {return} //give up

    users = new Array();
    var i = 0;
    for(var key in eusers.users){
      var user = fixObjectKeys(eusers.users[key]);
      users[i]=user;
      i++;
    }
    return users;
  }
})

*/

Template.tournamentMeta.helpers({
  tournaments:function(){
    return Tournaments.findOne({_id:Session.get("tid")});
  },
  canEdit:function(){
    console.log("tournamentMeta - canEdit")
    var tourney = Tournaments.findOne({_id:Session.get("tid")});

    if(tourney){
      if(tourney.owner == Meteor.userId()){
        return true;
      }
    }
    return false;
  }
})

Template.editTournamentMeta.helpers({
  tournaments:function(){
    console.log("newTournamentMeta");
    return Tournaments.findOne({_id:Session.get("tid")});
  }
})

Template.editDrawMeta.helpers({
	draws: function() {
	    var draws = Draws.find({tid:Session.get("tid")},{sort: {drawType: -1,drawGender:1}}).fetch();
	    return draws;
	}
})

Template.roundViewer.helpers({
  rounds:function(){
    var rounds = Rounds.find({drawid:Session.get("drawid")},{sort:{roundOrder:1}}).fetch();
    return rounds;
  }
})

Template.matchViewer.helpers({
  roundMatches:function(){
    var rounds = Rounds.find({drawid:Session.get("drawid")},{sort:{roundOrder:1}}).fetch();
    var round_ids = rounds.map(function(p) { return p._id });

    var result=[];

    for (i=0;i<rounds.length;i++){
      var rnd={roundOrder:rounds[i].roundOrder};
      console.log("roundOrder: "+rnd.roundOrder);
      rnd.matches = Matches.find({roundid:round_ids[i]},{$sort:{matchOrder:1}}).fetch();
      console.log("result: "+rnd);
      result.push(rnd);
    }
    //var matches = Matches.find({roundid:{$in:round_ids}},{$sort:{matchOrder:1}}).fetch();

    console.log("matchViewer round: "+result[0].matches[0].team1Name);
    if(result.length > 0){
      return result;
    }
  }
})

Template.matchViewer.events({
  "click .radio":function(event,template){
    var match = event.target.dataset.id;
    var str = match.split("_");
    console.log(str);
    var round = Rounds.find({_id:str[0]}).fetch();
    var nextRound = Rounds.find({drawid:round[0].drawid, roundOrder:round[0].roundOrder+1}).fetch();

    var m;
    var mo = parseInt(str[2]);
    if (mo%2 == 1){
      m = {
        team1Name:str[3],
        matchOrder:Math.ceil(mo/2),
        roundid:nextRound[0]._id
      };
    }
    if (mo%2 == 0){
      m = {
        team2Name:str[3],
        matchOrder:Math.ceil(mo/2),
        roundid:nextRound[0]._id
      };
    }

    console.log(m);
    Meteor.call("addMatch",m);
  }
})

Template.navbar.events({
  "click .js-load-doc":function(event){
    Session.set("tid",this._id);
  },
  "click .js-add-tournament":function(event){
    event.preventDefault();
    console.log(Meteor.user());
    if(Meteor.user().emails[0].address == "pstanescu@gmail.com"){
      // they are logged in... lets insert a doc
      var id = Meteor.call("addTournament", function(err,res){
        if(!err){
          console.log("setting session to "+res);
          Session.set("tid",res);
        }
      });
      Router.go("/tournaments/"+Session.get("tid")+"/edit");
    }
    else{
      alert("Not allowed to create tournament!");
    }
  }
})

Template.drawMeta.events({
  "click .js-draw":function(event,template){
    Session.set("drawid",this._id);
    // Remove the class 'active' from potentially current active link.
    var activeLink = template.find('.active');
    if(activeLink){
        activeLink.classList.remove('active');
    }

    // Add the class 'active' to the clicked link.
    event.currentTarget.classList.add('active');
  }
})

Template.editDrawMeta.events({
  "click #js-draw":function(event){
    Session.set("drawid",this._id);
  }
})

function fixObjectKeys(obj){
  var newObj = {};
  for (key in obj){
    var key2 = key.replace("-","");
    newObj[key2]=obj[key];
  }
  return newObj;
}

function setupCurrentTournament(){
  var tourney;
  if(!Session.get("tid")){
    tourney = Tournaments.findOne();
    if(tourney){
        Session.set("tid",tourney._id);
    }
  }
}
