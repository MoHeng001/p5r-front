<template>
  <div class="p5r-root">
    <!-- ============ START PAGE ============ -->
    <div v-if="view === 'start'" class="start-page">
      <div class="bg-halftone"></div>
      <div class="bg-marquee-container">
        <div class="marquee-track left">
          <span class="marquee-text">TAKE YOUR HEART TAKE YOUR HEART TAKE YOUR HEART TAKE YOUR HEART</span>
          <span class="marquee-text">TAKE YOUR HEART TAKE YOUR HEART TAKE YOUR HEART TAKE YOUR HEART</span>
        </div>
        <div class="marquee-track right">
          <span class="marquee-text">PERSONA 5 ROYAL PERSONA 5 ROYAL PERSONA 5 ROYAL PERSONA 5 ROYAL</span>
          <span class="marquee-text">PERSONA 5 ROYAL PERSONA 5 ROYAL PERSONA 5 ROYAL PERSONA 5 ROYAL</span>
        </div>
        <div class="marquee-track left">
          <span class="marquee-text">TAVERN ROLEPLAY TAVERN ROLEPLAY TAVERN ROLEPLAY TAVERN ROLEPLAY</span>
          <span class="marquee-text">TAVERN ROLEPLAY TAVERN ROLEPLAY TAVERN ROLEPLAY TAVERN ROLEPLAY</span>
        </div>
      </div>
      <div class="shard-container">
        <div class="shard shard-1"></div>
        <div class="shard shard-2"></div>
        <div class="shard shard-3"></div>
      </div>
      <div class="main-menu-container">
        <div class="game-title">
          <div class="title-sub">TAVERN ROLEPLAY</div>
          <div class="title-main">心之怪盗团</div>
          <i class="fa-solid fa-hat-wizard title-icon"></i>
        </div>
        <div class="menu-buttons">
          <button class="menu-btn btn-start" @click="startGame" :disabled="transitioning">
            <span>开始游戏</span>
            <span class="eng-text">NEW GAME</span>
            <i class="fa-solid fa-play"></i>
          </button>
          <button class="menu-btn btn-load" :class="{ dimmed: !hasSave }" @click="loadGame" :disabled="transitioning || !hasSave">
            <span>读取存档</span>
            <span class="eng-text">LOAD GAME</span>
            <i class="fa-solid fa-folder-open"></i>
          </button>
        </div>
      </div>
      <div class="footer-info">
        PHANTOM THIEVES OF HEARTS<br>
        <span>系统版本 Ver 1.0.0</span>
      </div>
      <div class="transition-overlay" :class="{ active: transitioning }">
        <div class="loading-text">NOW LOADING...</div>
      </div>
    </div>

    <!-- ============ CREATE PAGE ============ -->
    <div v-else-if="view === 'create'" class="create-page">
      <div class="bg-layer"></div>
      <div class="chains-bg"></div>
      <div class="bg-text top">I AM THOU THOU ART I</div>
      <div class="bg-text bottom">CONTRACT SIGNED</div>
      <div class="contract-container">
        <div class="contract-content">
          <div class="contract-header">
            <h1><i class="fa-solid fa-file-signature"></i> 命运契约</h1>
            <p>"你是否已做好觉悟，无论面临何种深渊，都将贯彻自身的正义？"</p>
          </div>
          <div class="mode-toggles">
            <button class="mode-btn" :class="{ active: createMode === 'joker' }" @click="switchMode('joker')">
              <i class="fa-solid fa-mask"></i> 扮演 Joker
            </button>
            <button class="mode-btn" :class="{ active: createMode === 'custom' }" @click="switchMode('custom')">
              <i class="fa-solid fa-user-pen"></i> 自定义档案
            </button>
          </div>

          <!-- Joker form -->
          <div v-if="createMode === 'joker'" class="form-section active">
            <div class="form-group full-width info-text" style="margin-top:1rem; text-align:center; color:#aaa;">
              <i class="fa-solid fa-info-circle"></i> 你将以"雨宫莲 / Joker"的身份展开行动。属性、面具与外貌将继承官方设定。
            </div>
            <div class="form-group full-width" style="margin-top:1rem;">
              <label class="form-label"><i class="fa-solid fa-hourglass-start"></i> 选择介入的时间节点</label>
              <select class="p5-select" v-model="jokerTimeNode">
                <option value="prologue">序章：赌场大脱逃 / 命运的开端</option>
                <option value="kamoshida">第一章：鸭志田殿堂 / 色欲之城 (4/11)</option>
                <option value="madarame">第二章：斑目殿堂 / 虚荣的美术馆 (5/16)</option>
                <option value="kaneshiro">第三章：金城殿堂 / 暴食的银行 (6/21)</option>
                <option value="futaba">第四章：双叶殿堂 / 愤怒的金字塔 (7/25)</option>
              </select>
            </div>
          </div>

          <!-- Custom form -->
          <div v-if="createMode === 'custom'" class="form-section active">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label"><i class="fa-solid fa-id-card"></i> 真实姓名 (Name)</label>
                <input type="text" class="p5-input" v-model="customName" placeholder="输入你的名字...">
              </div>
              <div class="form-group">
                <label class="form-label"><i class="fa-solid fa-user-secret"></i> 怪盗代号 (Code Name)</label>
                <input type="text" class="p5-input" v-model="customCodename" placeholder="如：Skull, Queen, Fox...">
              </div>
              <div class="form-group">
                <label class="form-label"><i class="fa-solid fa-venus-mars"></i> 性别 (Gender)</label>
                <div class="gender-options">
                  <label class="gender-label" :class="{ active: customGender === '男' }">
                    <input type="radio" v-model="customGender" value="男" style="display:none">
                    <span><i class="fa-solid fa-mars"></i> 男</span>
                  </label>
                  <label class="gender-label" :class="{ active: customGender === '女' }">
                    <input type="radio" v-model="customGender" value="女" style="display:none">
                    <span><i class="fa-solid fa-venus"></i> 女</span>
                  </label>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label"><i class="fa-solid fa-cards-blank"></i> 核心阿尔卡那 (Arcana)</label>
                <select class="p5-select" v-model="customArcana">
                  <option value="fool">愚者 (The Fool) - 无限的可能性</option>
                  <option value="magician">魔术师 (The Magician) - 创造与行动</option>
                  <option value="priestess">女教皇 (The Priestess) - 智慧与直觉</option>
                  <option value="emperor">皇帝 (The Emperor) - 支配与控制</option>
                  <option value="justice">正义 (Justice) - 公平与决断</option>
                  <option value="death">死神 (Death) - 终结与重生</option>
                  <option value="star">星星 (The Star) - 希望与指引</option>
                </select>
              </div>
              <div class="form-group full-width">
                <label class="form-label"><i class="fa-solid fa-ghost"></i> 觉醒的人格面具 (Initial Persona)</label>
                <input type="text" class="p5-input" v-model="customPersona" placeholder="赋予你面具的名字（如：亚森、基德船长、琼安...）">
              </div>
              <div class="form-group full-width">
                <label class="form-label"><i class="fa-solid fa-eye"></i> 外貌特征 (Appearance)</label>
                <textarea class="p5-input" v-model="customAppearance" placeholder="请描述身高、体重、发色、发型、瞳色、穿着风格等特征..."></textarea>
              </div>
              <div class="form-group full-width">
                <label class="form-label"><i class="fa-solid fa-brain"></i> 性格与行事风格 (Personality)</label>
                <textarea class="p5-input" v-model="customPersonality" placeholder="是冲动热血、还是冷静沉着？描述角色在日常与殿堂中的性格表现..."></textarea>
              </div>
              <div class="form-group full-width">
                <label class="form-label"><i class="fa-solid fa-hourglass-start"></i> 选择介入的时间节点</label>
                <select class="p5-select" v-model="customTimeNode">
                  <option value="prologue">第一天转校报道 / 故事起始</option>
                  <option value="midgame">怪盗团成立中途加入 / 涩谷街头相遇</option>
                </select>
              </div>
            </div>
          </div>

          <button class="btn-submit" @click="submitContract" :disabled="submitting">
            <template v-if="submitting"><i class="fa-solid fa-spinner fa-spin"></i> 正在签订契约...</template>
            <template v-else><i class="fa-solid fa-pen-nib"></i> 签订契约 (CONFIRM)</template>
          </button>
        </div>
      </div>
    </div>

    <!-- ============ GAME PAGE ============ -->
    <div v-else-if="view === 'game'" class="game-page">
      <div class="background-layer"></div>
      <div class="bg-text top">TAKE YOUR HEART</div>
      <div class="bg-text bottom">PERSONA 5 ROYAL</div>

      <div class="hud-panel">
        <div class="hud-item time">
          <i class="fa-solid fa-calendar-days"></i>
          <div class="date">{{ hud.date }}</div>
          <div class="weather"><i class="fa-solid fa-sun"></i> {{ hud.weather }}</div>
        </div>
        <div class="hud-item location">
          <i class="fa-solid fa-location-dot"></i>
          <span>{{ hud.location }}</span>
        </div>
      </div>

      <nav>
        <button class="nav-btn" @click="openModal('map')"><i class="fa-solid fa-map-location-dot"></i><span>快速旅行</span></button>
        <button class="nav-btn" @click="openModal('members')"><i class="fa-solid fa-users"></i><span>社群关系</span></button>
        <button class="nav-btn" @click="openModal('inventory')"><i class="fa-solid fa-box-open"></i><span>随身物品</span></button>
        <button class="nav-btn" @click="toggleChronicle"><i class="fa-solid fa-scroll"></i><span>编年史</span></button>
      </nav>

      <main class="chat-interface">
        <div class="chat-header">
          <h1><i class="fa-solid fa-comment-dots"></i> 精神同步频道</h1>
          <span class="sys-label">LOG_SYS_01</span>
        </div>
        <div class="chat-log" ref="chatLog">
          <div v-for="(msg, i) in messages" :key="i" :class="['message', msg.role]">
            <div class="msg-name">{{ msg.role === 'player' ? 'Joker' : 'Game Master' }}</div>
            <div v-html="msg.html"></div>
          </div>
        </div>
        <div class="options-area" v-if="currentOptions.length > 0">
          <button v-for="opt in currentOptions" :key="opt.id" class="option-btn" :class="{ 'sp-low': opt.text.includes('(SP不足)') }" :disabled="opt.text.includes('(SP不足)') || isLoading" @click="selectOption(opt)">
            <span v-if="optLabel(opt)" class="opt-badge" :class="optBadgeClass(opt)">{{ optLabel(opt) }}</span>
            {{ opt.text }}
          </button>
        </div>
        <div class="gen-indicator" :class="{ active: isLoading }">⟳ AI 正在生成...</div>
        <div class="chat-input-area">
          <input type="text" v-model="inputText" @keydown.enter="sendAction" placeholder="输入行动指令... (按回车发送)" />
          <button class="send-btn" @click="sendAction" :disabled="isLoading"><i class="fa-solid fa-paper-plane"></i></button>
        </div>
      </main>

      <!-- ===== Battle Overlay ===== -->
      <div class="battle-overlay" :class="{ active: battleVisible }">
        <div class="battle-panel">
          <h3>{{ battleTitle }}</h3>
          <div v-html="battleHtml"></div>
          <button class="battle-close" @click="battleVisible = false">关闭</button>
        </div>
      </div>

      <!-- ===== Chronicle ===== -->
      <button class="chron-btn" @click="chronVisible = !chronVisible"><i class="fa-solid fa-scroll"></i> 编年史</button>
      <div class="chron-panel" :class="{ open: chronVisible }">
        <h3><i class="fa-solid fa-scroll"></i> 编年史</h3>
        <div v-for="(e, i) in chronicleEntries" :key="i" class="chron-entry">
          <span v-if="e.date" class="chron-date">{{ e.date }}</span>{{ e.text }}
        </div>
        <div v-if="chronicleEntries.length === 0" style="color:#555;">暂无记录</div>
      </div>

      <!-- ===== COOP Modal ===== -->
      <div class="modal-overlay" :class="{ active: modalState.members }" @click.self="modalState.members = false">
        <div class="modal-content">
          <div class="modal-header">
            <h2>社群关系 / CONFIDANT</h2>
            <button class="close-btn" @click="modalState.members = false"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body">
            <div class="coop-grid" v-html="coopHtml"></div>
          </div>
        </div>
      </div>

      <!-- ===== Items Modal ===== -->
      <div class="modal-overlay" :class="{ active: modalState.inventory }" @click.self="modalState.inventory = false">
        <div class="modal-content">
          <div class="modal-header">
            <h2>随身物品 / ITEM</h2>
            <button class="close-btn" @click="modalState.inventory = false"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body">
            <div class="inventory-grid" v-html="itemsHtml"></div>
          </div>
        </div>
      </div>

      <!-- ===== Map Modal ===== -->
      <div class="modal-overlay" :class="{ active: modalState.map }" @click.self="closeMapModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>快速旅行 / TOKYO MAP</h2>
            <button class="close-btn" @click="closeMapModal"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body no-padding">
            <div class="map-layout">
              <div class="map-viewport" ref="mapViewport"
                @pointerdown="onMapPointerDown" @pointermove="onMapPointerMove" @pointerup="onMapPointerUp"
                @wheel.prevent="onMapWheel">
                <div class="map-canvas" ref="mapCanvas" :style="mapCanvasTransform">
                  <div class="map-dark-shapes"></div>
                  <svg class="map-transit-lines" viewBox="0 0 2200 1400" preserveAspectRatio="none">
                    <path d="M 600 650 L 650 320 L 850 200 L 1400 200 L 1600 300 L 1650 480 L 1600 650 L 950 900 Z" fill="none" stroke="#A5D80A" stroke-width="15" stroke-linejoin="round"/>
                    <path d="M 150 300 L 350 250 L 480 280 L 650 320 L 900 350 L 1300 300 L 1600 300" fill="none" stroke="#F39800" stroke-width="12" stroke-linejoin="round"/>
                    <path d="M 950 900 L 850 1100" fill="none" stroke="#00A0E9" stroke-width="14" stroke-linejoin="round"/>
                    <path d="M 650 320 L 900 550 L 1100 600 L 1150 750 L 1600 650 L 1850 750" fill="none" stroke="#E4007F" stroke-width="12" stroke-linejoin="round"/>
                    <path d="M 120 500 L 150 300 L 600 650 L 1600 650 L 1950 500" fill="none" stroke="#FFF100" stroke-width="12" stroke-linejoin="round"/>
                    <path d="M 250 750 L 600 650 L 1150 750 L 950 900 L 1650 1050" fill="none" stroke="#66CCCC" stroke-width="12" stroke-linejoin="round"/>
                    <path d="M 150 1050 L 600 650 L 900 550 L 1100 450 L 1350 450 L 1650 480 L 1800 150" fill="none" stroke="#1A1A1A" stroke-width="16" stroke-linejoin="round"/>
                    <path d="M 150 1050 L 600 650 L 900 550 L 1100 450 L 1350 450 L 1650 480 L 1800 150" fill="none" stroke="#E60012" stroke-width="10" stroke-linejoin="round"/>
                  </svg>
                  <div v-for="(data, id) in mapData" :key="id" class="map-node" :class="{ selected: selectedMainId === id }" :style="{ left: data.x + 'px', top: data.y + 'px' }" @click.stop="selectMainLocation(id)">
                    <span>{{ data.name }}</span>
                    <span class="eng-name">{{ data.eng }}</span>
                  </div>
                </div>
              </div>
              <div class="map-details-area">
                <div class="details-header" v-html="mapDetailHeader"></div>
                <div class="details-section-title" v-if="selectedMainId" style="display:block;">区域 / Area</div>
                <ul class="selection-list">
                  <li v-if="!selectedMainId" class="empty-state" style="list-style:none;">拖拽或缩放地图，点击节点查看详情</li>
                  <li v-for="sub in mapSubLocations" :key="sub.name" class="selection-item" :class="{ active: selectedSubLoc === sub.name }" @click="selectSubLocation(sub)">
                    <span>{{ sub.name }}</span>
                    <i class="fa-solid fa-chevron-right" style="font-size:0.8rem; opacity:0.5;"></i>
                  </li>
                </ul>
                <div class="details-section-title" v-if="mapFacilities.length > 0">设施 / Facility</div>
                <ul class="selection-list">
                  <li v-for="fac in mapFacilities" :key="fac" class="selection-item" :class="{ active: selectedFacility === fac }" @click="selectedFacility = fac">
                    <span><i class="fa-solid fa-door-open" style="color:var(--p5-yellow); margin-right:8px;"></i> {{ fac }}</span>
                  </li>
                </ul>
                <button class="btn-travel" :class="{ ready: !!selectedSubLoc }" @click="executeTravel" :disabled="!selectedSubLoc">
                  <i class="fa-solid fa-route"></i> 前往 / TRAVEL
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, watch, computed } from 'vue'
import { useDataStore } from './store'
import { P5RParser } from './parser'
import {
  renderOverview, renderAction, renderAllout, renderResult,
  renderGeneric, renderAffinityTag, renderStatusTags, escHtml,
} from './battleRenderer'

const store = useDataStore()

const view = ref<'start' | 'create' | 'game'>('start')
const hasSave = ref(false)
const transitioning = ref(false)
const submitting = ref(false)
const isLoading = ref(false)

const createMode = ref<'joker' | 'custom'>('joker')
const jokerTimeNode = ref('prologue')
const customName = ref('')
const customCodename = ref('')
const customGender = ref('男')
const customArcana = ref('fool')
const customPersona = ref('')
const customAppearance = ref('')
const customPersonality = ref('')
const customTimeNode = ref('prologue')

const messages = ref<{ role: string; html: string }[]>([])
const inputText = ref('')
const currentOptions = ref<any[]>([])
const chronicleEntries = ref<{ date: string; text: string }[]>([])
const battleVisible = ref(false)
const battleTitle = ref('战斗面板')
const battleHtml = ref('')
const chronVisible = ref(false)
const modalState = reactive({ map: false, members: false, inventory: false })
const chatLog = ref<HTMLElement | null>(null)

const hud = reactive({
  date: '04/09 (THU)',
  weather: '晴天',
  location: '四轩茶屋 / 卢布朗咖啡店',
})

const coopHtml = ref(`<div style="color:#888;text-align:center;padding:2rem">社群数据加载中...</div>`)
const itemsHtml = ref(`<div style="color:#888;text-align:center;padding:2rem">物品数据加载中...</div>`)

const optLabelMap: Record<string, string> = { attack: '攻击', skill: '技能', defend: '防御', item: '道具', '1more': '1MORE', allout: '总攻', analyze: '分析', flee: '逃跑', negotiate: '交涉', normal: '' }
const optBadgeMap: Record<string, string> = { attack: 'atk', skill: 'skill', defend: 'defend', item: 'item', '1more': 'one-more', allout: 'all-out', analyze: 'neg', flee: 'flee', negotiate: 'neg', normal: 'neg' }
function optLabel(opt: any) { return optLabelMap[opt.type] || '' }
function optBadgeClass(opt: any) { return optBadgeMap[opt.type] || 'neg' }

let currentMsgId = -1

function getMsgId() {
  if (typeof getCurrentMessageId === 'function') return getCurrentMessageId()
  if (typeof SillyTavern !== 'undefined' && SillyTavern.chat) return SillyTavern.chat.length - 1
  return 0
}

function parseStatData(vars: any): any {
  if (typeof _ !== 'undefined') {
    return (_.get(vars, 'stat_data') || _.get(vars, 'data.stat_data')) || {}
  }
  return (vars.stat_data || (vars.data && vars.data.stat_data)) || {}
}

async function loadStatData() {
  try {
    currentMsgId = getMsgId()
    let vars: any = {}
    if (typeof Mvu !== 'undefined') {
      vars = Mvu.getMvuData({ type: 'message', message_id: currentMsgId }) || {}
    } else if (typeof getVariables === 'function') {
      vars = getVariables({ type: 'message', message_id: currentMsgId }) || {}
    }
    const statData = parseStatData(vars)
    if (statData && Object.keys(statData).length > 0) {
      updateHUDFromData(statData)
    } else {
      const storeData = store.data as any
      if (storeData) updateHUDFromStore(storeData)
    }
  } catch (e) { console.error('[P5R] 状态加载失败:', e) }
}

function updateHUDFromData(d: any) {
  const t = d.时间系统 || {}
  const p = d.主角信息 || {}
  hud.date = (t.日期 || '04/09').replace(/年/g, '/').replace(/月/g, '/').replace(/日.*/, '').substring(0, 5) || '04/09'
  hud.weather = t.天气 || t.时段 || '晴'
  hud.location = t.当前地点 || '四轩茶屋 / 卢布朗咖啡店'
}

function updateHUDFromStore(d: any) {
  if (d.时间系统) {
    hud.date = (d.时间系统.日期 || '04/09').replace(/年/g, '/').replace(/月/g, '/').replace(/日.*/, '').substring(0, 5)
    hud.weather = d.时间系统.天气 || d.时间系统.时段 || '--'
  }
  if (d.主角信息) {
    hud.location = d.时间系统?.当前地点 || '四轩茶屋 / 卢布朗咖啡店'
  }
}

watch(() => store.data, (data) => {
  if (!data) return
  updateHUDFromStore(data as any)
}, { deep: true })

async function checkSaveData(): Promise<boolean> {
  try {
    if (typeof Mvu !== 'undefined') {
      const vars = Mvu.getMvuData({ type: 'message', message_id: 0 }) || {}
      const statData = parseStatData(vars)
      if (statData && statData.主角信息 && statData.主角信息.姓名) return true
    }
    if (typeof SillyTavern !== 'undefined' && SillyTavern.chat && SillyTavern.chat.length > 0) return true
    if (typeof getChatMessages === 'function') {
      const msgs = getChatMessages(0)
      if (msgs && msgs.length > 0) return true
    }
  } catch (e) { console.warn('[P5R Start] 存档检查失败:', e) }
  const localData = localStorage.getItem('p5r_character_data')
  if (localData) return true
  return false
}

async function startGame() {
  transitioning.value = true
  const hasData = await checkSaveData()
  setTimeout(() => {
    if (hasData) {
      view.value = 'game'
    } else {
      view.value = 'create'
    }
    transitioning.value = false
  }, 1800)
}

async function loadGame() {
  if (!hasSave.value) return
  transitioning.value = true
  setTimeout(() => {
    view.value = 'game'
    transitioning.value = false
  }, 1800)
}

function switchMode(mode: 'joker' | 'custom') {
  createMode.value = mode
}

async function submitContract() {
  let data: any
  if (createMode.value === 'joker') {
    data = {
      mode: 'joker',
      姓名: '雨宫莲',
      身份: 'Joker',
      性别: '男',
      外貌: '',
      性格: '',
      面具: '亚森',
      timeNode: jokerTimeNode.value,
    }
  } else {
    if (!customName.value.trim() || !customCodename.value.trim()) {
      alert('请填写姓名和怪盗代号！')
      return
    }
    data = {
      mode: 'custom',
      姓名: customName.value.trim(),
      身份: customCodename.value.trim(),
      性别: customGender.value,
      外貌: customAppearance.value.trim(),
      性格: customPersonality.value.trim(),
      面具: customPersona.value.trim() || '???',
      arcana: customArcana.value,
      timeNode: customTimeNode.value,
    }
  }

  submitting.value = true
  try {
    if (typeof Mvu !== 'undefined' || typeof waitGlobalInitialized === 'function') {
      if (typeof waitGlobalInitialized === 'function') await waitGlobalInitialized('Mvu')

      const timeNodeMap: Record<string, any> = {
        prologue: { 日期: '2015年04月09日-星期四', 时段: '白天', 当前阶段: '序章' },
        kamoshida: { 日期: '2015年04月11日-星期六', 时段: '放学后', 当前阶段: '第一章·鸭志田' },
        madarame: { 日期: '2015年05月16日-星期六', 时段: '放学后', 当前阶段: '第二章·斑目' },
        kaneshiro: { 日期: '2015年06月21日-星期日', 时段: '白天', 当前阶段: '第三章·金城' },
        futaba: { 日期: '2015年07月25日-星期六', 时段: '白天', 当前阶段: '第四章·双叶' },
        midgame: { 日期: '2015年07月25日-星期六', 时段: '白天', 当前阶段: '第四章·双叶' },
      }
      const patchOps = [
        { op: 'replace', path: '/主角信息/姓名', value: data.姓名 },
        { op: 'replace', path: '/主角信息/身份', value: data.身份 },
        { op: 'replace', path: '/主角信息/性别', value: data.性别 },
        { op: 'replace', path: '/主角信息/面具', value: data.面具 },
      ]
      if (data.外貌) patchOps.push({ op: 'replace', path: '/主角信息/外貌', value: data.外貌 })
      if (data.性格) patchOps.push({ op: 'replace', path: '/主角信息/性格', value: data.性格 })
      const tn = timeNodeMap[data.timeNode] || timeNodeMap.prologue
      patchOps.push({ op: 'replace', path: '/时间系统/日期', value: tn.日期 })
      patchOps.push({ op: 'replace', path: '/时间系统/时段', value: tn.时段 })
      patchOps.push({ op: 'replace', path: '/剧情进度/当前阶段', value: tn.当前阶段 })

      const patchTag = '<UpdateVariable>\n<Analysis>Character creation - initial setup</Analysis>\n<JSONPatch>\n' + JSON.stringify(patchOps, null, 2) + '\n</JSONPatch>\n</UpdateVariable>'

      if (typeof createChatMessages === 'function') {
        await createChatMessages([
          { role: 'user', message: data.mode === 'joker' ? '[系统] 玩家选择扮演Joker，时间节点：' + data.timeNode : '[系统] 玩家创建自定义角色：' + data.姓名 + ' / ' + data.身份 }
        ], { refresh: 'none' })

        if (typeof Mvu !== 'undefined' && typeof Mvu.parseMessage === 'function') {
          const baseData = Mvu.getMvuData({ type: 'message', message_id: 0 }) || {}
          const result = await Mvu.parseMessage(patchTag, baseData)
          if (result) {
            await Mvu.replaceMvuData(result, { type: 'message', message_id: 'latest' })
          }
        }

        if (typeof generate === 'function') {
          await generate()
        }
      } else {
        localStorage.setItem('p5r_character_data', JSON.stringify(data))
      }
    } else {
      localStorage.setItem('p5r_character_data', JSON.stringify(data))
    }
    view.value = 'game'
  } catch (error) {
    console.error('[P5R Create] 契约签订失败:', error)
    localStorage.setItem('p5r_character_data', JSON.stringify(data))
    view.value = 'game'
  } finally {
    submitting.value = false
  }
}

function selectOption(opt: any) {
  if (isLoading.value) return
  const prefix = opt.type ? `[选择: ${opt.id}] ` : ''
  doAction(prefix + opt.text)
}

function sendAction() {
  const txt = inputText.value.trim()
  if (!txt || isLoading.value) return
  inputText.value = ''
  doAction(txt)
}

function appendMessage(role: string, text: string) {
  messages.value.push({ role, html: text.replace(/\n/g, '<br>') })
  nextTick(() => {
    if (chatLog.value) chatLog.value.scrollTop = chatLog.value.scrollHeight
  })
}

async function doAction(text: string) {
  if (isLoading.value) return
  isLoading.value = true
  currentOptions.value = []
  appendMessage('player', escHtml(text))
  const userInput = '[玩家行动] ' + text

  try {
    if (typeof createChatMessages === 'function' && typeof generate === 'function') {
      await createChatMessages([{ role: 'user', message: userInput }], { refresh: 'none' })
      await generate()

      const parsed = P5RParser.parseMessage(
        typeof getLastMessageId === 'function'
          ? (getChatMessages(getLastMessageId(), {}) as any)?.[0]?.mes || ''
          : (SillyTavern?.chat?.[SillyTavern.chat.length - 1]?.mes || '')
      )

      if (parsed && parsed.content) {
        appendMessage('system', parsed.content)
        renderOptionsFromParsed(parsed.options)
        if (parsed.battlePanels && parsed.battlePanels.length > 0) showBattle(parsed.battlePanels)
        if (parsed.summary) chronicleEntries.value.push({ date: hud.date, text: parsed.summary })
        if (parsed.updateVariable) await applyParsedUpdate(parsed.updateVariable)
      } else if (parsed && parsed.raw) {
        let displayText = parsed.raw
        displayText = displayText.replace(/<action_info[\s\S]*?<\/action_info>/gi, '')
        displayText = displayText.replace(/<UpdateVariable[\s\S]*?<\/UpdateVariable>/gi, '')
        displayText = displayText.replace(/<option[^>]*>[\s\S]*?<\/option>/gi, '')
        displayText = displayText.replace(/<sum[\s\S]*?<\/sum>/gi, '')
        displayText = displayText.replace(/<content>([\s\S]*?)<\/content>/gi, '$1')
        appendMessage('system', displayText.trim())
      } else {
        const messages = typeof getChatMessages === 'function' ? getChatMessages(-1, { role: 'assistant' }) : null
        if (messages && messages.length > 0) {
          appendMessage('system', (messages[0] as any).message || (messages[0] as any).mes || '(AI回复为空)')
        }
      }
      await loadStatData()
    } else if (typeof SillyTavern !== 'undefined' && SillyTavern.sendUserMessage) {
      await SillyTavern.sendUserMessage(userInput)
    } else {
      setTimeout(() => {
        appendMessage('system', `收到指令："${text}"。当前身处 ${hud.location}。`)
      }, 800)
    }
  } catch (e) {
    console.error('[P5R] 行动失败:', e)
  } finally {
    isLoading.value = false
  }
}

function renderOptionsFromParsed(options: any[]) {
  if (!options || options.length === 0) { currentOptions.value = []; return }
  currentOptions.value = options
}

async function applyParsedUpdate(updateVar: any) {
  if (!updateVar) return
  try {
    if (typeof waitGlobalInitialized === 'function') await waitGlobalInitialized('Mvu')
    if ((updateVar.type === 'jsonPatch' || updateVar.type === 'raw') && typeof Mvu !== 'undefined') {
      const oldData = Mvu.getMvuData({ type: 'message', message_id: currentMsgId }) || {}
      const fullTag = '<UpdateVariable>' + updateVar.raw + '</UpdateVariable>'
      const result = await Mvu.parseMessage(fullTag, oldData)
      if (result) {
        await Mvu.replaceMvuData(result, { type: 'message', message_id: currentMsgId })
      }
    }
  } catch (e) { console.warn('[P5R] 变量更新处理失败:', e) }
}

function showBattle(panels: any[]) {
  if (!panels || panels.length === 0) return
  const panel = panels[panels.length - 1]
  const titles: Record<string, string> = { overview: '战况总览', action: '行动结算', allout: '总攻击', result: '战斗结算', unknown: '战斗信息' }
  battleTitle.value = titles[panel.type] || '战斗信息'
  if (panel.type === 'overview') battleHtml.value = renderOverview(panel.body)
  else if (panel.type === 'action') battleHtml.value = renderAction(panel.body)
  else if (panel.type === 'allout') battleHtml.value = renderAllout(panel.body)
  else if (panel.type === 'result') battleHtml.value = renderResult(panel.body)
  else battleHtml.value = renderGeneric(panel.body)
  battleVisible.value = true
}

function toggleChronicle() { chronVisible.value = !chronVisible.value }

function openModal(name: keyof typeof modalState) {
  if (name === 'map') initMapState()
  modalState[name] = true
}

function closeMapModal() { modalState.map = false }

// ================= Map system =================
const mapData: Record<string, { name: string; eng: string; x: number; y: number; subLocations: { name: string; facilities: string[] }[] }> = {
  kichijoji: { name: "吉祥寺", eng: "KICHIJOJI", x: 150, y: 300, subLocations: [{ name: "商店街", facilities: ["飞镖台球馆", "爵士俱乐部", "寺庙", "肉包摊", "换衣店"] }] },
  inokashira: { name: "井の头公园", eng: "INOKASHIRA KOEN", x: 120, y: 500, subLocations: [{ name: "公园内", facilities: ["天鹅船搭乘处"] }] },
  ogikubo: { name: "荻洼", eng: "OGIKUBO", x: 350, y: 250, subLocations: [{ name: "主街道", facilities: ["老字号拉面店"] }] },
  nakano: { name: "中野", eng: "NAKANO", x: 480, y: 280, subLocations: [{ name: "商业街", facilities: ["百老汇商城"] }] },
  shinjuku: { name: "新宿", eng: "SHINJUKU", x: 650, y: 320, subLocations: [{ name: "红灯区", facilities: ["十字路口酒吧", "千早占卜", "花店"] }, { name: "电影院大街", facilities: ["新宿电影院", "书店"] }] },
  meiji: { name: "明治神宫前", eng: "MEIJI JINGUMAE", x: 400, y: 450, subLocations: [{ name: "神宫参道", facilities: ["神社"] }] },
  harajuku: { name: "原宿", eng: "HARAJUKU", x: 520, y: 480, subLocations: [{ name: "竹下通", facilities: ["可丽饼店", "偶像周边店"] }] },
  yongen: { name: "四轩茶屋", eng: "YONGENJAYA", x: 250, y: 750, subLocations: [{ name: "小巷", facilities: ["卢布朗咖啡店", "武见诊所", "公共澡堂", "投币洗衣店"] }, { name: "主街道", facilities: ["超市", "二手店", "电影院"] }] },
  shibuya: { name: "涩谷", eng: "SHIBUYA", x: 600, y: 650, subLocations: [{ name: "站前广场", facilities: ["打工便利店", "彩票站", "地下通道"] }, { name: "中央大街", facilities: ["大爆炸汉堡", "健身房", "生存游戏店"] }, { name: "地下商场", facilities: ["花店", "高级超市", "化妆品店"] }] },
  ikebukuro: { name: "池袋", eng: "IKEBUKURO", x: 850, y: 200, subLocations: [{ name: "东口", facilities: ["天象馆"] }] },
  ichigaya: { name: "市谷", eng: "ICHIGAYA", x: 900, y: 350, subLocations: [{ name: "车站旁", facilities: ["钓鱼池"] }] },
  aoyama: { name: "青山一丁目", eng: "AOYAMA ITCHOME", x: 900, y: 550, subLocations: [{ name: "校园区", facilities: ["秀尽学园"] }] },
  akasaka: { name: "赤坂见附", eng: "AKASAKA MITSUKE", x: 1100, y: 600, subLocations: [{ name: "商务区", facilities: ["电视台大楼"] }] },
  roppongi: { name: "六本木", eng: "ROPPONGI", x: 1150, y: 750, subLocations: [{ name: "新城", facilities: ["观景台", "高级俱乐部"] }] },
  shinagawa: { name: "品川", eng: "SHINAGAWA", x: 950, y: 900, subLocations: [{ name: "车站周边", facilities: ["水族馆"] }] },
  nagatacho: { name: "永田町", eng: "NAGATACHO", x: 1100, y: 450, subLocations: [{ name: "政治核心区", facilities: ["国会议事堂"] }] },
  suidobashi: { name: "水道桥", eng: "SUIDOBASHI", x: 1300, y: 300, subLocations: [{ name: "游乐区", facilities: ["巨蛋城"] }] },
  ueno: { name: "上野", eng: "UENO", x: 1400, y: 200, subLocations: [{ name: "上野公园", facilities: ["美术馆"] }] },
  jimbocho: { name: "神保町", eng: "JIMBOCHO", x: 1350, y: 450, subLocations: [{ name: "书店街", facilities: ["古书店"] }] },
  akihabara: { name: "秋叶原", eng: "AKIHABARA", x: 1600, y: 300, subLocations: [{ name: "电器街", facilities: ["复古游戏店", "女仆咖啡厅", "扭蛋机区"] }] },
  kanda: { name: "神田", eng: "KANDA", x: 1650, y: 480, subLocations: [{ name: "神田区", facilities: ["教会"] }] },
  asakusa: { name: "浅草・押上", eng: "ASAKUSA OSHIAGE", x: 1800, y: 150, subLocations: [{ name: "观光区", facilities: ["仲见世街", "晴空塔"] }] },
  ginza: { name: "银座", eng: "GINZA", x: 1600, y: 650, subLocations: [{ name: "主干道", facilities: ["高级寿司店", "珠宝店"] }] },
  tsukishima: { name: "月岛", eng: "TSUKISHIMA", x: 1850, y: 750, subLocations: [{ name: "文字烧街", facilities: ["文字烧老店"] }] },
  maihama: { name: "舞滨", eng: "MAIHAMA", x: 1950, y: 500, subLocations: [{ name: "度假区", facilities: ["游乐园大门"] }] },
  motomachi: { name: "元町中华街", eng: "MOTOMACHI CHUKAGAI", x: 150, y: 1050, subLocations: [{ name: "中华街", facilities: ["高级肉包店"] }] },
  miura: { name: "三浦海岸", eng: "MIURA KAIGAN", x: 850, y: 1100, subLocations: [{ name: "海滨", facilities: ["沙滩", "海滨浴场"] }] },
  odaiba: { name: "台场海滨公园", eng: "ODAIBA KAIHINKOEN", x: 1650, y: 1050, subLocations: [{ name: "海滨公园", facilities: ["大摩天轮"] }] },
}

const selectedMainId = ref<string | null>(null)
const selectedSubLoc = ref<string | null>(null)
const selectedFacility = ref<string | null>(null)
const mapScale = ref(0.6)
const mapTranslateX = ref(-200)
const mapTranslateY = ref(-100)
let mapDragging = false
let mapStartX = 0
let mapStartY = 0

const mapCanvasTransform = computed(() => ({
  transform: `translate(${mapTranslateX.value}px, ${mapTranslateY.value}px) scale(${mapScale.value})`,
}))

const mapDetailHeader = computed(() => {
  if (!selectedMainId.value) return '<i class="fa-solid fa-map"></i> 请选择地点'
  const d = mapData[selectedMainId.value]
  return `<i class="fa-solid fa-map-pin"></i> ${d.name}`
})

const mapSubLocations = computed(() => {
  if (!selectedMainId.value) return []
  return mapData[selectedMainId.value].subLocations
})

const mapFacilities = computed(() => {
  if (!selectedSubLoc.value || !selectedMainId.value) return []
  const subs = mapData[selectedMainId.value].subLocations
  const found = subs.find(s => s.name === selectedSubLoc.value)
  return found ? found.facilities : []
})

function initMapState() {
  selectedMainId.value = null
  selectedSubLoc.value = null
  selectedFacility.value = null
  mapScale.value = 0.6
  mapTranslateX.value = -200
  mapTranslateY.value = -100
}

function selectMainLocation(id: string) {
  selectedMainId.value = id
  selectedSubLoc.value = null
  selectedFacility.value = null
}

function selectSubLocation(sub: { name: string; facilities: string[] }) {
  selectedSubLoc.value = sub.name
  selectedFacility.value = null
}

async function executeTravel() {
  if (!selectedMainId.value || !selectedSubLoc.value) return
  const mainName = mapData[selectedMainId.value].name
  let targetString = `${mainName} / ${selectedSubLoc.value}`
  if (selectedFacility.value) targetString += ` - ${selectedFacility.value}`
  hud.location = targetString
  appendMessage('system', `主角通过地铁网移动到了 [${targetString}]。`)
  modalState.map = false
}

function onMapPointerDown(e: PointerEvent) {
  mapDragging = true
  mapStartX = e.clientX - mapTranslateX.value
  mapStartY = e.clientY - mapTranslateY.value
  const vp = e.currentTarget as HTMLElement
  vp.setPointerCapture(e.pointerId)
}

function onMapPointerMove(e: PointerEvent) {
  if (!mapDragging) return
  mapTranslateX.value = e.clientX - mapStartX
  mapTranslateY.value = e.clientY - mapStartY
}

function onMapPointerUp(e: PointerEvent) {
  mapDragging = false
  const vp = e.currentTarget as HTMLElement
  try { vp.releasePointerCapture(e.pointerId) } catch {}
}

function onMapWheel(e: WheelEvent) {
  const vp = e.currentTarget as HTMLElement
  const delta = e.deltaY > 0 ? 0.9 : 1.1
  let newScale = mapScale.value * delta
  newScale = Math.max(0.2, Math.min(newScale, 2))
  const rect = vp.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top
  mapTranslateX.value = mouseX - (mouseX - mapTranslateX.value) * (newScale / mapScale.value)
  mapTranslateY.value = mouseY - (mouseY - mapTranslateY.value) * (newScale / mapScale.value)
  mapScale.value = newScale
}

function loadCOOP() {
  let stats: any = {}
  try {
    if (typeof Mvu !== 'undefined') {
      const vars = Mvu.getMvuData({ type: 'message', message_id: currentMsgId }) || {}
      stats = parseStatData(vars)
    }
  } catch {}
  const coop = stats.社群关系 || stats.COOP || {}
  if (typeof coop === 'object' && Object.keys(coop).length > 0) {
    let html = ''
    for (const [name, info] of Object.entries(coop)) {
      const d = info as any
      const genderIcon = d.性别 === '女' ? '<i class="fa-solid fa-venus" style="color:#FF69B4"></i>' : '<i class="fa-solid fa-mars" style="color:#1E90FF"></i>'
      const rankNum = d.Rank || d.等级 || '?'
      const relation = d.关系 || d.Relation || ''
      const desc = d.描述 || d.Description || ''
      html += `<div class="coop-card">
        <div class="coop-header"><span class="coop-name">${name}</span><span class="coop-gender">${genderIcon}</span></div>
        <div class="coop-rank"><span class="rank-num">RANK ${rankNum}</span></div>
        ${relation ? `<div class="coop-relation">${relation}</div>` : ''}
        ${desc ? `<p style="margin-top:15px;font-size:0.9rem;color:#ccc;">${desc}</p>` : ''}
      </div>`
    }
    coopHtml.value = html || '<div style="color:#888;text-align:center;padding:2rem">暂无社群数据</div>'
  } else {
    coopHtml.value = `<div class="coop-card"><div class="coop-header"><span class="coop-name">高卷杏</span><span class="coop-gender gender-f"><i class="fa-solid fa-venus"></i></span></div><div class="coop-rank"><span class="rank-num">MAX</span><span class="stars">★★★★★</span></div><div class="coop-relation relation-lover">恋人 / 恋爱</div><p style="margin-top:15px;font-size:0.9rem;color:#ccc;">怪盗团的女演员，充满正义感的同班同学。</p></div>
    <div class="coop-card"><div class="coop-header"><span class="coop-name">坂本龙司</span><span class="coop-gender gender-m"><i class="fa-solid fa-mars"></i></span></div><div class="coop-rank"><span class="rank-num">RANK 8</span><span class="stars">★★★★☆</span></div><div class="coop-relation relation-friend">挚友 / 战车</div><p style="margin-top:15px;font-size:0.9rem;color:#ccc;">冲动但重情义的死党，怪盗团的突击队长。</p></div>
    <div class="coop-card"><div class="coop-header"><span class="coop-name">武见妙</span><span class="coop-gender gender-f"><i class="fa-solid fa-venus"></i></span></div><div class="coop-rank"><span class="rank-num">RANK 5</span><span class="stars">★★★☆☆</span></div><div class="coop-relation">合作者 / 死神</div><p style="margin-top:15px;font-size:0.9rem;color:#ccc;">四轩茶屋的黑市医生，提供珍贵的恢复道具。</p></div>
    <div class="coop-card"><div class="coop-header"><span class="coop-name">明智吾郎</span><span class="coop-gender gender-m"><i class="fa-solid fa-mars"></i></span></div><div class="coop-rank"><span class="rank-num">RANK 2</span><span class="stars">★☆☆☆☆</span></div><div class="coop-relation" style="background:#555;color:white;">陌生人 / 正义</div><p style="margin-top:15px;font-size:0.9rem;color:#ccc;">高中生侦探，目前对怪盗团持怀疑态度。</p></div>`
  }
}

function loadItems() {
  let stats: any = {}
  try {
    if (typeof Mvu !== 'undefined') {
      const vars = Mvu.getMvuData({ type: 'message', message_id: currentMsgId }) || {}
      stats = parseStatData(vars)
    }
  } catch {}
  const inv = stats.随身物品 || stats.Inventory || {}
  if (typeof inv === 'object' && Object.keys(inv).length > 0) {
    let html = ''
    const iconMap: Record<string, string> = { '药': 'fa-capsules', '回': 'fa-capsules', '咖啡': 'fa-mug-hot', '勒布朗': 'fa-mug-hot', '爆弹': 'fa-bomb', '钥': 'fa-key', '锁': 'fa-key', '枪': 'fa-gun', '面': 'fa-mask', '汉': 'fa-burger' }
    for (const [name, count] of Object.entries(inv)) {
      let icon = 'fa-box'
      for (const [k, v] of Object.entries(iconMap)) { if (name.includes(k)) { icon = v; break } }
      html += `<div class="item-slot"><i class="fa-solid ${icon}"></i><span class="item-name">${name}</span><span class="item-count">x${count}</span></div>`
    }
    itemsHtml.value = html || '<div style="color:#888;text-align:center;padding:2rem">暂无物品</div>'
  } else {
    itemsHtml.value = `<div class="item-slot"><i class="fa-solid fa-capsules"></i><span class="item-name">还魂丹</span><span class="item-count">x3</span></div>
    <div class="item-slot"><i class="fa-solid fa-mug-hot"></i><span class="item-name">勒布朗咖啡</span><span class="item-count">x5</span></div>
    <div class="item-slot"><i class="fa-solid fa-bomb"></i><span class="item-name">业火勾玉</span><span class="item-count">x12</span></div>
    <div class="item-slot"><i class="fa-solid fa-key"></i><span class="item-name">开锁工具</span><span class="item-count">x99</span></div>
    <div class="item-slot"><i class="fa-solid fa-gun"></i><span class="item-name">托卡列夫</span><span class="item-count">x1</span></div>
    <div class="item-slot"><i class="fa-solid fa-burger"></i><span class="item-name">大爆炸汉堡</span><span class="item-count">x2</span></div>
    <div class="item-slot"><i class="fa-solid fa-mask"></i><span class="item-name">怪盗面具</span><span class="item-count">x1</span></div>`
  }
}

watch(() => modalState.members, (v) => { if (v) loadCOOP() })
watch(() => modalState.inventory, (v) => { if (v) loadItems() })

onMounted(async () => {
  hasSave.value = await checkSaveData()
  if (view.value === 'game') await loadStatData()

  if (typeof SillyTavern !== 'undefined') {
    const chat = SillyTavern.chat || []
    if (chat.length > 0) {
      const lastMsg = chat[chat.length - 1]
      if (lastMsg && !lastMsg.is_user) {
        const parsed = P5RParser.parseMessage(lastMsg.mes || '')
        if (parsed && parsed.content) {
          appendMessage('system', parsed.content)
        }
        if (parsed && parsed.options) currentOptions.value = parsed.options
        if (parsed && parsed.battlePanels && parsed.battlePanels.length > 0) showBattle(parsed.battlePanels)
      }
    }
  }
})

watch(view, async (v) => {
  if (v === 'game') {
    await nextTick()
    await loadStatData()
    loadCOOP()
    loadItems()
  }
})
</script>