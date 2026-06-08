<template>
  <div class="p5r-root">
    <!-- Start Page -->
    <div v-if="view === 'start'" class="start-page">
      <div class="start-bg-pattern"></div>
      <div class="bg-text top">PERSONA5</div>
      <div class="bg-text bottom">ROYALE</div>
      <div class="start-content">
        <h1 class="start-title">PERSONA 5</h1>
        <p class="start-subtitle">P H A N T O M &nbsp; T H I E V E S</p>
        <div class="start-buttons">
          <button class="start-btn" @click="newGame" :disabled="loading">NEW GAME</button>
          <button class="start-btn" @click="continueGame" :disabled="loading">CONTINUE</button>
        </div>
      </div>
    </div>

    <!-- Character Creation Page -->
    <div v-else-if="view === 'create'" class="create-page">
      <div class="chains-bg"></div>
      <div class="contract-card">
        <h2 class="contract-title">缔 结 契 约</h2>
        <div class="form-group">
          <label class="form-label">姓名</label>
          <input class="form-input" v-model="formData.name" placeholder="输入你的名字" />
          <div class="error-msg" v-if="errors.name">请输入姓名</div>
        </div>
        <div class="form-group">
          <label class="form-label">性别</label>
          <div class="gender-group">
            <label class="gender-label"><input type="radio" v-model="formData.gender" value="男" /> 男</label>
            <label class="gender-label"><input type="radio" v-model="formData.gender" value="女" /> 女</label>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">身份</label>
          <input class="form-input" v-model="formData.identity" placeholder="如：高中生、转校生" />
        </div>
        <div class="form-group">
          <label class="form-label">初始代号（面具名）</label>
          <input class="form-input" v-model="formData.codename" placeholder="如：Joker" />
        </div>
        <div class="form-group">
          <label class="form-label">外貌特征（选填）</label>
          <input class="form-input" v-model="formData.appearance" placeholder="简单的文字描述" />
        </div>
        <div class="form-group">
          <label class="form-label">性格倾向（选填）</label>
          <input class="form-input" v-model="formData.personality" placeholder="如：冷静、热血" />
        </div>
        <button class="contract-btn" @click="submitContract" :disabled="submitting">
          {{ submitting ? '缔结中...' : '缔 结 契 约' }}
        </button>
      </div>
    </div>

    <!-- Game Page (Main) -->
    <div v-else-if="view === 'game'" class="game-page">
      <!-- Background -->
      <div class="background-layer"></div>
      <div class="bg-text top">PERSONA</div>
      <div class="bg-text bottom">ROYALE</div>

      <!-- HUD -->
      <div class="hud-panel">
        <div class="hud-item time">
          <span class="date"><i class="fas fa-calendar-alt"></i> {{ hud.date }}</span>
          <span class="weather"><i class="fas fa-cloud-sun"></i> {{ hud.weather }}</span>
        </div>
        <div class="hud-item location">
          <i class="fas fa-map-marker-alt"></i> {{ hud.location }}
        </div>
      </div>

      <!-- Nav Sidebar -->
      <nav>
        <button class="nav-btn" @click="toggleModal('map')"><i class="fas fa-map"></i> <span>地图</span></button>
        <button class="nav-btn" @click="toggleModal('coop')"><i class="fas fa-users"></i> <span>社群</span></button>
        <button class="nav-btn" @click="toggleModal('items')"><i class="fas fa-briefcase"></i> <span>物品</span></button>
        <button class="nav-btn" @click="toggleChronicle"><i class="fas fa-book"></i> <span>编年史</span></button>
        <button class="nav-btn" @click="toggleModal('status')"><i class="fas fa-heart"></i> <span>状态</span></button>
      </nav>

      <!-- Main Chat Area -->
      <div class="chat-interface">
        <div class="chat-header">
          <h1>PHANTOM THIEVES</h1>
        </div>
        <div class="chat-log" ref="chatLog">
          <div v-for="(msg, i) in messages" :key="i" :class="['message', msg.role]">
            <div class="msg-name">{{ msg.role === 'player' ? 'You' : 'System' }}</div>
            <div v-html="msg.html"></div>
          </div>
        </div>
        <div class="gen-indicator" :class="{ active: isLoading }">⏳ 生成中...</div>
        <div class="options-area" v-if="currentOptions.length > 0" style="display:flex">
          <button v-for="opt in currentOptions" :key="opt.id" class="option-btn" :class="{ 'sp-low': opt.text.includes('(SP不足)') }" :disabled="opt.text.includes('(SP不足)') || isLoading" @click="selectOption(opt)">
            <span v-if="optLabel(opt)" class="opt-badge" :class="optBadgeClass(opt)">{{ optLabel(opt) }}</span>
            {{ opt.text }}
          </button>
        </div>
        <div class="chat-input-area">
          <input type="text" v-model="inputText" @keydown.enter="sendAction" placeholder="输入指令..." class="chat-input" />
          <button class="send-btn" @click="sendAction" :disabled="isLoading">▶</button>
        </div>
      </div>

      <!-- Battle Overlay -->
      <div class="battle-overlay" :class="{ active: battleVisible }" @click.self="battleVisible = false">
        <div class="battle-panel">
          <h3>{{ battleTitle }}</h3>
          <div v-html="battleHtml"></div>
          <button class="battle-close" @click="battleVisible = false">关闭</button>
        </div>
      </div>

      <!-- Chronicle Panel -->
      <button class="chron-btn" @click="chronVisible = !chronVisible"><i class="fas fa-book"></i> 编年史</button>
      <div class="chron-panel" :class="{ open: chronVisible }">
        <h3>编年史</h3>
        <div v-for="(e, i) in chronicleEntries" :key="i" class="chron-entry">
          <span class="chron-date">{{ e.date }}</span> {{ e.text }}
        </div>
        <div v-if="chronicleEntries.length === 0" style="color:#666">暂无记录</div>
      </div>

      <!-- Modals -->
      <div class="modal-overlay" :class="{ active: modalState.map }" @click.self="modalState.map = false">
        <div class="modal-content">
          <div class="modal-header"><h2>MAP</h2><button class="close-btn" @click="modalState.map = false">×</button></div>
          <div class="modal-body no-padding"><div v-html="mapHtml"></div></div>
        </div>
      </div>
      <div class="modal-overlay" :class="{ active: modalState.coop }" @click.self="modalState.coop = false">
        <div class="modal-content">
          <div class="modal-header"><h2>COOP</h2><button class="close-btn" @click="modalState.coop = false">×</button></div>
          <div class="modal-body"><div class="coop-grid" v-html="coopHtml"></div></div>
        </div>
      </div>
      <div class="modal-overlay" :class="{ active: modalState.items }" @click.self="modalState.items = false">
        <div class="modal-content">
          <div class="modal-header"><h2>ITEMS</h2><button class="close-btn" @click="modalState.items = false">×</button></div>
          <div class="modal-body"><div class="inv-grid" v-html="itemsHtml"></div></div>
        </div>
      </div>
      <div class="modal-overlay" :class="{ active: modalState.status }" @click.self="modalState.status = false">
        <div class="modal-content">
          <div class="modal-header"><h2>STATUS</h2><button class="close-btn" @click="modalState.status = false">×</button></div>
          <div class="modal-body" v-html="statusHtml"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, watch } from 'vue';
import { useDataStore } from './store';
import { P5RParser } from './parser';
import {
  renderOverview,
  renderAction,
  renderAllout,
  renderResult,
  renderGeneric,
  renderAffinityTag,
  renderStatusTags,
  escHtml,
} from './battleRenderer';

const store = useDataStore();

const view = ref<'start' | 'create' | 'game'>('start');
const loading = ref(false);
const submitting = ref(false);
const isLoading = ref(false);

const formData = reactive({
  name: '', gender: '男', identity: '', codename: 'Joker', appearance: '', personality: '',
});
const errors = reactive({ name: false });

const messages = ref<{ role: string; html: string }[]>([]);
const inputText = ref('');
const currentOptions = ref<{ id: string; type: string; text: string; skill: string; item: string }[]>([]);
const chronicleEntries = ref<{ date: string; text: string }[]>([]);
const battleVisible = ref(false);
const battleTitle = ref('战斗面板');
const battleHtml = ref('');
const chronVisible = ref(false);
const modalState = reactive({ map: false, coop: false, items: false, status: false });
const chatLog = ref<HTMLElement | null>(null);

const hud = reactive({ date: '--', weather: '--', location: '--', phase: '--', hp: '--/--', sp: '--/--' });
const mapHtml = ref('<p style="color:#888;text-align:center;padding:2rem">地图数据加载中...</p>');
const coopHtml = ref('<p style="color:#888;text-align:center;padding:2rem">社群数据加载中...</p>');
const itemsHtml = ref('<p style="color:#888;text-align:center;padding:2rem">物品数据加载中...</p>');
const statusHtml = ref('');

watch(
  () => store.data,
  (data) => {
    if (!data) return;
    const d = data as any;
    if (d.时间系统) {
      hud.date = d.时间系统.日期 || '--';
      hud.weather = d.时间系统.天气 || d.时间系统.时段 || '--';
    }
    if (d.主角信息) {
      hud.hp = `${d.主角信息.当前HP ?? '--'}/${d.主角信息.HP上限 ?? '--'}`;
      hud.sp = `${d.主角信息.当前SP ?? '--'}/${d.主角信息.SP上限 ?? '--'}`;
    }
  },
  { deep: true },
);

function newGame() {
  loading.value = true;
  view.value = 'create';
  loading.value = false;
}

async function continueGame() {
  loading.value = true;
  view.value = 'game';
  loading.value = false;
}

async function submitContract() {
  if (!formData.name.trim()) { errors.name = true; return; }
  errors.name = false;
  submitting.value = true;
  try {
    const patchOps = [
      { op: 'replace', path: '/主角信息/姓名', value: formData.name },
      { op: 'replace', path: '/主角信息/性别', value: formData.gender },
      { op: 'replace', path: '/主角信息/身份', value: formData.identity || '转校生' },
      { op: 'replace', path: '/主角信息/面具', value: formData.codename || 'Joker' },
    ];
    if (formData.appearance) patchOps.push({ op: 'replace', path: '/主角信息/外貌', value: formData.appearance });
    if (formData.personality) patchOps.push({ op: 'replace', path: '/主角信息/性格', value: formData.personality });

    const timeDefaults = {
      '序章': { 日期: '2015年04月09日-星期四', 时段: '白天', 当前阶段: '序章' },
    };
    const tn = timeDefaults['序章'];
    patchOps.push({ op: 'replace', path: '/时间系统/日期', value: tn.日期 });
    patchOps.push({ op: 'replace', path: '/时间系统/时段', value: tn.时段 });
    patchOps.push({ op: 'replace', path: '/剧情进度/当前阶段', value: tn.当前阶段 });

    const tag = '<UpdateVariable>\n<Analysis>角色创建</Analysis>\n<JSONPatch>\n' + JSON.stringify(patchOps, null, 2) + '\n</JSONPatch>\n</UpdateVariable>';
    if (typeof Mvu !== 'undefined') {
      const oldData = Mvu.getMvuData({ type: 'message', message_id: currentMsgId() }) || {};
      const result = await Mvu.parseMessage(tag, oldData);
      if (result) await Mvu.replaceMvuData(result, { type: 'message', message_id: 'latest' });
    }
    view.value = 'game';
  } catch (e) {
    console.error('[P5R] 角色创建失败:', e);
  } finally {
    submitting.value = false;
  }
}

function currentMsgId() {
  if (typeof getCurrentMessageId === 'function') return getCurrentMessageId();
  if (typeof SillyTavern !== 'undefined' && SillyTavern.chat) return SillyTavern.chat.length - 1;
  return 0;
}

function selectOption(opt: any) {
  if (isLoading.value) return;
  const prefix = opt.type ? `[选择: ${opt.id}] ` : '';
  doAction(prefix + opt.text);
}

function sendAction() {
  const txt = inputText.value.trim();
  if (!txt || isLoading.value) return;
  inputText.value = '';
  doAction(txt);
}

async function doAction(text: string) {
  isLoading.value = true;
  currentOptions.value = [];
  messages.value.push({ role: 'player', html: escHtml(text) });
  await nextTick();
  scrollChatToBottom();

  try {
    let aiResponse = '';
    if (typeof SillyTavern !== 'undefined' && typeof SillyTavern.sendUserMessage === 'function') {
      const msgId = await SillyTavern.sendUserMessage(text);
      await waitUntil(() => { const chat = SillyTavern.chat || []; return chat.length > 0 && chat[chat.length - 1].mes && !chat[chat.length - 1].is_user; }, { timeout: 120000, interval: 1000 });
      const chat = SillyTavern.chat || [];
      const lastMsg = chat[chat.length - 1];
      aiResponse = lastMsg ? lastMsg.mes : '';
    } else if (typeof doAction === 'function') {
      aiResponse = await doAction(text);
    } else {
      setTimeout(() => { isLoading.value = false; }, 2000);
      return;
    }

    const parsed = P5RParser.parseMessage(aiResponse);
    if (parsed.content) {
      messages.value.push({ role: 'system', html: parsed.content });
    }
    if (parsed.options && parsed.options.length > 0) {
      currentOptions.value = parsed.options;
    }
    if (parsed.battlePanels && parsed.battlePanels.length > 0) {
      showBattle(parsed.battlePanels);
    }
    if (parsed.summary) {
      chronicleEntries.value.push({ date: hud.date, text: parsed.summary });
    }
    if (parsed.updateVariable) {
      await applyParsedUpdate(parsed.updateVariable);
    }
    await nextTick();
    scrollChatToBottom();
  } catch (e) {
    console.error('[P5R] 交互失败:', e);
    messages.value.push({ role: 'system', html: '<em style="color:#f44">处理失败，请重试</em>' });
  } finally {
    isLoading.value = false;
  }
}

async function applyParsedUpdate(updateVar: any) {
  if (!updateVar) return;
  try {
    if (typeof waitGlobalInitialized === 'function') await waitGlobalInitialized('Mvu');
    if ((updateVar.type === 'jsonPatch' || updateVar.type === 'raw') && typeof Mvu !== 'undefined') {
      const oldData = Mvu.getMvuData({ type: 'message', message_id: currentMsgId() }) || {};
      const fullTag = '<UpdateVariable>' + updateVar.raw + '</UpdateVariable>';
      const result = await Mvu.parseMessage(fullTag, oldData);
      if (result) await Mvu.replaceMvuData(result, { type: 'message', message_id: currentMsgId() });
    }
  } catch (e) { console.warn('[P5R] 变量更新处理失败:', e); }
}

function showBattle(panels: any[]) {
  if (!panels || panels.length === 0) return;
  const panel = panels[panels.length - 1];
  const titles: Record<string, string> = { overview: '战况总览', action: '行动结算', allout: '总攻击', result: '战斗结算', unknown: '战斗信息' };
  battleTitle.value = titles[panel.type] || '战斗信息';
  if (panel.type === 'overview') battleHtml.value = renderOverview(panel.body);
  else if (panel.type === 'action') battleHtml.value = renderAction(panel.body);
  else if (panel.type === 'allout') battleHtml.value = renderAllout(panel.body);
  else if (panel.type === 'result') battleHtml.value = renderResult(panel.body);
  else battleHtml.value = renderGeneric(panel.body);
  battleVisible.value = true;
}

function toggleModal(name: keyof typeof modalState) { modalState[name] = !modalState[name]; }
function toggleChronicle() { chronVisible.value = !chronVisible.value; }
function scrollChatToBottom() { nextTick(() => { if (chatLog.value) chatLog.value.scrollTop = chatLog.value.scrollHeight; }); }

const optLabelMap: Record<string, string> = { attack: '攻击', skill: '技能', defend: '防御', item: '道具', '1more': '1MORE', allout: '总攻', analyze: '分析', flee: '逃跑', negotiate: '交涉', normal: '' };
const optBadgeMap: Record<string, string> = { attack: 'atk', skill: 'skill', defend: 'defend', item: 'item', '1more': 'one-more', allout: 'all-out', analyze: 'neg', flee: 'flee', negotiate: 'neg', normal: 'neg' };
function optLabel(opt: any) { return optLabelMap[opt.type] || ''; }
function optBadgeClass(opt: any) { return optBadgeMap[opt.type] || 'neg'; }
function escHtml(s: string) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
</script>