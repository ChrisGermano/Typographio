new Vue({
  el: '#wrapper',
  data: {
    families: ["Monaco"]
  },
  methods: {
    update: _.debounce(function (e) {

      var text = document.getElementById("UserText").value;
      var tiles = document.getElementsByClassName("text-tile");

      for (var t = 0; t < tiles.length; t++) {
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
    }

  }

});
