/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const MODULE_NAME = 'test-carddav-connector';
const RELATIVE_ROOT = '../shared-modules';
const MODULE_REQUIRES = ['folder-display-helpers',
                         'address-book-helpers'];

const Cr = Components.results;

const radicaleLocalServerHTTP = "http://localhost:5232/";

Cu.import("resource:///modules/mailServices.js");
Cu.import("resource://ensemble/connectors/CardDAVConnector.jsm");
Cu.import("resource://gre/modules/Task.jsm");

function setupModule(module) {
  collector.getModule("folder-display-helpers").installInto(module);
}

function test_server_connection_success() {
  let connector = new CardDAVConnector();
  let promise = connector.testServerConnection(radicaleLocalServerHTTP);
  let done = false;

  promise.then(function() {
    done = true;
  }, function(aError) {
    throw aError;
  });

   mc.waitFor(function() done, "Timed out waiting for promise to resolve.");
}