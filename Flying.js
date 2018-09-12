/*
Flying
A Roll20 script to indicate a flying token's number of feet above ground.

Github:		https://github.com/blawson69/Flying
Contact:	https://app.roll20.net/users/1781274/ben-l
*/

var Flying = Flying || (function() {
    'use strict';

    var version = '2.0',
        flyMarker = 'fluffy-wing',

    handleInput = function(msg) {
		if (msg.type !== "api") {
			return;
		}

        if (msg.content.startsWith('!fly')) {
            if (!msg.selected) {
                sendChat('Flying', '/w ' + msg.who + ' No tokens were selected!', null, {noarchive:true});
                return;
            }

            var msgparts = msg.content.split(/\s+/), height = 0;
            if (msgparts[1]) msgparts[1] = msgparts[1].replace(/[^\d]+/,'');
            if (msgparts[1] && msgparts[1] !== 0) height = msgparts[1];

            _.each(msg.selected, function(obj) {
                var o = getObj(obj._type, obj._id);
                if(o) {
                    if (o.get("_type") === "graphic" ) {
                        if (o.get("_subtype") === "token") {
                            if (height == 0) {
                                o.set('status_'+flyMarker, false);
                            } else {
                                var oM = o.get("statusmarkers"), nM = [];
                                if (oM.length > 0) {
                                    oM = oM.split(',');
                                    _.each(oM, function(marker){
                                        if (marker.includes(flyMarker) === false) nM.push(marker);
                                    });
                                }

                                var nH = height.toString().split('').reverse();
                                _.each(nH, function(num){
                                    nM.push(flyMarker+'@'+num);
                                });

                                nM = nM.join(',');
                                o.set({statusmarkers: nM});
                            }
                        }
                    }
                }
            });

        }
    },

	logReadiness = function (msg) {
		log('--> Flying v' + version + ' <-- Initialized');
	},

    registerEventHandlers = function() {
        on('chat:message', handleInput);
    };

    return {
        logReadiness: logReadiness,
        RegisterEventHandlers: registerEventHandlers
    };

}());

on("ready",function(){
    'use strict';
    Flying.logReadiness();
    Flying.RegisterEventHandlers();
});
