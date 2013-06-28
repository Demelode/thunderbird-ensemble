/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const MODULE_NAME = 'test-carddav-connector';
const RELATIVE_ROOT = '../shared-modules';
const MODULE_REQUIRES = ['folder-display-helpers',
                         'address-book-helpers'];

const Cr = Components.results;
const PORT = 5232;
const REQUEST_BODY = "Allow: OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, COPY, MOVE\n" +
   "Allow: MKCOL, PROPFIND, PROPPATCH, LOCK, UNLOCK, REPORT, ACL\n" +
   "DAV: 1, 2, 3, access-control, addressbook\n" +
   "DAV: extended-mkcol\n" +
   "Date: Sat, 11 Nov 2006 09:32:12 GMT\n" +
   "Content-Length: 0";

Cu.import("resource:///modules/mailServices.js");
Cu.import("resource://ensemble/connectors/CardDAVConnector.jsm");
Cu.import("resource://gre/modules/Task.jsm");
Cu.import('resource://mozmill/stdlib/httpd.js');;


function setupModule(module) {
  collector.getModule("folder-display-helpers").installInto(module);
}


function wait_for_promise(promise, done) {
  promise.then(function() {
    return true;
  }, function(aError) {
    return aError;
  });
  
  mc.waitFor(function() done, "Timed out waiting for promise to resolve.");
}


function test_server_connection_success() {
  let done = false;
  // let server = Components.classes["@mozilla.org/server/jshttp;1"]
  //                         .createInstance(Components.interfaces.nsIHttpServer);
  let server = new HttpServer();
  let connector = new CardDAVConnector();

  function connectionResponder(request, response) {
    response.setStatusLine(request.httpVersion, 200, "OK");
    response.setHeader("Content-Type", "text/xml", false);
    response.bodyOutputStream.write(REQUEST_BODY, REQUEST_BODY.length);
  } 

  server.registerPathHandler("/", connectionResponder);
  server.start(PORT);

  dump("Identity After Start: " + server.identity.primaryScheme + "://"
                                + server.identity.primaryHost + ":"
                                + server.identity.primaryPort 
                                + "\n\n");

  let promise = connector.testServerConnection(server.identity.primaryScheme + "://"
                                + server.identity.primaryHost + ":"
                                + server.identity.primaryPort);

  // done = wait_for_promise(promise, done);
  // if(done) {
  //   server.stop();
  // } else {
  //   throw done;
  //   server.stop(function(){});
  // }

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
