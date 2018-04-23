'use strict';

module.exports = {
  rules: [{
    name: 'Page beacon',
    events: [{
      modulePath: 'sandbox/pageTop.js',
      settings: {}
    }],
    conditions: [],
    actions: [{
      modulePath: "adobe-va-sample-player/dist/lib/actions/openVideo.js",
      settings: {
        player: {
          id: 'videoTag1',
          type: 'videoTag',
          selector: '#container',
          width: '600',
          height: '400',
          controls: true,
          muted: true,
          autoplay: false,
        },
        media: {
          id: 'videoId',
          url: 'video/video.mp4',
          metadata: {
            name: 'videoName',
            movieName: 'movieName',
            movieRating: 'movieRating'
          },
        },
        analytics: {
          type: 'adobe-video-analytics',
          enabled: true,
        }
      }
    }]
  },{
    name: 'Player Event',
    events: [{
      modulePath: 'adobe-va-sample-player/dist/lib/events/playerEvent.js',
      settings: {
        playerEvent : 'MediaPlay',
        playerId : 'videoTag1'
        // If playerId is absent, we listen for the event from all the players created through openVideo.
      }
    }],
    conditions: [],
    actions: [{
      modulePath: "other-extension/src/a.js",
      settings: {}
    }]
  }],
  dataElements: {},
  extensions: {
    "adobe-mcid": {
      displayName: 'Adobe MCID',
      settings: {
        "orgId": "93B41AC151F037F00A490D4D@AdobeOrg"
      }
    },
    "adobe-analytics": {
      displayName: 'Adobe Analytics',
      settings: {
        "libraryCode": {
          "type": "managed",
          "accounts": {
            "production": [
              "mobile1vhl.sample.player"
            ]
          },
          "loadPhase": "pageBottom"
        },
        "trackerProperties": {
          "trackingServer": "namespace.sc.omtrdc.net",
          "trackInlineStats": true,
          "trackDownloadLinks": true,
          "trackExternalLinks": true,
          "linkDownloadFileTypes": [
            "doc",
            "docx"
          ],
          "linkInternalFilters": [
            "javascript:",
            "tel:",
            "mailto:"
          ]
        }
      }
    },
    "adobe-video-analytics": {
      displayName: 'Adobe Analytics For Video',
      settings: {
        "trackingServer": "namespace.hb.omtrdc.net",
        "playerName": "HTML5 Basic",
        "channel": "Video Channel",
        "debugLogging": true,
        "appVersion": "2.0",
        "ssl": false,
        "ovp": "HTML5"
      },
      // This will be populated automatically based on features found in extension.json.
      modules: {}
    },
    "adobe-va-sample-player": {
      settings: {

      }
    },
    "other-extension": {
      displayName: "Some other extension",
      "modules": {
        "other-extension/src/a.js": {
          "script": function(module, exports, require, turbine) {
            module.exports =  function(settings, event){
              console.log(event);
            }
          }
        }
      }
    }
  },
  property: {
    name: 'Sandbox property',
    settings: {
      domains: [
        'adobe.com',
        'example.com'
      ],
      linkDelay: 100,
      euCookieName: 'sat_track',
      undefinedVarsReturnEmpty: false
    }
  },
  buildInfo: {
    turbineVersion: '14.0.0',
    turbineBuildDate: '2016-07-01T18:18:34Z',
    buildDate: '2016-07-01T18:18:34Z',
    environment: 'development'
  }
};