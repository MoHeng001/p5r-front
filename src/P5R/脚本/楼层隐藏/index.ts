$(() => {
  'use strict';

  function hideOldFloors() {
    const messages = document.querySelectorAll('#chat > .mes');
    if (messages.length <= 1) return;
    for (let i = 0; i < messages.length - 1; i++) {
      if (!messages[i].classList.contains('p5r-hidden')) {
        messages[i].classList.add('p5r-hidden');
        messages[i].style.display = 'none';
      }
    }
  }

  const style = document.createElement('style');
  style.textContent = '.p5r-hidden { display: none !important; }';
  document.head.appendChild(style);

  hideOldFloors();

  const observer = new MutationObserver(() => {
    clearTimeout(observer._timer);
    observer._timer = setTimeout(hideOldFloors, 200);
  });
  const chatContainer = document.querySelector('#chat');
  if (chatContainer) {
    observer.observe(chatContainer, { childList: true, subtree: true });
  }

  if (typeof eventOn === 'function' && typeof tavern_events !== 'undefined') {
    if (tavern_events.MESSAGE_RECEIVED) {
      eventOn(tavern_events.MESSAGE_RECEIVED, () => {
        setTimeout(hideOldFloors, 300);
      });
    }
    if (tavern_events.MESSAGE_SENT) {
      eventOn(tavern_events.MESSAGE_SENT, () => {
        setTimeout(hideOldFloors, 300);
      });
    }
  }
});