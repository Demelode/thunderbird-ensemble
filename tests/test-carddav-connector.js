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
Cu.import("resource://testing-common/httpd.js");

function setupModule(module) {
  collector.getModule("folder-display-helpers").installInto(module);
}

function test_server_connection_success() {
  // let server = Components.classes["@mozilla.org/server/jshttp;1"]
  //                        .createInstance(Components.interfaces.nsIHttpServer);
  let server = new nsHttpServer();
                      
  function connectionResponder(request, response) {
    response.setStatusLine(request.httpVersion, 200, "OK");
    response.setHeader("Content-Type", "text/xml", false);
    response.bodyOutputStream.write(REQUEST_BODY, REQUEST_BODY.length);
  } 

  server.registerPathHandler("/", connectionResponder);
  server.start(PORT);

  let connector = new CardDAVConnector();
  let promise = connector.testServerConnection("http://localhost:" + PORT);
  let done = false;

  promise.then(function() {
  	server.stop();
    done = true;
  }, function(aError) {
  	server.stop();
    throw aError;
  });

   mc.waitFor(function() done, "Timed out waiting for promise to resolve.");
}