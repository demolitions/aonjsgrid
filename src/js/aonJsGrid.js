function aonInt(v, r) {
  if (isNaN(r)) {
    r = 10;
  }
  return (isNaN(v) ? 0 : parseInt(v, r));
}
function inSegment(v, segment) {
  var start = Math.min(segment[0], segment[1]);
  var end = Math.max(segment[0], segment[1]);
  return (start <= v && v <= end);
}
function rect(x, y, w, h) {
  var self = this;
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.isColliding = function (other) {

    var sx2 = self.x + self.w;
    var sy2 = self.y + self.h;

    var ox2 = other.x + (other.w - 0.5);
    var oy2 = other.y + (other.h - 0.5);

    var oxin = inSegment(other.x + 0.5, [self.x, sx2]);
    var owin = inSegment(ox2, [self.x, sx2]);
    var oyin = inSegment(other.y + 0.5, [self.y, sy2]);
    var ohin = inSegment(oy2, [self.y, sy2]);
    return ((oxin && oyin) || (owin && oyin) || (owin && ohin) || (oxin && ohin));
  };
}
function aonJsGridItem(object, grid) {
  var self = this;
  if (object && object.constructor === aonJsGridItem) {
    this.obj = $(object.obj).clone().get(0);
    this.grid = object.grid;
    this.pinned = object.pinned;
    this.movepriority = object.movepriority;
    this.itemid = object.itemid;
    this.gridrect = new rect(object.gridrect.x, object.gridrect.y, object.gridrect.w, object.gridrect.h);
    this.pagerect = new rect(object.pagerect.x, object.pagerect.y, object.pagerect.w, object.pagerect.h);
  } else {
    this.obj = object;
    this.grid = grid;
    this.pinned = false;
    this.movepriority = 0;
    this.itemid = 0;
    this.gridrect = new rect();
    this.pagerect = new rect();
  }
  this.fromData = function () {
    self.gridrect.x = Math.max(0, aonInt($(self.obj).attr('data-gridpos-x')));
    self.gridrect.y = Math.max(0, aonInt($(self.obj).attr('data-gridpos-y')));
    self.gridrect.w = Math.max(1, aonInt($(self.obj).attr('data-gridsize-x')));
    self.gridrect.h = Math.max(1, aonInt($(self.obj).attr('data-gridsize-y')));
    self.pinned = ($(self.obj).attr('data-gridlock') === '1');
  };
  this.fromPage = function () {
    self.pagerect.x = $(self.obj).offset().left;
    self.pagerect.y = $(self.obj).offset().top;
    self.pagerect.w = $(self.obj).width();
    self.pagerect.h = $(self.obj).height();
    self.itemid = $(self.obj).attr('data-griditem');
  };
  this.calcPos = function () {
    self.pagerect.x = self.gridrect.x * self.grid.cells.width;
    self.pagerect.y = self.gridrect.y * self.grid.cells.height;
  };
  this.calcSize = function () {
    self.pagerect.w = self.gridrect.w * self.grid.cells.width;
    self.pagerect.h = self.gridrect.h * self.grid.cells.height;
  };
  this.moveDown = function () {
    self.gridrect.y++;
    self.calcPos();
    self.draw();
  };
  this.moveUp = function () {
    if (self.gridrect.y > 0) {
      self.gridrect.y--;
      self.calcPos();
      self.draw();
      return true;
    }
    return false;
  };
  this.draw = function () {
    self.itemid = $(self.obj).attr('data-griditem');
    $(self.obj).css({
      top: self.pagerect.y,
      left: self.pagerect.x,
      height: self.pagerect.h,
      width: self.pagerect.w
    }).html(self.itemid + ')' + self.gridrect.x + '-' + self.gridrect.y + ' : ' + self.movepriority);
  };
  this.isColliding = function (other) {
    return self.gridrect.isColliding(other.gridrect);
  };
  if (!object || object.constructor !== aonJsGridItem) {
    self.fromData();
  }
}

var aonJsGridDefaultOptions = {
  editable: false
};
function aonJsGrid(selector, options) {
  var self = this;
  this.container = selector;
  this.opt = $.extend({}, aonJsGridDefaultOptions, options);
  this.items = [];
  this.offset = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };
  this.cells = {
    columns: 1,
    rows: 1,
    width: 1,
    height: 1
  };

  this.init = function () {
    $(self.container).css({
      position: 'relative'
    });
    $(self.container).find('.aonJsGridItem').css({
      position: 'absolute'
    });
    self.offset.x = aonInt($(self.container).offset().left);
    self.offset.y = aonInt($(self.container).offset().top);
    self.offset.width = aonInt($(self.container).width());
    self.offset.height = aonInt($(self.container).height());
    self.cells.columns = Math.max(1, aonInt($(self.container).attr('data-gridsize-x')));
    self.cells.rows = Math.max(1, aonInt($(self.container).attr('data-gridsize-y')));
    self.cells.width = Math.max(1, Math.floor(self.offset.width / self.cells.columns));
    self.cells.height = Math.max(1, Math.floor(self.offset.height / self.cells.rows));
  };
  this.initItems = function () {
    self.items = [];
    $(self.container).find('.aonJsGridItem').each(function (i, o) {
      self.items.push(new aonJsGridItem(o, self));
      $(o).attr('data-griditem', self.items.length - 1);
    });
  };
  this.posToGrid = function (pos) {
    return {
      x: Math.floor(pos.x / self.cells.width),
      y: Math.floor(pos.y / self.cells.height)
    };
  };
  this.syncitems = function () {
    for (var i in self.items) {
      self.items[i].fromPage();
    }
  };
  this.repositionItems = function () {
    for (var i in self.items) {
      var n = self.items[i];

    }
  };
  this.redraw = function () {
    $(self.container).find('.aonJsGridItem').each(function (i, o) {
      var n = self.items[$(o).attr('data-griditem')];
      if (n && n.constructor === aonJsGridItem) {
        n.calcPos(self.cells);
        n.calcSize(self.cells);
        n.draw();
      }
    });
  };
  this.moveItemDown = function (moving) {
    var moved = false;
    if (!moving.pinned) {
      moving.movepriority = 0;
      // pushing down items
      for (var j in self.items) {
        var n = self.items[j];
        // I'll skip myself, of course
        if (n !== moving) {
          // Am I colliding with another item?
          if (moving.isColliding(n)) {
            // Yep, let's see who is going to move out of the way
            if (moving.movepriority > 0) {
              // I have priority, so I spend it and I won't move
              moving.movepriority--;
            } else {
              // I don't have priority, so I'm moving down to make space
              moving.movepriority++;
              moving.gridrect.y += n.gridrect.h;
//              moving.calcPos();
//              moving.draw();
              moved = true;
            }
          }
        }
      }
    }
    return moved;
  };
  this.moveItemUp = function (moving) {
    var moved = false;
    // moving up items
    if (!moving.pinned) {
      // if my Y coordinate is 0, I can skip to the next item
      if (moving.gridrect < 0) {
        moving.gridrect.y++;
        moved = true;
      } else if (moving.gridrect.y > 0) {
        // i'll try to move up and check if I collide
        moving.gridrect.y--;
        var collision = false;
        for (var j in self.items) {
          // obviously I'll exclude myself
          if (self.items[j] !== moving) {
            if (moving.isColliding(self.items[j])) {
              // collision registered, cannot move
              collision = true;
              moving.gridrect.y++;
            }
          }
        }
        if (!collision) {
//          moving.calcPos();
//          moving.draw();
          moved = true;
        }
      }
    }
    return moved;
  };
  self.init();
  self.initItems();
  self.redraw();
  if (self.opt.editable) {
    $(self.container).find('.aonJsGridItem').draggable({
      helper: 'clone',
      appendTo: 'body',
      start: function (e, ui) {
        var orig = this;
        $(orig).addClass('away');
        $('.aonJsGridItem').removeClass('shadowed');
      },
      stop: function (e, ui) {
        var orig = this;
        $(orig).removeClass('away');
        $(self.container).find('.aonJsGridItem').css({backgroundColor: ''});
        $('.aonJsGridItem').removeClass('shadowed');
      },
      drag: function (e, ui) {
        var hl = ui.helper;
        var itemid = $(this).attr('data-griditem');
        var orig = self.items[aonInt(itemid)];
        var co = $(hl).offset();
        var caster = {
          x: (co.left - self.offset.x) + Math.floor(self.cells.width / 2),
          y: (co.top - self.offset.y) + Math.floor(self.cells.height / 2)
        };
        var oldpos = orig.gridrect;
        var newpos = self.posToGrid(caster);
        orig.gridrect.x = newpos.x;
        orig.gridrect.y = newpos.y;
        for (var i in self.items) {
          if (self.items[i].pinned) {
            self.items[i].movepriority = 9999;
            if (orig.isColliding(self.items[i])) {
              orig.gridrect = oldpos;
            }
          } else {
            self.items[i].movepriority = 0;
          }
        }
        orig.calcPos();
        orig.draw();
        var moved = true;
        var antiloop = self.items.length * 20;
        while (moved && antiloop) {
          antiloop--;
          moved = false;
          for (var i in self.items) {
            var moving = self.items[i];
            orig.movepriority = 1;
            moved = self.moveItemDown(moving);
            if (!moved) {
              moved = self.moveItemUp(moving);
            }
            if (moved) {
              moving.calcPos();
              moving.draw();
            }
          }
        }
      }
    });
  }
}

$.fn.aonJsGrid = function (options) {
  return this.each(function (i, o) {
    var grid = new aonJsGrid(o, options);
  });
};

