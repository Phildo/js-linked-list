var RegistrationList = function()
{
  var self = this;

  function RegListNode(content)
  {
    var node = this;
    node.prev = null;
    node.next = null;
    node.content = content;
  }

  function insertNodeAfter(node, prevNode)
  {
    node.prev = prevNode;
    node.next = prevNode.next;
    node.prev.next = node;
    node.next.prev = node;

    if(if node.content !== null)
    {
      Object.defineProperty(node.content, "registrationListNode", {
        enumerable:false,
        configurable:true,
        writable:true,
        value:node
      });
    }

    return node;
  }

  function removeNode(node)
  {
    node.prev.next = node.next;
    node.next.prev = node.prev;

    node.next = null;
    node.prev = null;

    delete node.content.registrationListNode;

    return node;
  }

  var head = new RegListNode(null);
  var tail = new RegListNode(null);
  head.next = tail;
  tail.prev = head;
}

RegistrationList.prototype.register = function(content)
{
  insertNodeAfter(new RegListNode(content), head);
}

RegistrationList.prototype.unregister = function(content)
{
  removeNode(content.registrationListNode);
}

RegistrationList.prototype.moveToList = function(content, list)
{
  list.register(removeNode(content.registrationListNode));
}

RegistrationList.prototype.performOnMembers = function(func)
{
  var node = head;
  while(node.next != null)
  {
    func(node.content);
    node = node.next;
  }
}
