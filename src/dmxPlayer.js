var dmxpro  = require('dmxpro');

var universe = null;
var groups = {};

function resolveFixtures(value, room) {
  value.fixtures = [];
  for (var i in value.groups) {        
    var g = value.groups[i];
    if (g in groups) {
      value.fixtures = value.fixtures.concat(groups[g].fixtures);
    }
  }
  return value;
}

module.exports = function() {
  return {
    start: function(room) { 
      var dmxconf = room.dmx;

      for (var i in dmxconf.groups) {
        group = dmxconf.groups[i];
        groups[group.id] = {
          name: group.name,
          fixtures: group.fixtures
        };
      }

      try {
        universe = dmxpro.alloc();
        dmxpro.init(universe, dmxconf);
        console.log("DMX initialized!");
        dmxpro.start(universe); //if fading is needed..
      } catch(e) {
        console.log("DMX failed to start!");
        if (universe !== null) {
          dmxpro.shutdown(universe);
        }
        universe = null;
      }
    },

    shutdown: function() {
      if (universe !== null ) {
        dmxpro.black(universe);
        dmxpro.shutdown(universe);
        universe = null;
        console.log("DMX shutdown!");
      }    
    },

    reset: function() {
      console.log('DMX blackout');
      dmxpro.black(universe); 
    },

    message: function(value, room) {
      if (universe && typeof value.colour !== "undefined" && typeof value.groups !== "undefined") {
        value = resolveFixtures(value, room);
        dmxpro.message(universe, value); 
      }
    }
  };
  
};
