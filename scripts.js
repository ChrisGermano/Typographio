var apiKey = "AIzaSyD7XARU-og80ziPYn0yOkpBMnFJlrnnHBg";
var googleFontList = "https://www.googleapis.com/webfonts/v1/webfonts?key=" + apiKey;

new Vue({
  el: '#wrapper',
  data: {
    families: [],
    knownFamilies: [],
    userInput: ""
  },
  created: function () {

    this.httpGetAsync(googleFontList, function(data) {

      var tempFamilies = []

      data = JSON.parse(data);

      for (var f = 0; f < data.items.length; f++) {
        tempFamilies.push(data.items[f].family);
      }

      new autoComplete({
        selector: '#userText',
        minChars: 1,
        source: function(term, suggest) {
          var choices = tempFamilies;
          var matches = [];
          for (var i = 0; i < choices.length; i++) {
            if (~choices[i].indexOf(term)) matches.push(choices[i]);
          }
          suggest(matches);
        }
      })

    });

  },
  methods: {
    update: _.debounce(function (e) {

      var text = this.userInput;
      var tiles = document.getElementsByClassName("text-tile");

      for (var t = 0; t < tiles.length; t++) {
        console.log("Update");
        tiles[t].childNodes[0].value = text;
      }

    }, 100),

    loadFont: function(family) {

      var vue = this;

      WebFont.load({
        google: {
          families: [family]
        },
        loading: function() {
          document.getElementById("userText").placeholder = "Searching...";
        },
        fontinactive: function(family, fvd) {
        document.getElementById("userText").placeholder = "\""+family+"\" is not a family";
        },
        fontactive: function(family, fvd) {
          if (vue.$data.families.indexOf(family) == -1) {
            vue.$data.families.push(family);
            vue.userInput = "";
            document.getElementById("userText").value = "";
            document.getElementById("userText").placeholder = "Test or add fonts!";
          }
        }
      });

    },

    onSubmit: function(event) {
      event.preventDefault();
      this.loadFont(document.getElementById("userText").value);
      document.getElementById("userText").value = "";
    },

    httpGetAsync(url, callback) {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() {
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
              callback(xmlHttp.responseText);
      }
      xmlHttp.open("GET", url, true); // true for asynchronous
      xmlHttp.send(null);
    }

  }

});
