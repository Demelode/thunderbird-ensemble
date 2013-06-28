/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const MODULE_NAME = 'test-carddav-connector';
const RELATIVE_ROOT = '../shared-modules';
const MODULE_REQUIRES = ['folder-display-helpers',
                         'address-book-helpers'];

Cu.import("resource:///modules/mailServices.js");
Cu.import("resource://ensemble/connectors/CardDAVConnector.jsm");
Cu.import("resource://gre/modules/Task.jsm");
Cu.import('resource://mozmill/stdlib/httpd.js');;

const Cr = Components.results;
const PORT = 5232;
const REQUEST_BODY = "Allow: OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, COPY, MOVE\n" +
  "Allow: MKCOL, PROPFIND, PROPPATCH, LOCK, UNLOCK, REPORT, ACL\n" +
  "DAV: 1, 2, 3, access-control, addressbook\n" +
  "DAV: extended-mkcol\n" +
  "Date: Sat, 11 Nov 2006 09:32:12 GMT\n" +
  "Content-Length: 0";

const kReturnHeader = {
  statusCode: 200,
  statusString: "OK",
  contentType: "text/plain",
}

const kCardDAVReturnHeader = {
  statusCode: 200,
  statusString: "OK",
  contentType: "text/xml",
  headerBody: "Allow: OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, COPY, MOVE\n" +
    "Allow: MKCOL, PROPFIND, PROPPATCH, LOCK, UNLOCK, REPORT, ACL\n" +
    "DAV: 1, 2, 3, access-control, addressbook\n" +
    "DAV: extended-mkcol\n" +
    "Date: Sat, 11 Nov 2006 09:32:12 GMT\n" +
    "Content-Length: 0",
}

function MockCardDAVServer() {}

MockCardDAVServer.prototype = {
  _server = null,
  _port = null,

  init: function MCDS_init(port) {
    this._server = new HttpServer();
    this._port = port;    
  },

  start: function MCDS_start() {
    this._server.start(this._port);
  },

  stop: function MCDS_stop(promise) {
    let done = false;
    promise.then(function() {
      server.stop(function(){
        done = true;
      });
    }, function(aError) {
      server.stop(function(){
        done = false;
      });
      return aError;
    });
    
    mc.waitFor(function() done, "Timed out waiting for promise to resolve.");
  },
}


function setupModule(module) {
  collector.getModule("folder-display-helpers").installInto(module);
}


function test_server_connection_success() {
  let done = false;
  let server = new HttpServer();
  let connector = new CardDAVConnector();

  function connectionResponder(request, response) {
    response.setStatusLine(request.httpVersion, 200, "OK");
    response.setHeader("Content-Type", "text/xml", false);
    response.bodyOutputStream.write(kCardDAVReturnHeader.headerBody, kCardDAVReturnHeader.headerBody.length);
  } 

  server.registerPathHandler("/", connectionResponder);
  server.start(PORT);

  let promise = connector.testServerConnection(server.identity.primaryScheme + "://"
                                + server.identity.primaryHost + ":"
                                + server.identity.primaryPort);

  promise.then(function() {
    server.stop(function(){
      done = true;
    });
  }, function(aError) {
    server.stop(function(){
      done = false;
    });
    return aError;
  });
  
  mc.waitFor(function() done, "Timed out waiting for promise to resolve.");
 
}
