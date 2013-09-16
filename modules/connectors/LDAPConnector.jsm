/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;
const Cr = Components.results;

let EXPORTED_SYMBOLS = ['LDAPConnector'];

Cu.import("resource://gre/modules/Promise.jsm");
Cu.import("resource://gre/modules/Task.jsm");
Cu.import("resource://gre/modules/Services.jsm");

Cu.import("resource://ensemble/lib/VCardParser.jsm");
Cu.import("resource://ensemble/Record.jsm");
Cu.import("resource://ensemble/connectors/MemoryRecordCache.jsm");

let LDAPConnector = function(aAccountKey, aListener, aCache) {
    this._accountKey = aAccountKey;
    this._listener = aListener;
    this._cache = aCache;
};

LDAPConnector.prototype = {
    _prefs: null,
    _displayName: "",
    _initialized: false,
    _initializing: false,
    _credentials: "",
    
    get AccountKey() this._accountKey,
    get isSyncable() true,
    get isWritable() false,
    get shouldPoll() true,
    get displayName() this._displayName,
    get initializing() this._initializing,
    get initialized() this._initialized,
    
    testConnection: function() {
        return null;
    },
    
    authorize: function() {
        return null;
    },

    init: function() {
        return null;
    },

    read: function() {
        return null;
    },

    poll: function() {
        return null;
    },
};

LDAPConnector.isSingleton = true;
LDAPConnector.iconURL = "TBD!";
LDAPConnector.serviceName = "LDAP Connector";
LDAPConnector.createConnectionURI = "TBD!";
LDAPConnector.managementURI = "TBD!";
LDAPConnector.defaultPrefs = {};
LDAPConnector.uniqueID = "carddav-connector";