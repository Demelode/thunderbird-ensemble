/* This Source Code Form issubject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

let EXPORTED_SYMBOLS = ['CardDAVConnector'];

Cu.import("resource://gre/modules/commonjs/sdk/core/promise.js");
Cu.import("resource://gre/modules/Task.jsm");

let CardDAVConnector = function(aAccountKey, aRecordChangesCbObj) {};

CardDAVConnector.prototype = {

  // Testing a server connection by OPTIONS requesting a given URI.
  // An example for a successful OPTIONS response would look like:
  // 
  // Allow: DELETE, HEAD, GET, MKCALENDAR, MKCOL, MOVE, OPTIONS, PROPFIND, PROPPATCH, PUT, REPORT
  // Content-Length: 0
  // DAV: 1, 2, 3, calendar-access, addressbook, extended-mkcol
  // Date: Fri, 14 Jun 2013 18:54:46 GMT
  // Server: WSGIServer/0.1 Python/2.7.3
  //
  // This would produce a response status of 200. 

  testServerConnection: function(url) {
    let deferred = Promise.defer();
    let http = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"]
                 .createInstance(Ci.nsIXMLHttpRequest);
    http.open("OPTIONS", url, true);

    http.onload = function(aEvent) {
      if (http.readyState === 4) {
        if (http.status === 200) {
          deferred.resolve();
        } else {
          let e = new Error("The connection errored with status " + 
                            http.status + " during the onload event");
          deferred.reject(e);
        }
      }
    }
    
    http.onerror = function(aEvent) {
      let e = new Error("The connection errored with status " + 
                        http.status + " during the onerror event");
      deferred.reject(e);
    }

    http.send(null);
    return deferred.promise;
  },


  // Creating an CardDAV Address Book at the specified url location. 
  createAddressBook: function(url, addressBookObj) {
    let deferred = Promise.defer();
    let http = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"]
                 .createInstance(Ci.nsIXMLHttpRequest);

    let addressBookURL = url + addressBookObj.location;
    let addressBookXML = '<?xml version="1.0" encoding="utf-8" ?>' +
                         '<D:mkcol xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:carddav">'+
                           '<D:set>' +
                             '<D:prop>' +
                             '<D:resourcetype>' +
                               '<D:collection/>' +
                               '<C:addressbook/>' +
                             '</D:resourcetype>' +
                             '<D:displayname>' + 
                               addressBookObj.displayName + 
                             '</D:displayname>' +
                             '<C:addressbook-description xml:lang="en">' +
                               addressBookObj.description + 
                             '</C:addressbook-description>' +
                             '</D:prop>' +
                           '</D:set>' +
                         '</D:mkcol>';
    http.open('MKCOL', addressBookURL, true);
    http.setRequestHeader('Host', url, false);
    http.setRequestHeader('Content-Length', 'xxx', false);
    http.setRequestHeader('Content-Type', 'text/xml; charset="utf-8"', false);

    http.onload = function(aEvent) {
      if (http.readyState === 4) {
        if (http.status === 201) { // Status 201 is "Created"
          deferred.resolve();
        } else {
          let e = new Error("The address book creation attempt errored with status " + 
                            http.status + " during the onload event");
          deferred.reject(e);
        }
      }
    }
    
    http.onerror = function(aEvent) {
      let e = new Error("The address book creation attempt errored with status " + 
                        http.status + " during the onerror event");
      deferred.reject(e);
    }

    http.send(addressBookXML);
    return deferred.promise;
  },


  // Deleting an CardDAV Address Book at the specified url location. 
  deleteAddressBook: function(url) {
    let deferred = Promise.defer();
    let http = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"]
                 .createInstance(Ci.nsIXMLHttpRequest);

    http.open('DELETE', url, true);

    http.onload = function(aEvent) {
      if (http.readyState === 4) {
        if (http.status === 200) { // Status 200 is "OK"
          deferred.resolve();
        } else {
          let e = new Error("The address book deletion attempt errored with status " + 
                            http.status + " during the onload event");
          deferred.reject(e);
        }
      }
    }
    
    http.onerror = function(aEvent) {
      let e = new Error("The address book deletion attempt errored with status " + 
                        http.status + " during the onerror event");
      deferred.reject(e);
    }

    http.send(null);
    return deferred.promise;
  },


  // Creating an CardDAV Contact at the specified url location 
  // from a predefined contact object. 
  createContact: function(url, contactObj) {
    let deferred = Promise.defer();
    let http = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"]
                 .createInstance(Ci.nsIXMLHttpRequest);

    let contactXML = 'BEGIN:VCARD' +
                     'VERSION:3.0' +
                     'FN:' + contactObj.fullName +
                     'N:' + contactObj.name +
                     'ADR;TYPE=' + contactObj.addressType + 
                        ':;' + contactObj.address +
                     'EMAIL;TYPE=' + contactObj.emailType + 
                        ',PREF:' + contactObj.email +
                     'NICKNAME:' + contactObj.nickName +
                     'NOTE:' + contactObj.note +
                     'ORG:' + contactObj.org +
                     'TEL;TYPE=' + contactObj.teleType + 
                        ',VOICE:' + contactObj.tele +
                     'URL:' + contactObj.website +
                     'UID:' + contactObj.UID +
                     'END:VCARD';

    http.open('PUT', url, true);
    http.setRequestHeader('If-None-Match', '*', false);
    http.setRequestHeader('Host', url, false); // maybe incorrect
    http.setRequestHeader('Content-Length', 'xxx', false);
    http.setRequestHeader('Content-Type', 'text/vcard', false);

    http.onload = function(aEvent) {
      if (http.readyState === 4) {
        if (http.status === 201) { // Status 201 is "Created"
          deferred.resolve();
        } else {
          let e = new Error("The contact creation attempt errored with status " + 
                            http.status + " during the onload event");
          deferred.reject(e);
        }
      }
    }
    
    http.onerror = function(aEvent) {
      let e = new Error("The contact creation attempt errored with status " + 
                        http.status + " during the onerror event");
      deferred.reject(e);
    }

    http.send(contactXML);
    return deferred.promise;
  },


  // Deleting an CardDAV contact at the specified url location. 
  deleteContact: function(url) {
    let deferred = Promise.defer();
    let http = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"]
                 .createInstance(Ci.nsIXMLHttpRequest);

    http.open('DELETE', url, true);

    http.onload = function(aEvent) {
      if (http.readyState === 4) {
        if (http.status === 200) { // Status 200 is "OK"
          deferred.resolve();
        } else {
          let e = new Error("The contact deletion attempt errored with status " + 
                            http.status + " during the onload event");
          deferred.reject(e);
        }
      }
    }
    
    http.onerror = function(aEvent) {
      let e = new Error("The contact deletion attempt errored with status " + 
                        http.status + " during the onerror event");
      deferred.reject(e);
    }

    http.send(null);
    return deferred.promise;
  },

}