$(() => {
  'use strict';

  const GAME_HTML_URL =
    'https://testingcf.jsdelivr.net/gh/MoHeng001/p5r-front/dist/P5R/%E7%95%8C%E9%9D%A2/%E6%B8%B8%E6%88%8F%E7%95%8C%E9%9D%A2/index.html';

  let loaded = false;

  async function loadGameUI() {
    if (loaded) return;
    loaded = true;

    console.log('[P5R] 开始加载游戏界面...');

    try {
      const resp = await fetch(GAME_HTML_URL);
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const html = await resp.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      doc.querySelectorAll('head > style').forEach((s) => {
        if (!document.querySelector('style[data-p5r]')) {
          const ns = document.createElement('style');
          ns.setAttribute('data-p5r', '1');
          ns.textContent = s.textContent;
          document.head.appendChild(ns);
        }
      });

      doc.querySelectorAll('head > link[rel="stylesheet"]').forEach((l) => {
        if (!document.querySelector('link[href="' + l.getAttribute('href') + '"]')) {
          document.head.appendChild(document.importNode(l, true));
        }
      });

      const appContainer = doc.querySelector('#app');
      if (appContainer) {
        const existingApp = document.querySelector('#app');
        if (existingApp) {
          existingApp.innerHTML = appContainer.innerHTML;
        } else {
          const newApp = document.createElement('div');
          newApp.id = 'app';
          newApp.innerHTML = appContainer.innerHTML;
          document.body.appendChild(newApp);
        }
      }

      doc.querySelectorAll('head > script').forEach((s) => {
        const ns = document.createElement('script');
        if (s.src) {
          ns.src = s.src;
        } else {
          ns.textContent = s.textContent;
        }
        ns.setAttribute('data-p5r', '1');
        document.head.appendChild(ns);
      });

      console.log('[P5R] 游戏界面加载完成');
    } catch (e) {
      console.error('[P5R] 游戏界面加载失败:', e);
      document.body.innerHTML +=
        '<p style="color:red;text-align:center;padding:2rem;">P5R 游戏界面加载失败: ' +
        (e as Error).message +
        '</p>';
    }
  }

  const tryLoad = () => {
    if (typeof $ === 'undefined') {
      setTimeout(tryLoad, 100);
      return;
    }
    loadGameUI();
  };
  tryLoad();
});