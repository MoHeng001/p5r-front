import { waitUntil } from 'async-wait-until';
import App from './App.vue';
import './global.css';

export { P5RParser } from './parser';

$(() => {
  document.title = 'P5R | 心之怪盗团';
});

(async () => {
  await waitGlobalInitialized('Mvu');
  await waitUntil(() => _.has(getVariables({ type: 'message' }), 'stat_data'));
  createApp(App).use(createPinia()).mount('#app');
})();