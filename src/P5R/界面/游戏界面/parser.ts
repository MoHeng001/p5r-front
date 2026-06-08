import { waitUntil } from 'async-wait-until';
import App from './App.vue';
import './global.css';

export const P5RParser = {
  filterThinking(msg) {
    if (!msg) return '';
    return msg.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '').trim();
  },
  extractTagContent(msg, tag) {
    const re = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'i');
    const m = msg.match(re);
    return m ? m[1].trim() : null;
  },
  parseContent(msg) {
    return this.extractTagContent(this.filterThinking(msg), 'content') || '';
  },
  parseOptions(msg) {
    const cleaned = this.filterThinking(msg);
    const opts = [];
    const re = /<option([^>]*)>([\s\S]*?)<\/option>/gi;
    let m;
    while ((m = re.exec(cleaned)) !== null) {
      const attrs = m[1].trim();
      const text = m[2].trim();
      const idM = attrs.match(/id\s*=\s*["']([^"']+)["']/i);
      const typeM = attrs.match(/type\s*=\s*["']([^"']+)["']/i);
      const skillM = attrs.match(/skill\s*=\s*["']([^"']+)["']/i);
      const itemM = attrs.match(/item\s*=\s*["']([^"']+)["']/i);
      opts.push({ id: idM ? idM[1] : '', type: typeM ? typeM[1] : '', text, skill: skillM ? skillM[1] : '', item: itemM ? itemM[1] : '' });
    }
    return opts;
  },
  parseActionInfo(msg) {
    const cleaned = this.filterThinking(msg);
    const raw = this.extractTagContent(cleaned, 'action_info');
    if (!raw) return [];
    const panels = [];
    const re = /\{(战况总览|行动结算|总攻击|战斗结算)\}/g;
    let match;
    while ((match = re.exec(raw)) !== null) {
      panels.push({ type: 'unknown', body: '' });
    }
    const sectionRe = /\{(战况总览|行动结算|总攻击|战斗结算)\}([\s\S]*?)(?=\{(战况总览|行动结算|总攻击|战斗结算)\}|$)/gi;
    let sm;
    const typeMap = { '战况总览': 'overview', '行动结算': 'action', '总攻击': 'allout', '战斗结算': 'result' };
    while ((sm = sectionRe.exec(raw)) !== null) {
      panels.push({ type: typeMap[sm[1]] || 'unknown', body: sm[2].trim() });
    }
    if (panels.length === 0) {
      panels.push({ type: 'unknown', body: raw });
    }
    return panels;
  },
  parseUpdateVariable(msg) {
    if (!msg) return null;
    const cleaned = this.filterThinking(msg);
    const raw = this.extractTagContent(cleaned, 'UpdateVariable');
    if (!raw) return null;
    const jsonPatchMatch = raw.match(/<JSONPatch>([\s\S]*?)<\/JSONPatch>/i);
    const analysisMatch = raw.match(/<Analysis>([\s\S]*?)<\/Analysis>/i);
    if (jsonPatchMatch) {
      try {
        const patches = JSON.parse(jsonPatchMatch[1].trim());
        return { type: 'jsonPatch', patches, analysis: analysisMatch ? analysisMatch[1].trim() : '', raw };
      } catch (e) { /* fall through */ }
    }
    if (analysisMatch) {
      return { type: 'analysisOnly', analysis: analysisMatch[1].trim(), raw };
    }
    const rawTrimmed = raw.trim();
    if (rawTrimmed.charAt(0) === '{' || rawTrimmed.charAt(0) === '[') {
      try {
        const parsed = JSON.parse(rawTrimmed);
        if (Array.isArray(parsed)) return { type: 'jsonPatch', patches: parsed, analysis: '', raw };
        return { type: 'jsonPatch', patches: [{ op: 'replace', path: '', value: parsed }], analysis: '', raw };
      } catch (e2) { /* fall through */ }
    }
    return { type: 'raw', raw };
  },
  parseSum(msg) {
    return this.extractTagContent(this.filterThinking(msg), 'sum') || '';
  },
  parseMessage(msg) {
    return {
      content: this.parseContent(msg),
      options: this.parseOptions(msg),
      battlePanels: this.parseActionInfo(msg),
      updateVariable: this.parseUpdateVariable(msg),
      summary: this.parseSum(msg),
    };
  }
};