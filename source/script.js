/**
 * Stopwatch is a simple Chrome application to keep the time
 *
 * Created on November 2, 2013
 * Licensed under the MIT license
 * Copyright (c) 2013 Mohsen Khahani
 * http://mohsenkhahani.ir/stopwatch
 */

var btnStart, btnReset, btnClose,
    hPart, mPart, sPart, timer, blinker,
    paused = true,
    time = {
        hour: 0,
        minute: 0,
        second: 0
    };
window.resizeTo(170, 60);

/**
 * Initiates application
 */
document.addEventListener('DOMContentLoaded', function () {
    btnStart = document.querySelector('#btn_start');
    btnReset = document.querySelector('#btn_reset');
    btnClose = document.querySelector('#btn_close');
    hPart = document.querySelector('#hour');
    mPart = document.querySelector('#minute');
    sPart = document.querySelector('#second');
    btnStart.addEventListener('click', start);
    btnReset.addEventListener('click', reset);
    btnClose.addEventListener('click', closeApp);
    load();
})

/**
 * Starts/Stops timer
 */
function start() {
    if (timer) {
        clearTimeout(timer);
        timer = undefined;
        btnStart.innerHTML = 'Start';
        document.querySelector('.timer').className = 'timer blinking';
        blinker = setInterval(blink, 1000);
        save();
    } else {
        clearTimeout(blinker);
        timer = setInterval(count, 1000);
        btnStart.innerHTML = 'Stop';
        document.querySelector('.timer').className = 'timer';
    }
}

/**
 * Sets timer to zero
 */
function reset() {
    document.querySelector('.timer').className = 'timer';
    clearTimeout(blinker);
    blinker = null;
    time.hour = 0;
    time.minute = 0;
    time.second = 0;
    display();
    save();
}

/**
 * Calculates the time
 */
function count() {
    time.second++;
    if (time.second === 60) {
        time.second = 0;
        time.minute++;
        if (time.minute === 60) {
            time.minute = 0;
            time.hour++;
        }
        save();
    }
    display();
}

/**
 * Displays formatted time
 */
function display() {
    hPart.innerHTML = (time.hour > 9)? time.hour : '0' + time.hour;
    mPart.innerHTML = (time.minute > 9)? time.minute : '0' + time.minute;
    sPart.innerHTML = (time.second > 9)? time.second : '0' + time.second;
    document.title = hPart.innerHTML + ':' + mPart.innerHTML + ':' + sPart.innerHTML;
}

/**
 * Set window title to blink
 */
function blink() {
    document.title = (document.title !== '')? '' :
        hPart.innerHTML + ':' + mPart.innerHTML + ':' + sPart.innerHTML;
}

/**
 * Stores current time
 */
function save() {
    chrome.storage.local.set({'stopwatch_time':time});
}

/**
 * Loads current time
 */
function load() {
    chrome.storage.local.get('stopwatch_time', function (res) {
        if (res.stopwatch_time !== undefined) {
            time = res.stopwatch_time;
            display();
        }
    });
}

/**
 * Stores time and closes the window
 */
function closeApp() {
    save();
    window.close();
}
