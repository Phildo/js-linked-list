var RegistrationList = function(identifier)
{
  var self = this;
  this.identifier = identifier;

  var RNode = function(content)
  {
    var node = this;
    node.prev = null;
    node.next = null;
    node.content = content;

    if(node.content !== null && typeof node.content.RNodeMap === 'undefined')
    {
      Object.defineProperty(node.content, "RNodeMap", {
        enumerable:false,
        configurable:true,
        writable:true,
        value:{}
      });
    }
  };

  this.head = new RNode(null);
  this.tail = new RNode(null);
  this.head.next = this.tail;
  this.tail.prev = this.head;

  var insertNodeAfter = function(node, prevNode)
  {
    node.prev = prevNode;
    node.next = prevNode.next;
    node.prev.next = node;
    node.next.prev = node;

    if(node.content !== null)
    {
      node.content.RNodeMap[self.identifier] = node;
    }

    return node;
  };

  var removeNode = function(node)
  {
    node.prev.next = node.next;
    node.next.prev = node.prev;
    node.next = null;
    node.prev = null;
  
    if(node.content !== null)
    {
      delete node.content.RNodeMap[self.identifier];
    }
  
    return node;
  };

  self.register = function(content)
  {
    insertNodeAfter(new RNode(content), self.head);
  };
  
  self.unregister = function(content)
  {
    removeNode(content.RNodeMap[self.identifier]);
  };
  
  self.moveMemberToList = function(content, list)
  {
    list.register(removeNode(content.RNodeMap[self.identifier]));
  };
  
  self.performOnMembers = function(func)
  {
    var node = self.head;
    while(node.next != null)
    {
      node = node.next;
      if(node.prev.content !== null)
        func(node.prev.content);
    }
  };
};
  
RegistrationList.prototype.toString = function()
{
  var str = "";
  var node = this.head;
  var i = 0;
  while(node.next != null)
  {
    node = node.next;
    if(node.content !== null)
      str += node.content.toString()+",";
  }
  return str;
};
