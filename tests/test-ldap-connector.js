/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const MODULE_NAME = 'test-ldap-connector';
const RELATIVE_ROOT = '../shared-modules';
const MODULE_REQUIRES = ['folder-display-helpers'];

Cu.import("resource://ensemble/connectors/LDAPConnector.jsm");
Cu.import("resource://ensemble/connectors/MemoryRecordCache.jsm");
Cu.import("resource://gre/modules/Task.jsm");
Cu.import('resource://mozmill/stdlib/httpd.js');

const Cr = Components.results;

function MockListener() {}

MockListener.prototype = {
  onImport: function(aRecord) {
  },

  onAdded: function(aRecord) {
  },

  onChanged: function(aId, aDiff) {
  },

  onRemoved: function(aId) {
  },
}

function setupModule(module) {
  collector.getModule("folder-display-helpers").installInto(module);
}

function wait_for_promise_resolved(promise) {
  let done = false;

  Task.spawn(function() {
    yield promise.then(function() {
    }, function(aError) {
      throw aError;
    });
  });

  mc.waitFor(function() done, "Timed out waiting for promise to resolve.");
}

function test_server_connection_success() {
  let aCache = new MemoryRecordCache();
  let aListener = new MockListener();
  let connector = new LDAPConnector(null, aListener, aCache);

  let promise = connector.testConnection();
  wait_for_promise_resolved(promise);
}

// function test_init_records() {
//   let aCache = new MemoryRecordCache();
//   let aListener = new MockListener();
//   let connector = new LDAPConnector(null, aListener, aCache);

//   let promise = connector.init();
//   wait_for_promise_resolved(promise);
// }

// function test_read_records() {
//   let aCache = new MemoryRecordCache();
//   let aListener = new MockListener();
//   let connector = new LDAPConnector(null, aListener, aCache);

//   let promise = connector.read();
//   wait_for_promise_resolved(promise);
// }

// function test_poll_records() {
//   let aCache = new MemoryRecordCache();
//   let aListener = new MockListener();
//   let connector = new CardDAVConnector(null, aListener, aCache);

//   let promiseInit = connector.init();
//   wait_for_promise_resolved(promiseInit);

//   let promise = connector.poll();
//   wait_for_promise_resolved(promise);
// }