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
      return id;
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
    var tourney;
    if(!this.userId){// not logged in
      return;
    }
    else{
      tourney = {owner:this.userId,tournamentName:"New Tournament",year:2016};
      var id = Tournaments.insert(tourney);
      return id;
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
})
