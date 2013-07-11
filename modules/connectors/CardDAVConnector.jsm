/* This Source Code Form issubject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

const kCardDAVServerURL = "http://localhost:5232";
const kAddressBookURL = "/jon/contacts/";

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


  readRecords: function() {
    let deferred = Promise.defer();
    let http = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"]
                 .createInstance(Ci.nsIXMLHttpRequest);

    http.open('REPORT', kAddressBookURL, true);
    http.responseType = 'json';
    http.setRequestHeader('Host', kCardDAVServerURL, false);
    http.setRequestHeader('Depth', 1, false);
    http.setRequestHeader('Content-Type', 'text/xml; charset="utf-8"', false);
    http.setRequestHeader('Content-Length', 'xxxx', false);

    let requestXML = '<?xml version="1.0" encoding="utf-8" ?>' +
                     '<C:addressbook-query xmlns:D="DAV:" ' + 
                     'xmlns:C="urn:ietf:params:xml:ns:carddav">' +
                         '<D:prop>' +
                           '<C:address-data>' +
                             '<C:prop name="VERSION"/>' +
                             '<C:prop name="UID"/>' +
                             '<C:prop name="NICKNAME"/>' +
                             '<C:prop name="EMAIL"/>' +
                             '<C:prop name="FN"/>' +
                           '</C:address-data>' +
                         '</D:prop>' +
                     '</C:addressbook-query>';

    http.onload = function(aEvent) {
      if (http.readyState === 4) {
        if (http.status === 207) { // Status 207 is "multi-status"
          deferred.resolve(http.response);
        } else {
          let e = new Error("The readRecord attempt errored with status " + 
                            http.status + " during the onload event");
          deferred.reject(e);
        }
      }
    }
    
    http.onerror = function(aEvent) {
      let e = new Error("The readRecord attempt errored with status " + 
                        http.status + " during the onerror event");
      deferred.reject(e);
    }

    http.send(requestXML);
    return deferred.promise;
  },


  readRecords: function(aIDCollection) {
    
  },


  // Creating an CardDAV Address Book at the specified url location. 
  // createAddressBook: function(url, addressBookObj) {
  //   let deferred = Promise.defer();
  //   let http = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"]
  //                .createInstance(Ci.nsIXMLHttpRequest);

  //   let addressBookURL = url + addressBookObj.location;
  //   let addressBookXML = '<?xml version="1.0" encoding="utf-8" ?>' +
  //                        '<D:mkcol xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:carddav">'+
  //                          '<D:set>' +
  //                            '<D:prop>' +
  //                            '<D:resourcetype>' +
  //                              '<D:collection/>' +
  //                              '<C:addressbook/>' +
  //                            '</D:resourcetype>' +
  //                            '<D:displayname>' + 
  //                              addressBookObj.displayName + 
  //                            '</D:displayname>' +
  //                            '<C:addressbook-description xml:lang="en">' +
  //                              addressBookObj.description + 
  //                            '</C:addressbook-description>' +
  //                            '</D:prop>' +
  //                          '</D:set>' +
  //                        '</D:mkcol>';
  //   http.open('MKCOL', addressBookURL, true);
  //   http.setRequestHeader('Host', url, false);
  //   http.setRequestHeader('Content-Length', 'xxx', false);
  //   http.setRequestHeader('Content-Type', 'text/xml; charset="utf-8"', false);

  //   http.onload = function(aEvent) {
  //     if (http.readyState === 4) {
  //       if (http.status === 201) { // Status 201 is "Created"
  //         deferred.resolve();
  //       } else {
  //         let e = new Error("The address book creation attempt errored with status " + 
  //                           http.status + " during the onload event");
  //         deferred.reject(e);
  //       }
  //     }
  //   }
    
  //   http.onerror = function(aEvent) {
  //     let e = new Error("The address book creation attempt errored with status " + 
  //                       http.status + " during the onerror event");
  //     deferred.reject(e);
  //   }

  //   http.send(addressBookXML);
  //   return deferred.promise;
  // },

}