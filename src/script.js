/*!
 * Stopwatch is a simple Chrome application to keep the time
 *
 * Created on November 2, 2013
 * Licensed under the MIT license
 * Copyright (c) 2013-2017 Mohsen Khahani
 * http://mohsenkhahani.ir/stopwatch
 */

(() => {
  const qs = document.querySelector.bind(document);

  let $timer;
  let $btnStart;
  let $btnReset;
  let $btnClose;
  let $hour;
  let $minute;
  let $second;
  let timeInterval;
  let blinkInterval;
  let time = {
    hour: 0,
    minute: 0,
    second: 0,
  };

  window.resizeTo(170, 60);

  /**
   * Initiates application
   */
  document.addEventListener('DOMContentLoaded', () => {
    $timer = qs('.timer');
    $btnStart = qs('#btn_start');
    $btnReset = qs('#btn_reset');
    $btnClose = qs('#btn_close');
    $btnStart.addEventListener('click', toggleStart);
    $btnReset.addEventListener('click', reset);
    $btnClose.addEventListener('click', closeApp);

    $hour = qs('#hour');
    $minute = qs('#minute');
    $second = qs('#second');
    $hour.addEventListener('dblclick', edit);
    $minute.addEventListener('dblclick', edit);
    $second.addEventListener('dblclick', edit);
    $hour.addEventListener('blur', update);
    $minute.addEventListener('blur', update);
    $second.addEventListener('blur', update);
    $hour.addEventListener('keydown', filterKeys);
    $minute.addEventListener('keydown', filterKeys);
    $second.addEventListener('keydown', filterKeys);

    load();
  });

  /**
   * Starts/Stops the timer
   */
  function toggleStart() {
    if (timeInterval) {
      stop(true);
    } else {
      start();
    }
  }

  /**
   * Starts the timer
   */
  function start() {
    toggleBlink(false);
    $btnStart.innerHTML = 'Stop';
    timeInterval = setInterval(count, 1000);
  }

  /**
   * Stops the timer
   */
  function stop(withBlinking) {
    if (withBlinking) {
      toggleBlink(true);
    }
    clearTimeout(timeInterval);
    timeInterval = undefined;
    $btnStart.innerHTML = 'Start';
    save();
  }

  /**
   * Sets timer to zero
   */
  function reset() {
    toggleBlink(false);
    time.hour = 0;
    time.minute = 0;
    time.second = 0;
    display();
    save();
  }

  /**
   * Enables timer to be edited inline
   */
  function edit(event) {
    const $el = event.target;
    $el.contentEditable = true;
    const range = document.createRange();
    range.selectNodeContents($el);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    stop(false);
  }

  /**
   * Updates timer to the user input time
   */
  function update(event) {
    const $el = event.target;
    const num = parseInt($el.innerHTML, 10);
    if (Number.isNaN(num) || (num > 59 && ($el.id === 'minute' || $el.id === 'second'))) {
      return;
    }
    time[$el.id] = parseInt($el.innerHTML, 10);
    $el.contentEditable = false;
    $el.className = '';
    display();
  }

  /**
   * Prevents non number inputs by user to be entered as time
   */
  function filterKeys(event) {
    const key = event.keyCode;
    if (key !== 8 && key !== 46 &&
      (key < 37 || key > 40) &&
      (key < 48 || key > 57) &&
      (key < 96 || key > 105)) {
      event.preventDefault();
    }
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
    $hour.innerHTML = (time.hour > 9) ? time.hour : `0${time.hour}`;
    $minute.innerHTML = (time.minute > 9) ? time.minute : `0${time.minute}`;
    $second.innerHTML = (time.second > 9) ? time.second : `0${time.second}`;
    document.title = `${$hour.innerHTML}:${$minute.innerHTML}:${$second.innerHTML}`;
  }

  /**
   * Starts/Stops blinking
   */
  function toggleBlink(startBlinking) {
    if (startBlinking) {
      $timer.className = 'timer blinking';
      blinkInterval = setInterval(blink, 1000);
    } else {
      $timer.className = 'timer';
      clearTimeout(blinkInterval);
    }
  }

  /**
   * Set window title to blink
   */
  function blink() {
    document.title = (document.title !== '') ? '' :
      `${$hour.innerHTML}:${$minute.innerHTML}:${$second.innerHTML}`;
  }

  /**
   * Stores current time
   */
  function save() {
    chrome.storage.local.set({ time });
  }

  /**
   * Loads current time
   */
  function load() {
    chrome.storage.local.get('time', (res) => {
      if (res.time !== undefined) {
        time = res.time;
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
})();
