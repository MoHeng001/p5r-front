export function renderOverview(body: string): string {
  const lines = body.split('\n').filter(l => l.trim());
  let html = '';
  let section = '';
  for (const line of lines) {
    if (/──\s*敌方\s*──/.test(line)) {
      html += '<div class="battle-section-label">── 敌方 ──</div>';
      section = 'enemy';
      continue;
    }
    const hpMatch = line.match(/[:：]\s*HP\s*\[?(\d+)\s*[／\/]\s*(\d+)\]?/i);
    const spMatch = line.match(/SP\s*\[?(\d+)\s*[／\/]\s*(\d+)\]?/i);
    const nameMatch = line.match(/[|│]\s*\[?([^\]|：:]+?)\]?\s*[:：]/);
    const name = nameMatch ? nameMatch[1].trim() : '';
    const statusMatch = line.match(/状态[:：]\s*\[?([^\]|]*)\]?/);
    const statuses = statusMatch ? statusMatch[1].trim() : '';
    const affinityMatch = line.match(/弱点[:：]\s*\[?([^\]|]*)\]?/);

    if (hpMatch) {
      const curHp = parseInt(hpMatch[1]);
      const maxHp = parseInt(hpMatch[2]);
      const curSp = spMatch ? parseInt(spMatch[1]) : 0;
      const maxSp = spMatch ? parseInt(spMatch[2]) : 0;
      const hpPct = maxHp > 0 ? Math.round(curHp / maxHp * 100) : 0;
      const hpCls = hpPct <= 30 ? 'low' : hpPct <= 50 ? 'mid' : '';
      const spPct = maxSp > 0 ? Math.round(curSp / maxSp * 100) : 0;
      const isAlly = section !== 'enemy';
      html += '<div class="battle-unit ' + (isAlly ? 'ally-unit' : 'enemy-unit') + '">';
      html += '<div class="battle-unit-name">' + escHtml(name || '???') + '</div>';
      html += '<div class="battle-bar-row"><span class="battle-bar-label hp-label">HP</span><div class="battle-bar-track"><div class="battle-bar-fill hp-fill ' + hpCls + '" style="width:' + hpPct + '%"></div></div><span class="battle-bar-text">' + curHp + '/' + maxHp + '</span></div>';
      if (spMatch) {
        html += '<div class="battle-bar-row"><span class="battle-bar-label sp-label">SP</span><div class="battle-bar-track"><div class="battle-bar-fill sp-fill" style="width:' + spPct + '%"></div></div><span class="battle-bar-text">' + curSp + '/' + maxSp + '</span></div>';
      }
      if (affinityMatch && section === 'enemy') {
        html += '<div class="battle-bar-row" style="margin-top:0.1rem"><span style="font-size:0.65rem;color:#888">弱点:</span> ' + renderAffinityTag(affinityMatch[1].trim()) + '</div>';
      }
      if (statuses) {
        html += '<div class="battle-status-row">' + renderStatusTags(statuses) + '</div>';
      }
      html += '</div>';
    } else if (line.match(/[|│]/) && !hpMatch) {
      html += '<div class="battle-line">' + escHtml(line.replace(/[|│]/g, ' │ ')) + '</div>';
    }
  }
  return html;
}

export function renderAction(body: string): string {
  const lines = body.split('\n').filter(l => l.trim());
  let html = '';
  for (const line of lines) {
    let cls = 'battle-result-line';
    if (/弱点|1MORE|暴击|DOWN/.test(line)) cls += ' highlight';
    if (/敌方|敌人|影子/.test(line)) cls += ' enemy';
    const affinityMatch = line.match(/属性相性[:：]\s*\[?([^\]|]*)\]?/);
    if (affinityMatch) {
      html += '<div class="battle-result-line"><span style="color:#888">属性相性:</span> ' + renderAffinityTag(affinityMatch[1].trim()) + '</div>';
      continue;
    }
    const hpChangeMatch = line.match(/HP\s*\[?(\d+)\s*→\s*(\d+)\]?/);
    if (hpChangeMatch) {
      const old = hpChangeMatch[1], nw = hpChangeMatch[2];
      const color = parseInt(nw) < parseInt(old) ? '#ff6b6b' : '#69f0ae';
      html += '<div class="battle-result-line">' + escHtml(line).replace(old + ' → ' + nw, '<span style="color:' + color + ';font-weight:700">' + old + ' → ' + nw + '</span>') + '</div>';
      continue;
    }
    html += '<div class="' + cls + '">' + escHtml(line.replace(/[|│]/g, ' │ ')) + '</div>';
  }
  return html;
}

export function renderAllout(body: string): string {
  const lines = body.split('\n').filter(l => l.trim());
  let html = '<div style="text-align:center;color:var(--p5-yellow);font-weight:900;font-size:1.1rem;margin:0.5rem 0;transform:skew(-5deg);">⚔ 总攻击 ⚔</div>';
  for (const line of lines) {
    let cls = 'battle-result-line';
    if (/伤害|消灭/.test(line)) cls += ' highlight';
    html += '<div class="' + cls + '">' + escHtml(line.replace(/[|│]/g, ' │ ')) + '</div>';
  }
  return html;
}

export function renderResult(body: string): string {
  const lines = body.split('\n').filter(l => l.trim());
  let html = '';
  for (const line of lines) {
    let cls = 'battle-result-line';
    if (/经验|金钱|掉落|发现/.test(line)) cls += ' highlight';
    if (/胜利/.test(line)) cls += ' highlight';
    if (/失败/.test(line)) cls += ' enemy';
    html += '<div class="' + cls + '">' + escHtml(line.replace(/[|│]/g, ' │ ')) + '</div>';
  }
  return html;
}

export function renderGeneric(body: string): string {
  const lines = body.split('\n').filter(l => l.trim());
  return lines.map(line => {
    let cls = 'battle-line';
    if (/敌方|敌人|影子/.test(line)) cls += ' enemy';
    if (/Joker|Skull|Panther|Fox|Queen|Navi|Noir|龙司|杏|祐介|真|双叶|春/.test(line)) cls += ' ally';
    if (/弱点|1MORE|总攻击|DOWN|暴击/.test(line)) cls += ' highlight';
    return '<div class="' + cls + '">' + escHtml(line.replace(/[|│]/g, ' │ ')) + '</div>';
  }).join('');
}

export function renderAffinityTag(text: string): string {
  const map: Record<string, string> = { '弱点': 'weak', '弱': 'weak', '耐性': 'resist', '耐': 'resist', '无效': 'null', '吸收': 'absorb', '反射': 'reflect', '普通': 'normal' };
  const cls = map[text] || 'normal';
  return '<span class="battle-affinity ' + cls + '">' + escHtml(text) + '</span>';
}

export function renderStatusTags(text: string): string {
  const buffs = ['拉库卡加', '马哈拉库卡加', '塔尔卡加', '马哈塔尔卡加', '斯库卡加', '马哈斯库卡加'];
  const debuffs = ['拉库ンダ', '马哈ラクンダ', 'タルンダ', 'マハタルンダ', 'スクンダ', 'マハスクンダ'];
  const ailments = ['眩晕', '混乱', '恐惧', '绝望', '狂怒', '脑洗', '睡眠', '冻结', '烧伤'];
  return text.split(/[,，、;；]/).map(s => {
    s = s.trim();
    let cls = 'buff';
    if (ailments.some(a => s.includes(a)) || /异常|DEBUFF|弱体/i.test(s)) cls = 'ailment';
    else if (debuffs.some(d => s.includes(d)) || /低下/i.test(s)) cls = 'debuff';
    else if (buffs.some(b => s.includes(b)) || /强化|UP|上升/i.test(s)) cls = 'buff';
    else if (/DOWN/i.test(s)) cls = 'ailment';
    return '<span class="battle-status-tag ' + cls + '">' + escHtml(s) + '</span>';
  }).join('');
}

export function escHtml(str: string): string {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}