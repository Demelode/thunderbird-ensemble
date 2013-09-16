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
Cu.import("resource://gre/modules/ctypes.jsm");

Cu.import("resource://ensemble/Record.jsm");
Cu.import("resource://ensemble/connectors/MemoryRecordCache.jsm");

// Determine Operating System
let OSName = "Unknown OS";
if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";

// Load the appropriate library
let lib;
if (OSName === "Windows") {
    lib = ctypes.open("user32.dll");
} else if (OSName === "MacOS") {
    lib = ctypes.open("/System/Library/Frameworks/CoreFoundation.framework/CoreFoundation");
    throw Cr.NS_ERROR_NOT_IMPLEMENTED;
} else {
    throw Cr.NS_ERROR_NOT_IMPLEMENTED;
}


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
        return Cr.NS_ERROR_NOT_IMPLEMENTED;
    },
    
    authorize: function() {
        return Cr.NS_ERROR_NOT_IMPLEMENTED;
    },

    init: function() {
        return Cr.NS_ERROR_NOT_IMPLEMENTED;
    },

    read: function() {
        return Cr.NS_ERROR_NOT_IMPLEMENTED;
    },

    poll: function() {
        return Cr.NS_ERROR_NOT_IMPLEMENTED;
    },
};

LDAPConnector.isSingleton = true;
LDAPConnector.iconURL = "TBD!";
LDAPConnector.serviceName = "LDAP Connector";
LDAPConnector.createConnectionURI = "TBD!";
LDAPConnector.managementURI = "TBD!";
LDAPConnector.defaultPrefs = {};
LDAPConnector.uniqueID = "ldap-connector";