this.Tournaments = new Mongo.Collection("tournaments");
Draws = new Mongo.Collection("draws");
Rounds = new Mongo.Collection("rounds");
Matches = new Mongo.Collection("matches");
Players = new Mongo.Collection("players");
Comments = new Mongo.Collection("comments");
Voters = new Mongo.Collection("voters");
//Users = new Mongo.Collection("users");


Draws.attachSchema(new SimpleSchema({
  drawType:{
    type: String,
    label: "Draw Type",
    max: 10
  },
  drawGender:{
    type: String,
    label: "Draw Gender",
    max: 10
  },
  drawSize:{
    type: Number,
    label: "Draw size",
    max: 256
  },
  tid:{
    type:String
  }
}));

Comments.attachSchema(new SimpleSchema({
  title:{
    type: String,
    label: "Title",
    max: 200
  },
  body:{
    type: String,
    label: "Comment",
    max: 1000
  },
  matchid:{
    type: String
  },
  createdOn:{
    type:Date,
    optional:true
  },
  owner:{
    type:String,
    autoValue:function(){ return Meteor.user()._id }
  }
}));
