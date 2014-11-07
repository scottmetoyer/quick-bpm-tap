/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Member variables
    lastUpdate: 0,
    bpm: 0,
    history: [],
    pressTimer: null,

    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("pointerdown", this.onPointerDown, false);
        document.addEventListener("pointerup", this.onPointerUp, false);
    },

    reset: function () {
        app.lastUpdate = 0;
        app.bpm = 0;
        app.history = [];
        app.updateLabels(app.bpm);
    },

    updateLabels: function (bpm) {
        var bpm4 = document.getElementById('bpm-4');
        var bpm8 = document.getElementById('bpm-8');
        var bpm16 = document.getElementById('bpm-16');
        var bpm32 = document.getElementById('bpm-32');
        var bpm64 = document.getElementById('bpm-64');

        if (bpm == 0) {
            bpm16.innerText = "TAP";
            bpm4.innerText = 0;
            bpm8.innerText = 0;
            bpm32.innerText = 0;
            bpm64.innerText = 0;
        } else {
            bpm16.innerText = bpm.toFixed(1);
            bpm4.innerText = (bpm / 4).toFixed(1);
            bpm8.innerText = (bpm / 2).toFixed(1);
            bpm32.innerText = (bpm * 2).toFixed(1);
            bpm64.innerText = (bpm * 4).toFixed(1);
        }
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        navigator.notification.alert('Welcome to Quick BPM Tap', function () { }, 'Quick BPM Tap', 'OK');
    },

    onPointerUp: function (evt) {
        clearTimeout(app.pressTimer);
    },

    onPointerDown: function (evt) {
        // Animate the tap pulse
        document.body.className = '';
        var labels = document.getElementsByClassName('label');

        for (var i = 0; i < labels.length; i++) {
            labels[i].className = 'label';
        }

        setTimeout(function () {
            document.body.className = 'pulse';

            for (var i = 0; i < labels.length; i++) {
                labels[i].className = 'label pulse';
            }
        }, 5);

        var tap = Date.now();

        if (app.lastUpdate > 0) {
            length = tap - app.lastUpdate;

            // Reset if's been more than 5 seconds since a tap
            if (length > 5000) {
                app.reset();
            }

            // Convert length to a BPM value
            var bpm = ((60 / length) * 1000);
            app.history.push(bpm);

            // Average the bpm
            var average = 0;
            for (var i = 0; i < app.history.length; i++) {
                average += app.history[i];
            }

            app.bpm = average / app.history.length;
        }

        // Set the two second longpress trigger
        app.pressTimer = window.setTimeout(function () {
            app.reset();
        }, 2000);

        app.updateLabels(app.bpm);
        app.lastUpdate = tap;
    }
};
