js-registration-list
====================

Linked list implementation in javascript, with a few helper functions to easily execute functions on all members, shuffle members between lists, etc...

DO use for:
- Registering objects to batches

DO NOT use for:
- Keeping a list of things to be individually accessed later
- Batches of primitives (ALL MEMBERS NEED TO BE OBJECTS!!!)

Super Simple Example code:
//Create a list with an identifier
var list = new RegistrationList("PHYSICS");

for(var i = 0; i < 10; i++)
  list.register(new PhysicsObject());

list.performOnMembers(function(member){ member.updatePhysics(); });


Slightly Fancier Example Code:
//Create lists
var plist = new RegistrationList("PHYSICS");
var rlist = new RegistrationList("RENDER");
var entities = [];

var entity;
for(var i = 0; i < 10; i++)
{
  entity = new Entity();
  entities[i] = entity;
  plist.register(entity);
  rlist.register(entity);
}

plist.performOnMembers(function(member){ member.updatePhysics(); });
rlist.performOnMembers(function(member){ member.render(); });

//Let's say we no longer want entity 4 to update its physics
plist.unregister(entities[3]);

plist.performOnMembers(function(member){ member.updatePhysics(); });
rlist.performOnMembers(function(member){ member.render(); });

//Now let's say we want entities 6-10 to go into slo-motion mode
slomoplist = new RegistrationList("SLOMOPHYSICS");

for(var i = 5; i < 10; i++)
  plist.moveMemberToList(entities[i], slomoplist);
  
plist.performOnMembers(function(member){ member.updatePhysics(); });
slomoplist.performOnMembers(function(member){ member.updateSloMoPhysics(); });
rlist.performOnMembers(function(member){ member.render(); });



You get the idea.

You can use this code fo' free in anything. Don't bother crediting me if you don't want to. Go nuts.
