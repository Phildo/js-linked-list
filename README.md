js-linked-list
====================

Linked list implementation in javascript, with a few helper functions to easily execute functions on all members, shuffle members between lists, etc...

DO use for:
- Registering objects to batches

DO NOT use for:
- Keeping a list of things to be individually accessed later
- Batches of primitives (ALL MEMBERS NEED TO BE OBJECTS!!!)

All operations o(1) (well, except for 'performOnMembers', which is o(n)... but c'mon...)

LinkedList
================

    var list = new LinkedList("ID");

Creates a linked list with whatever ID you assign. You are responsible for making sure the IDs are unique (failure to do so might mess up objects that are a part of multiple lists).

    list.add(object);

Adds an object to a list. The only change to the object is the appendation of a variable 'LLNodeMap'. This is a map of listname->node pairs. You shouldn't mess with it (and if you are already using that variable name... sorry?).

    list.remove(object);

Removes the object from the given list. The object will retain its LLNodeMap variable, in the case that it is a member of multiple lists.

    list.moveMemberToList(object, newList);

Moves object from one list to another. Slightly faster (and more convenient) than 'list.remove(object); newList.add(object);'

    list.performMemberFunction(func, arg);

Performs the function 'func' (passed in as a string) of all the members of the list, and passes (arg) into that function. There is no checking to make sure the member has that function, so be careful. Also, right now you can only pass in one argument. 

    list.performOnMembers(func, arg);

Performs a function 'func' (passed in as an actual function) once for each member, and passes (member, arg) into that function. Right now you can only pass in one argument.

    list.firstMember();

Returns the first member of the list. Null if there are none. Good for checking if the list is non-empty, or 'popping' an arbitrary member from the list.

PrioritizedLinkedList
===========================

Almost exactly the same as LinkedList, but with some control over order of execution.

    var plist = new PrioritizedLinkedList("ID", numPriorities);

Creates a prioritized linked list with whatever ID you assign (Just like a normal linked list, you are responsible for uniqueness of IDs). numPriorities is an integer describing the fidelity of priorities you need (ie will you need 100 ordered sets of events? or just 2 sets to ensure that 'a' stuff happens before 'b' stuff, but ordering beyond that is unnecessary).

    plist.add(object, priority);

Adds an object to the given list (similar to a normal linked list). Priority specifies ordering (0 being first, numPriorities-1 being last).

    plist.remove(object, priority);

Removes an object (similar to a normal linked list). Must specify the priority from which it was added (I realize this is a bit clumsy, and might refactor that for the future).

    plist.performMemberFunction(func, arg);
    plist.performOnMembers(func, arg);

Same as normal linked list, but makes sure to execute them in the order specified by their priority.

RecycleLinkedList
=======================

Works similarly to a linked list, but instead of adding to/ removing from, it shuffles its members between an active and an inactive list. This reduces the overhead on object creation (expensive!), and instead re-uses old objects. Great for waves of identical enemies that spawn and die, or simple particle systems.

    var rlist = new RecycleLinkedList("ID", generateFunc, refreshFunc);

Creates a recycle linkedList with whatever ID you assign (Just like a normal linked list, you are responsible for uniqueness of IDs). generateFunc will be called to generate a new member of the list when there are none left in the inactive list (eg the first times you add something to the list). refreshFunc will be called on every newly generated member, as well as on every member as it is transferred from inactive back to active (aka as it is being recycled).

    var member = rlist.get();

Either generates a new member as per your function, or gives you a refreshed old member. You are responsible for ensuring these result in an object in the same state (via your generateFunc and refreshFunc).

    rlist.add(member);

Adds the member to the list of active members. 

    rlist.add(rlist.get());

If no additional processing is needed on a member, you can combine these two functions (as seen above).

    rlist.retire(member);

Moves a member from the active list to the inactive list.

    rlist.performMemberFunction(func, arg);
    rlist.performOnMembers(func, arg);

Same as normal linked list - but only performs them on active members.

Super Simple Example code:
==========================

    //Create a list with an identifier
    var list = new LinkedList("PHYSICS");

    for(var i = 0; i < 10; i++)
      list.add(new PhysicsObject());

    //These next two lines do the same thing
    list.performMemberFunction("updatePhysics", delta);
    list.performOnMembers(function(member, delta){ member.updatePhysics(delta); }, delta);

Slightly Fancier Example Code:
==============================

    //Create lists
    var plist = new LinkedList("PHYSICS");
    var rlist = new LinkedList("RENDER");
    var entities = [];
    
    var entity;
    for(var i = 0; i < 10; i++)
    {
      entity = new Entity();
      entities[i] = entity;
      plist.add(entity);
      rlist.add(entity);
    }
    
    plist.performOnMembers("updatePhysics", delta);
    rlist.performOnMembers("render", null);
    
    //Let's say we no longer want entity 4 to update its physics
    plist.remove(entities[3]);
    
    plist.performOnMembers("updatePhysics", delta);
    rlist.performOnMembers("render", null);
    
    //Now let's say we want entities 6-10 to go into slo-motion mode
    slomoplist = new LinkedList("SLOMOPHYSICS");
    
    for(var i = 5; i < 10; i++)
      plist.moveMemberToList(entities[i], slomoplist);
      
    plist.performOnMembers("updatePhysics", delta);
    slomoplist.performOnMembers("updateSloMoPhysics", delta);
    rlist.performOnMembers("render", null);
    
You get the idea.

You can use this code fo' free in anything. Don't bother crediting me if you don't want to. Go nuts.
