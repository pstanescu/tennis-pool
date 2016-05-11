import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup

});

Meteor.publish("tournaments",function(){
  return Tournaments.find();
});
Meteor.publish("draws",function(){
  return Draws.find();
});

Meteor.publish("rounds",function(){
  return Rounds.find();
})

Meteor.publish("matches",function(){
  return Matches.find();
})

Meteor.publish("voters",function(){
  return Voters.find();
})

Meteor.publish("comments",function(){
  return Comments.find();
})

Meteor.publish("players",function(){
  return Players.find();
})
