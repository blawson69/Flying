/*
Flying
A Roll20 script to indicate a flying token's number of feet above ground.

On Github:	https://github.com/blawson69
Contact me: https://app.roll20.net/users/1781274/ben-l

Like this script? Become a patron:
    https://www.patreon.com/benscripts
*/

var Flying = Flying || (function() {
    'use strict';

    var version = '2.2',
    debugMode = false,
    MARKERS,
    ALT_MARKERS = [{name:'red', tag: 'red', url:"#C91010"}, {name: 'blue', tag: 'blue', url: "#1076C9"}, {name: 'green', tag: 'green', url: "#2FC910"}, {name: 'brown', tag: 'brown', url: "#C97310"}, {name: 'purple', tag: 'purple', url: "#9510C9"}, {name: 'pink', tag: 'pink', url: "#EB75E1"}, {name: 'yellow', tag: 'yellow', url: "#E5EB75"}, {name: 'dead', tag: 'dead', url: "X"}],
    styles = {
        box:  'background-color: #fff; border: 1px solid #000; padding: 8px 10px; border-radius: 6px; margin-left: -40px; margin-right: 0px;',
        title: 'padding: 0 0 10px 0; color: ##591209; font-size: 1.5em; font-weight: bold; font-variant: small-caps; font-family: "Times New Roman",Times,serif;',
        button: 'background-color: #000; border-width: 0px; border-radius: 5px; padding: 5px 8px; margin: 8px 0; color: #fff; text-align: center;',
        buttonWrapper: 'text-align: center; margin: 10px 0 4px; clear: both;',
        textButton: 'background-color: transparent; border: none; padding: 0; color: #591209; text-decoration: underline;',
        code: 'display: inline; font-family: "Courier New", Courier, monospace; background-color: #ddd; color: #000; padding: 1px 6px;',
    },

    checkInstall = function () {
        if (!_.has(state, 'Flying')) state['Flying'] = state['Flying'] || {};
        if (typeof state['Flying'].flyMarker == 'undefined') state['Flying'].flyMarker = 'fluffy-wing';
        var chatter = ['Ready for takeoff','Clear the runway','Fasten your seatbelts','Tray tables up','We may experience turbulance'];
        MARKERS = JSON.parse(Campaign().get("token_markers"));
        log('--> Flying v' + version + ' <-- ' + chatter[randomInteger(_.size(chatter)-1)] + '...');
        if (debugMode) {
			var d = new Date();
			showDialog('Debug Mode', 'Flying v' + version + ' loaded at ' + d.toLocaleTimeString() + '<br><a style=\'' + styles.textButton + '\' href="!fly-config">Show config</a>', 'GM');
		}
    },

    handleInput = function(msg) {
		if (msg.type !== "api") {
			return;
		}

        var parms = msg.content.split(/\s+/i);
        switch (parms[0]) {
            case '!fly-config':
                if (playerIsGM(msg.playerid)) showConfig();
                break;
            case '!fly-markers':
                if (playerIsGM(msg.playerid)) showMarkers();
                break;
            case '!fly-set':
                if (playerIsGM(msg.playerid)) {
                    let marker = (parms[1]) ? parms[1] : '';
                    setMarker(marker);
                }
                break;
            case '!fly':
                if (!msg.selected) {
                    showDialog('', 'No tokens were selected!', msg.who);
                    break;
                }

                var msgparts = msg.content.split(/\s+/), height = 0;
                if (msgparts[1]) msgparts[1] = msgparts[1].replace(/[^\d]+/,'');
                if (msgparts[1] && msgparts[1] !== 0) height = parseInt(msgparts[1]);

                _.each(msg.selected, function(obj) {
                    var token = getObj(obj._type, obj._id);
                    if (token && token.get("type") === "graphic") {
                        token.set('status_' + state['Flying'].flyMarker, false);
                        if (height > 0) {
                            var oldMarkers = token.get("statusmarkers"), newMarkers = [];
                            var newHeight = height.toString().split(''); //.reverse();

                            _.each(newHeight, function(num) {
                                newMarkers.push(state['Flying'].flyMarker + '@' + num);
                            });

                            newMarkers = oldMarkers + ',' + newMarkers.join(',');
                            token.set({statusmarkers: newMarkers});
                        }
                    }
                });
        }
    },

    showConfig = function () {
        var marker_style = 'margin: 5px 10px 0 0; display: block; float: left;';
        var message = '<span style=\'' + styles.code + '\'>!fly &lt;number&gt;</span> sets the Flying token marker on the selected token(s) with a marker for every digit. '
        + 'Sending <span style=\'' + styles.code + '\'>!fly 45</span> will place one Flying marker with a "4" and another with a "5" on the token.<br><br>'
        + 'No digits after <span style=\'' + styles.code + '\'>!fly</span> will "land" the token by removing all Flying markers.';

        var curr_marker = _.find(MARKERS, function (x) { return x.tag == state['Flying'].flyMarker; });
        if (typeof curr_marker == 'undefined') curr_marker = _.find(ALT_MARKERS, function (x) { return x.tag == state['Flying'].flyMarker; });
        message += '<hr><h4>Flying Marker</h4>' + getMarker(curr_marker, marker_style) + 'This is the current Flying token marker. You may change it below.';
        message += '<div style="' + styles.buttonWrapper + '"><a style="' + styles.button + '" href="!fly-markers" title="This may result in a very long list...">Choose Marker</a></div>';
        message += '<div style="text-align: center;"><a style="' + styles.textButton + '" href="!fly-set &#63;&#123;Token Marker&#124;&#125;">Set manually</a></div>';

        showDialog('Help Menu', message);
    },

    showMarkers = function () {
        var message = '<table style="border: 0; width: 100%;" cellpadding="0" cellspacing="2">';
        _.each(ALT_MARKERS, function (marker) {
            message += '<tr><td>' + getMarker(marker, 'margin-right: 10px;') + '</td><td style="white-space: nowrap; width: 100%;">' + marker.name + '</td>';
            if (marker == state['Flying'].flyMarker) {
                message += '<td style="text-align: center;">Current</td>';
            } else {
                message += '<td style="text-align: center; white-space: nowrap;"><a style="' + styles.button + '" href="!fly-set ' + marker.tag + '">Set Marker</a></td>';
            }
            message += '</tr>';
        });

        _.each(MARKERS, function (icon) {
            message += '<tr><td>' + getMarker(icon, 'margin-right: 10px;') + '</td><td style="white-space: nowrap; width: 100%;">' + icon.name + '</td>';
            if (icon.tag == state['Flying'].flyMarker) {
                message += '<td style="text-align: center;">Current</td>';
            } else {
                message += '<td style="text-align: center; white-space: nowrap;"><a style="' + styles.button + '" href="!fly-set ' + icon.tag.replace('::','=') + '">Set Marker</a></td>';
            }
            message += '</tr>';
        });

        message += '<tr><td colspan="3" style="text-align: center;"><a style="' + styles.button + '" href="!fly-config">&#9668; Back</a></td></tr>';
        message += '</table>';

        showDialog('Choose Flying Marker', message);
    },

    setMarker = function (marker) {
        /*
        var status_markers = ['blue', 'brown', 'green', 'pink', 'purple', 'red', 'yellow', 'all-for-one', 'angel-outfit', 'archery-target', 'arrowed', 'aura', 'back-pain', 'black-flag', 'bleeding-eye', 'bolt-shield', 'broken-heart', 'broken-shield', 'broken-skull', 'chained-heart', 'chemical-bolt', 'cobweb', 'dead', 'death-zone', 'drink-me', 'edge-crack', 'fishing-net', 'fist', 'fluffy-wing', 'flying-flag', 'frozen-orb', 'grab', 'grenade', 'half-haze', 'half-heart', 'interdiction', 'lightning-helix', 'ninja-mask', 'overdrive', 'padlock', 'pummeled', 'radioactive', 'rolling-bomb', 'screaming', 'sentry-gun', 'skull', 'sleepy', 'snail', 'spanner', 'stopwatch', 'strong', 'three-leaves', 'tread', 'trophy', 'white-tower'];
        if (_.find(status_markers, function (tmp) {return tmp === marker; })) {
            state['Flying'].flyMarker = marker;
        } else {
            showDialog('Error', 'The status marker "' + marker + '" is invalid. Please try again.');
        }
        */

        marker = marker.replace('=', '::');
        var status_markers = _.pluck(MARKERS, 'tag');
        _.each(_.pluck(ALT_MARKERS, 'tag'), function (x) { status_markers.push(x); });
        if (_.find(status_markers, function (tmp) {return tmp === marker; })) {
            state['Flying'].flyMarker = marker;
        } else {
            showDialog('Error', 'The token marker "' + marker + '" is invalid. Please try again.');
        }

        showConfig();
    },

    getMarker = function (marker, style = '') {
        var marker_style = 'width: 24px; height: 24px;' + style;
        var return_marker = '<div style="' + marker_style + ' font-family: Webdings; color: #c00;">x</div>';
        if (typeof marker != 'undefined' && typeof marker.tag != 'undefined') {
            var status_markers = _.pluck(MARKERS, 'tag'),
            alt_marker = _.find(ALT_MARKERS, function (x) { return x.tag == marker.tag; });

            if (_.find(status_markers, function (x) { return x == marker.tag; })) {
                var icon = _.find(MARKERS, function (x) { return x.tag == marker.tag; });
                return_marker = '<img src="' + icon.url + '" width="24" height="24" style="' + marker_style + '" />';
            } else if (typeof alt_marker !== 'undefined') {
                if (alt_marker.url === 'X') {
                    marker_style += 'color: #C91010; font-size: 30px; line-height: 24px; font-weight: bold; text-align: center; padding-top: 0px; overflow: hidden;';
                    return_marker = '<div style="' + marker_style + '">X</div>';
                } else {
                    marker_style += 'background-color: ' + alt_marker.url + '; border: 1px solid #fff; border-radius: 50%;';
                    return_marker = '<div style="' + marker_style + '"></div>';
                }
            }
        }
        return return_marker;
    },

    showDialog = function (title, content, whom = 'GM') {
        var whisperTo = '', gm = /\(GM\)/i;
        whisperTo = (gm.test(whom)) ? 'GM' : '"' + whom + '" ';

        title = (title == '') ? '' : '<div style=\'' + styles.title + '\'>' + title + '</div>';
        var body = '<div style=\'' + styles.box + '\'>' + title + '<div>' + content + '</div></div>';
        sendChat('Flying','/w GM ' + whisperTo + body, null, {noarchive:true});
    },

    registerEventHandlers = function() {
        on('chat:message', handleInput);
    };

    return {
        CheckInstall: checkInstall,
        RegisterEventHandlers: registerEventHandlers
    };

}());

on("ready",function(){
    'use strict';
    Flying.CheckInstall();
    Flying.RegisterEventHandlers();
});
