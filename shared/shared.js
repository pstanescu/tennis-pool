Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/',function(){
  this.render('navbar',{to:'header'});
  this.render('tournamentList',{to:'main'});
})

Router.route('/tournaments/:_id/edit',function(){
  Session.set('tid',this.params._id);
  this.render('navbar',{to:'header'});
  this.render('tournamentEdit',{to:'main'});
})

Router.route('/tournaments/:_id',function(){
  Session.set('tid',this.params._id);
  console.log(Session.get("tid"));
  this.render('navbar',{to:'header'});
  this.render('tournamentItem',{to:'main'});
})

Meteor.methods({

  /*addComment:function(comment){
    debugger;
    console.log("addComment method");
    console.log(comment);
    if(this.userId){//we have a user
      comment.createdOn = new Date();
      comment.owner = this.userId;
      console.log(comment);
      return Comments.insert(comment);
    }

    return;
  },
  */

  addDraw:function(draw){
    console.log("addDraw");
    if (this.userId){
      var id = Draws.insert(draw);
      console.log("inserted draw");

      rounds = Math.log(draw.drawSize)/Math.log(2);
      console.log("rounds: "+rounds);
      var round;
      var rndName;
      for(var i = rounds;i>=1;i--){
        switch(i){
          case rounds:
            rndName = "Final";
            break;
          case rounds-1:
            rndName = "Semi Final";
            break;
          case rounds-2:
            rndName = "Quarter Final";
            break;
          case rounds-3:
            rndName = "R16";
            break;
          case rounds-4:
            rndName = "R32";
            break;
          case rounds-5:
            rndName = "R64";
            break;
          case rounds-6:
            rndName = "R128";
            break;
            case rounds-7:
              rndName = "R256";
              break;
        }
        round = {roundOrder:i, roundName:rndName,roundSize: Math.pow(2,rounds-i+1),drawid:id};
        console.log(round);
        var rnd = Rounds.insert(round);
        console.log("round: "+rnd);
      }
      return id;
    }
    return;
  },
  addMatch:function(match){
    console.log("match "+match);
    console.log("addMatch");
    if (this.userId){
      return Matches.upsert({roundid:match.roundid, matchOrder:match.matchOrder},{$set:{matchOrder:match.matchOrder,team1Name:match.team1Name,team2Name:match.team2Name,roundid:match.roundid}});
      //return Matches.insert(match);
    }
    return;
  },
  getAdmin:function(){
    if(Meteor.user().emails[0].adress == "pstanescu@gmail.com"){
      console.log("true")
      return true;
    }
    return false;
  },
  addTournament:function(){
    console.log("in addTournament");
    var tourney;
    if(!this.userId){// not logged in
      return;
    }
    else{
      tourney = {owner:this.userId,tournamentName:"New Tournament",year:2016};
      var id = Tournaments.insert(tourney);
      if(id){
        //Session.set("tid",id);
        console.log("finishing addTournament with id: "+id);
        return id;
      }
      return;
    }
  },
  addVoter:function(pid){

    var doc, user, eusers;
    doc = Documents.findOne({_id:docid});
    if (!doc){return;} //no doc give up

    if (!this.userId){return;} //no logged in user give up

    //now I have a doc and possibly a user
    user = Meteor.user().profile;

    eusers = EditingUsers.findOne({docid:doc._id});
    if (!eusers){
      eusers = {
        docid: doc._id,
        users:{},
      };
    }
    user.lastEdit = new Date();

    eusers.users[this.userId] = user;
    EditingUsers.upsert({_id:eusers._id},eusers);
  }/*,
  updateDocPrivacy:function(doc){
    var realDoc = Documents.findOne({_id:doc._id,owner:this.userId});
    if(realDoc){
      realDoc.isPrivate= doc.isPrivate;
      Documents.update({_id:doc._id},realDoc);
    }
  }*/
  ,

})
