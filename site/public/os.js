// SCV/OS window manager: drag, focus, close/restore, clamped to the desktop.
(function () {
  'use strict';

  var desktop = document.querySelector('.desktop');
  var tasks = document.querySelector('[data-tasks]');
  if (!desktop || !tasks) return;

  var z = 10;
  var wide = function () {
    return window.matchMedia('(min-width: 900px)').matches;
  };

  var wins = Array.prototype.slice.call(document.querySelectorAll('[data-drag]'));

  function focusWin(win) {
    wins.forEach(function (w) {
      w.classList.toggle('active', w === win);
    });
    win.style.zIndex = String(++z);
  }

  function clamp(v, lo, hi) {
    return Math.min(Math.max(v, lo), hi);
  }

  wins.forEach(function (win) {
    var title = win.getAttribute('data-title') || 'window';
    var bar = win.querySelector('.tbar') || win;

    // Taskbar button mirrors the window; click focuses or restores it.
    var btn = document.createElement('button');
    btn.className = 'task';
    btn.type = 'button';
    btn.textContent = title;
    btn.addEventListener('click', function () {
      if (win.style.display === 'none') {
        win.style.display = '';
        btn.classList.remove('min');
      }
      focusWin(win);
      if (!wide()) win.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    tasks.appendChild(btn);

    // × closes (minimizes to taskbar).
    var closer = win.querySelector('[data-close]');
    if (closer) {
      closer.addEventListener('click', function (e) {
        e.stopPropagation();
        win.style.display = 'none';
        btn.classList.add('min');
      });
    }

    win.addEventListener('pointerdown', function () {
      focusWin(win);
    });

    // Dragging (only meaningful when the desktop is absolute-positioned).
    bar.addEventListener('pointerdown', function (e) {
      if (!wide()) return;
      if (e.target.closest('a, button')) return;
      var rect = win.getBoundingClientRect();
      var host = desktop.getBoundingClientRect();
      var dx = e.clientX - rect.left;
      var dy = e.clientY - rect.top;

      function move(ev) {
        var x = clamp(ev.clientX - host.left - dx, 0, host.width - rect.width * 0.25);
        var y = clamp(ev.clientY - host.top - dy, 0, host.height - 40);
        win.style.setProperty('--x', x + 'px');
        win.style.setProperty('--y', y + 'px');
      }
      function up() {
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);
        bar.classList.remove('grabbing');
      }
      document.addEventListener('pointermove', move);
      document.addEventListener('pointerup', up);
      bar.classList.add('grabbing');
      e.preventDefault();
    });
  });

  // Crash dialog: End Task actually ends the task.
  document.querySelectorAll('[data-endtask]').forEach(function (b) {
    b.addEventListener('click', function () {
      var dlg = b.closest('[data-drag]');
      if (dlg) dlg.style.display = 'none';
      var btns = tasks.querySelectorAll('.task');
      btns.forEach(function (tb) {
        if (tb.textContent === 'SCOPE_CREEP.DLL') tb.remove();
      });
    });
  });

  // Clock ticks, because a stopped clock is a broken OS.
  var clock = document.querySelector('[data-clock]');
  if (clock) {
    var tick = function () {
      var d = new Date();
      var h = d.getHours() % 12 || 12;
      var m = String(d.getMinutes()).padStart(2, '0');
      clock.textContent = 'GEORGETOWN, TX — ' + h + ':' + m + (d.getHours() >= 12 ? ' PM' : ' AM');
    };
    tick();
    setInterval(tick, 30000);
  }
})();
