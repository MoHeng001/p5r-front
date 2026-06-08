import App from './App.vue';
import './global.css';

export { P5RParser } from './parser';

$(() => {
  document.title = 'P5R | 心之怪盗团';
});

(async () => {
  try {
    if (typeof waitGlobalInitialized === 'function') {
      await waitGlobalInitialized('Mvu');
    }
  } catch (e) {
    console.warn('[P5R] Mvu init timeout, proceeding anyway:', e);
  }
  createApp(App).use(createPinia()).mount('#app');
})();