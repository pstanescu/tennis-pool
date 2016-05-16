this.Tournaments = new Mongo.Collection("tournaments");
Draws = new Mongo.Collection("draws");
Rounds = new Mongo.Collection("rounds");
Matches = new Mongo.Collection("matches");
Players = new Mongo.Collection("players");
Comments = new Mongo.Collection("comments");
Voters = new Mongo.Collection("voters");
//Users = new Mongo.Collection("users");

Matches.attachSchema(new SimpleSchema({
  team1Name:{
    type: String,
    label: "Team1",
    optional:true
  },
  team2Name:{
    type: String,
    label: "Team2",
    optional:true
  },
  team1Set1Score:{
    type: Number,
    label: "Set1",
    min:0,
    max:7,
    optional:true
  },
  team1Set2Score:{
    type: String,
    label: "Set2",
    min:0,
    max:7,
    optional:true
  },
  team1Set3Score:{
    type: String,
    label: "Set3",
    min:0,
    max:7,
    optional:true
  },
  team2Set1Score:{
    type: String,
    label: "Set1",
    min:0,
    max:7,
    optional:true
  },
  team2Set2Score:{
    type: String,
    label: "Set2",
    min:0,
    max:7,
    optional:true
  },
  team2Set3Score:{
    type: String,
    label: "Set3",
    min:0,
    max:7,
    optional:true
  },
  winner:{
    type: String,
    optional:true
  },
  matchOrder:{
    type: Number,
    label: "Match order",
    max: 128
  },
  roundid:{
    type:String
  }
}));

/*
Rounds.attachSchema(new SimpleSchema({
  roundName:{
    type: String,
    label: "Round name"
  },
  roundOrder:{
    type: Number,
    label: "Round order",
    max: 10
  },
  roundSize:{
    type: Number,
    label: "Round size",
    max: 256
  },
  drawid:{
    type:String
  }
}));
*/

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
