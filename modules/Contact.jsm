/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Cu = Components.utils;

let EXPORTED_SYMBOLS = ["Contact"];

Cu.import("resource://ensemble/Underscore.jsm");
Cu.import("resource://ensemble/Backbone.jsm");
Cu.import("resource://ensemble/Record.jsm");
Cu.import("resource://ensemble/BaseRecord.jsm");
Cu.import("resource://ensemble/storage/ContactDBA.jsm");

let Contact = Record.extend({
  defaults: function() {
    return {
      popularity: 0,
      prefersText: false,
      preferDisplayName: true,
      fields: new BaseRecord()
    };
  },

  constructor: function(aFields, aMeta) {
    if (aFields instanceof Record) {
      Backbone.Model.prototype.constructor.call(this);
      this.set("fields", aRecord.get("fields"));
      this.set("popularity", aRecord.get("popularity"));
      this.set("prefersText", aRecord.get("prefersText"));
      this.set("prefersDisplayName", aRecord.get("prefersDisplayName"));
    } else {
      Record.prototype.constructor.call(this, aFields, aMeta);
    }
  }
});
