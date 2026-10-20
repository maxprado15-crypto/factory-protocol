// --------------------------- Rendering -------------------------------------
function renderNode(){
  const n=nodes[state.node];if(!n)return;
  $('#missionProgress').style.width=n.progress+'%';$('#eventKicker').textContent=n.kicker;$('#eventTitle').textContent=n.title;$('#eventBody').textContent=n.body;const npc=$('#npcSpeaker');if(npc){npc.textContent=n.speaker||'';npc.classList.toggle('hidden',!n.speaker)}$('#actionArea').innerHTML='';$('#cardShelf').innerHTML='';$('#cardSection').classList.toggle('hidden',n.type!=='check');
  if(n.type==='choice')renderChoice(n);else if(n.type==='quiz')renderQuiz(n);else if(n.type==='check')renderCheck(n);else if(n.type==='failed')renderFailed(n);else renderEnd(n);
  const active=['restart','check3','report','end'].includes(state.node);const m=mission();$('#signalState').textContent=active?m.statusOk:m.statusFault;$('#signalState').className=active?'signal-state active':'signal-state';
  if(n.scene)setSceneMode(n.scene);else if(state.node==='end')setSceneMode('restart');else if(state.node==='failed')setSceneMode('bypass');
  updateMetrics();
}
function actionButton(label,sub,fn,index,kind='normal'){
  const b=document.createElement('button');b.className='action-button '+kind;b.innerHTML=`<span class="action-num">${String(index+1).padStart(2,'0')}</span><span class="action-copy"><strong>${label}</strong><small>${sub||''}</small></span><span class="action-chevron">›</span>`;b.addEventListener('click',()=>{sfx('click');vibrate(12);b.classList.add('pressed');setTimeout(fn,90)});return b;
}
function renderChoice(n){n.opts.forEach((o,i)=>$('#actionArea').append(actionButton(o.label,o.sub,()=>handleChoice(n,o,i),i,o.quality==='unsafe'?'danger':'')))}
async function handleChoice(n,o,index){
  const originNode=state.node;
  state.decision=o.decision||0;
  if(!state.scoredNodes.has(originNode)){state.technical+=o.tech||0;if(o.quality==='good')state.scoredNodes.add(originNode)}
  applyImpact(o.impact||{},o.label);
  record({kind:'choice',node:originNode,label:o.label,body:o.result,quality:o.quality,impact:o.impact||{}});
  const failed=state.node==='failed';
  await showConsequence({kicker:o.quality==='unsafe'?'SAFETY CONSEQUENCE':'ACTION RESULT',title:o.reaction,body:o.result,impact:o.impact||{},kind:o.quality==='good'?'success':o.quality==='plausible'?'info':o.quality==='unsafe'?'unsafe':'danger',scene:o.scene});
  if(failed){renderNode();return}
  state.node=o.next;renderNode();
}
function renderQuiz(n){
  const log=document.createElement('div');log.className='log-chip';log.innerHTML='<span>LANGUAGE IN CONTEXT</span><strong>READ · INTERPRET · ACT</strong>';$('#actionArea').append(log);
  n.opts.forEach((o,i)=>$('#actionArea').append(actionButton(String.fromCharCode(65+i)+'. '+o[0],'',()=>handleQuiz(n,o,i),i)));
}
async function handleQuiz(n,o,i){
  const ok=i===n.correct;let impact;
  if(ok){state.englishBank+=n.bonus;state.englishScore+=n.bonus;state.rewardPool+=10;impact={xp:10};showBonus(n.bonus);record({kind:'language',node:state.node,label:'Information interpreted correctly',body:o[1],impact});}
  else {impact={efficiency:-3,time:2,xp:-5};applyImpact(impact,'Misinterpreted technical English');record({kind:'language',node:state.node,label:'Information misinterpreted',body:o[1],impact});}
  updateMetrics();
  await showConsequence({kicker:'LANGUAGE IN CONTEXT',title:ok?'INFORMATION INTERPRETED':'INFORMATION MISINTERPRETED',body:o[1],impact,kind:ok?'success':'danger',scene:state.node==='report'?'verify':'inspect'});
  if(state.node==='failed'){renderNode();return}state.node=n.next;renderNode();
}
function renderCheck(n){
  const selected=cards.find(c=>c.id===state.selected)||null;
  const target=cardDifficulty(selected,n);
  const check=document.createElement('div');check.className='check-grid';check.innerHTML=`<div><small>ATTRIBUTE</small><strong>+${n.attr}</strong></div><div><small>TARGET</small><strong>${selected&&target!==n.diff?`${n.diff} → ${target}`:n.diff}</strong></div><div><small>ENGLISH</small><strong>+${state.englishBank}</strong></div><div><small>DECISION</small><strong>${state.decision>=0?'+':''}${state.decision}</strong></div>`;$('#actionArea').append(check);
  const tip=document.createElement('div');tip.className='check-tip';tip.textContent='Select one field card or roll without a card. Card uses reset at the start of each mission.';$('#actionArea').append(tip);
  if(selected){
    const intel=document.createElement('div');intel.className='card-effect-panel';intel.innerHTML=`<small>CARD EFFECT · ${chargeRemaining(selected.id)} USE${chargeRemaining(selected.id)===1?'':'S'} REMAIN</small><strong>${selected.effect||selected.desc}</strong><p>${cardEvidence(selected,n)}</p>`;$('#actionArea').append(intel);
  }
  cards.filter(c=>state.deck.includes(c.id)&&cardUnlocked(c.id)&&!used(c.id)&&hasTag(c,n.tags)).forEach(card=>$('#cardShelf').append(renderCard(card,n)));
  const roll=document.createElement('button');roll.className='roll-button';roll.innerHTML='<span class="die-mini">20</span><span><strong>ROLL D20</strong><small>Resolve diagnostic check</small></span>';roll.onclick=()=>{sfx('select');vibrate(18);performRoll(n)};$('#actionArea').append(roll);
}
function renderCard(card,n){
  const left=chargeRemaining(card.id),max=card.maxUses||1;
  const el=document.createElement('button');el.className='tool-card '+card.type.toLowerCase()+(state.selected===card.id?' selected':'');el.style.setProperty('--card-img',`url("${card.image}")`);el.innerHTML=`<span class="card-type">${card.type}</span><span class="card-charge">${left}/${max}</span><span class="card-info"><strong>${card.name}</strong><small>${card.effect||card.desc}</small></span>`;
  el.onclick=()=>{sfx('card');vibrate(10);state.selected=state.selected===card.id?null:card.id;if(state.selected===card.id)feedback(cardEvidence(card,n),'info');renderNode()};return el;
}
function renderCheckOnly(n){renderNode()}
async function performRoll(n){
  const card=cards.find(c=>c.id===state.selected)||null;
  if(card&&used(card.id)){state.selected=null;feedback('That card has no uses remaining this mission.','danger');renderNode();return}
  if(card?.timeCost){applyImpact({time:card.timeCost},card.name+' support cost')}
  let r1=Math.floor(Math.random()*20)+1,r2=0,r=r1;if(card?.reroll){r2=Math.floor(Math.random()*20)+1;r=Math.max(r1,r2)}
  const cb=card?card.bonus:0,diff=cardDifficulty(card,n),total=r+n.attr+state.englishBank+state.decision+cb,success=r===20||total>=diff,complication=r===1;
  if(card)consumeCard(card);
  let impact={time:2};
  if(success){state.technical++;if(r===20){impact={time:1,xp:10}}}
  else {state.complications++;impact={efficiency:-8,time:5,xp:-10};if(complication){impact.safety=-5;impact.xp=-15}}
  applyImpact(impact,success?'Diagnostic check completed':'Diagnostic delay');
  await showDiceModal({r1,r2,r,total,diff,baseDiff:n.diff,attr:n.attr,english:state.englishBank,decision:state.decision,cardBonus:cb,cardName:card?.name||'NO CARD',success,complication});
  const evidence=card?` ${cardEvidence(card,n)}`:'';
  const body=(r===20?'Critical success. ':complication?'Complication. ':'')+(success?n.success:n.fail)+evidence;
  record({kind:'check',node:state.node,label:success?'Diagnostic success':'Diagnostic complication',body,impact});
  await showConsequence({kicker:'DIAGNOSTIC RESULT',title:r===20?'CRITICAL SUCCESS':complication?'COMPLICATION':success?'CHECK PASSED':'CHECK DELAYED',body,impact,kind:success?'success':'danger',scene:n.scene||'inspect'});
  if(state.node==='failed'){renderNode();return}
  state.englishBank=0;state.decision=0;state.selected=null;state.node=n.next;renderNode();
}
async function showDiceModal(d){
  const m=$('#diceModal');m.classList.add('open');$('#diceResult').textContent='D20';$('#diceResult').className='dice-core spinning';$('#diceBreakdown').innerHTML='';sfx('alarm');vibrate([15,30,15,30,20]);
  const timer=setInterval(()=>{$('#diceResult').textContent=1+Math.floor(Math.random()*20);tone(180+Math.random()*250,.03,'square',.008)},75);await sleep(900);clearInterval(timer);$('#diceResult').textContent=d.r;$('#diceResult').className='dice-core reveal';
  const rows=[['D20',d.r2?`${d.r1} / ${d.r2} → ${d.r}`:d.r],['DIAGNOSTICS',`+${d.attr}`],['ENGLISH',`+${d.english}`],['DECISION',`${d.decision>=0?'+':''}${d.decision}`],['CARD',`+${d.cardBonus}`],['TARGET',d.baseDiff&&d.baseDiff!==d.diff?`${d.baseDiff} → ${d.diff}`:d.diff]];
  for(const row of rows){const e=document.createElement('div');e.innerHTML=`<span>${row[0]}</span><strong>${row[1]}</strong>`;$('#diceBreakdown').append(e);sfx('xp');await sleep(90)}
  $('#diceTotal').textContent=`${d.total} / ${d.diff}`;$('#diceOutcome').textContent=d.r===20?'CRITICAL SUCCESS':d.complication?'COMPLICATION':d.success?'SUCCESS':'DELAY / RETRY';$('#diceOutcome').className=d.success?'good':'bad';d.r===20?sfx('critical'):d.success?sfx('success'):sfx('fail');await sleep(750);m.classList.remove('open');
}
