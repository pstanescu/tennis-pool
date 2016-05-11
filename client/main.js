
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

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/',function(){
  this.render("navbar",{to:"header"});
  this.render("tournamentList",{to:"main"});
})

Router.route('/tournaments/:_id',function(){
  Session.set("tid",this.params._id)
  this.render("navbar",{to:"header"});
  this.render("tournamentItem",{to:"main"});
})


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
    var tourney = Tournaments.findOne({_id:Session.get("tid")});
    console.log(tourney.owner==Meteor.userId())
    console.log(tourney.owner)
    console.log(Meteor.userId())

    if(tourney){
      if(tourney.owner == Meteor.userId()){
        return true;
      }
    }
    return false;
  }
})

Template.drawMeta.helpers({
  mDraws:function(){
    var draws = Draws.find({tid:Session.get("tid"),drawGender:"Men"});
    console.log("mDraws");
    console.log(draws);
    return draws
  },
  wDraws:function(){
    var draws = Draws.find({tid:Session.get("tid"),drawGender:"Women"});
    console.log("wDraws");
    console.log(draws);
    return draws
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
    console.log(tourney.owner==Meteor.userId())
    console.log(tourney.owner)
    console.log(Meteor.userId())

    if(tourney){
      if(tourney.owner == Meteor.userId()){
        return true;
      }
    }
    return false;
  }
})
/*
Template.editableText.helpers({
  userCanEdit: function(doc,Collection){
    doc = Documents.findOne({_id:Session.get("docid"),owner:Meteor.userId()})
    if(doc){
      return true;
    }
    else{
      return false;
    }
  }
})

Template.commentList.helpers({
  comments:function(){
    return Comments.find({docid:Session.get("docid")});
  }
})


Template.insertCommentForm.helpers({
  tid:function(){
    return Session.get("tid");
  }
})

Template.tournamentMeta.events({
  "click .js-tog-private":function(event){
    var tourney = {_id:Session.get("tid"),isPrivate:event.target.checked};
    Meteor.call("updateDocPrivacy",doc);
  }
})
*/
Template.navbar.events({
  "click .js-load-doc":function(event){
    Session.set("tid",this._id);
  },
  "click .js-add-tournament":function(event){
    event.preventDefault();
    console.log(Meteor.user());
    console.log(Meteor.user().emails[0].adress);
    if(Meteor.user().emails[0].address == "pstanescu@gmail.com"){
      // they are logged in... lets insert a doc
      var id = Meteor.call("addTournament", function(err,res){
        if(!err){
          Session.set("tid",res);
        }
      });
    }
    else{
      alert("Not allowed to create tournament!");
    }
  }
})

Template.drawMeta.events({
  "click #js-mDraw":function(event){
    Console.log("DrawID: "+this._id);
    Session.set("did",this._id);

    Meteor.call("getRoundsForDraw", function(err,res){
      if(!err){
        return res;
      }
      return;
    })
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
