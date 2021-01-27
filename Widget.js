// ReSharper disable InconsistentNaming
define([
  "dojo/_base/declare",
  "dojo/_base/array",
  "dojo/_base/lang",
  "dojo/dom-style",
  "dojo/on",
  "dojo/query",
  "jimu/BaseWidget",
  "esri/IdentityManager",
], function (
  declare,
  array,
  lang,
  domStyle,
  on,
  query,
  BaseWidget,
  IdentityManager
) {
  var widget = declare([BaseWidget], {
    baseClass: "google-analytics",
    name: "GoogleAnalytics",

    postCreate: function () {
      var userId = IdentityManager.credentials[0].userId;
      eval(this.config.code);
      ga("send", "event", "Widget", "Google Analytics", "postCreate");
      this.inherited(arguments);
      ga("set", "userId", userId);
    },

    startup: function () {
      this.inherited(arguments);

      ga("send", "pageview");

      var widgets = this.appConfig.widgetPool.widgets;
      var widgetElements = document.getElementsByClassName(
        "jimu-anchorbar-iconitem"
      );

      array.forEach(
        widgetElements,
        lang.hitch(this, function (widget) {
          on(
            widget,
            "click",
            lang.hitch(this, function (event) {
              var widgetName = widgets.filter(
                (w) => w.id === widget.attributes.settingid.value
              )[0].name;
              ga("send", "event", "Widget", "click", widgetName);
            })
          );
        })
      );

      // array.forEach(this.map.layerIds, lang.hitch(this, function (id) {
      // 	var layer = this.map.getLayer(id);
      // 	ga('send', 'event', 'Layers', layer.id, layer.url);
      // }));

      // on(this.map, 'layer-add', lang.hitch(this, function (event) {
      // 	var layer = event.layer;
      // 	ga('send', 'event', 'Map', 'layer-add', 'id:' + layer.id + ' url:' + layer.url);
      // }));

      // on(this.map, 'layer-remove', lang.hitch(this, function (event) {
      // 	var layer = event.layer;
      // 	ga('send', 'event', 'Map', 'layer-remove', 'id:' + layer.id + ' url:' + layer.url);
      // }));

      // hide the icon in the menu bar
      // on(window, "resize", function () {
      //   console.log("resize!");
      //   this._hideMenuIcon(this.id, this.label);
      // }).bind(this);

      on(window, "resize", () => this._hideMenuIcon(this.id, this.label));

      this._hideMenuIcon(this.id, this.label);
    },

    onOpen: function () {},

    onClose: function () {},

    _hideMenuIcon: function (id, label) {
      // should work with all themes
      // Usage, takes id and label and selects div element with a matching settingid or title.
      // Some themes use a settingsid, others use title
      //The only items that will have this are the icon divs.

      function hide(nodes) {
        // run in loop just in case we get more than one node
        array.forEach(nodes, function (node) {
          domStyle.set(node, "display", "none");
        });
      }

      var byId, byLabel, qryById, qryByLabel;

      qryById = "[settingid='" + id + "']";
      nodesById = query(qryById);
      qryByLabel = "[title='" + label + "']";
      nodesByLabel = query(qryByLabel);

      if (nodesById.length > 0) {
        hide(nodesById);
      } else if (nodesByLabel.length > 0) {
        hide(nodesByLabel);
      } else {
        alert(
          "Google Analytics Widget Failed to Hide it's Icon.  Widget not supported with this theme"
        );
      }
    },
  });

  return widget;
});
