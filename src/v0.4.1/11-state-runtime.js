// ----------------------------- State ---------------------------------------
function savePrefs(){try{localStorage.setItem('fp-v041-avatar',state.avatar);localStorage.setItem('fp-v041-xp',String(state.xp));localStorage.setItem('fp-v041-completed',JSON.stringify(state.completedMissions));localStorage.setItem('fp-v041-ratings',JSON.stringify(state.bestRatings));localStorage.setItem('fp-v041-unlocked',JSON.stringify(state.unlockedCards));localStorage.setItem('fp-v041-deck',JSON.stringify(state.deck));localStorage.setItem('fp-v041-reputation',JSON.stringify(state.reputation||{safety:50,reliability:50,teamwork:50}))}catch(e){}}
function vibrate(pattern){try{navigator.vibrate&&navigator.vibrate(pattern)}catch(e){}}
function updateProfile(){
  const level=levelForXp(state.xp),next=nextThreshold(level),prev=currentThreshold(level);
  const pct=next===null?100:clamp(((state.xp-prev)/(next-prev))*100,0,100);
  const tier=visualTierForLevel(level);
  $('#profileImage').src=avatarAsset();$('#profileImage').className='profile-image level-'+tier+(state.avatar==='female'?' female':' male');$('#profileRole').textContent=roleForLevel(level);$('#profileLevel').textContent='LV.'+level;$('#xpText').textContent=next===null?`${state.xp} XP · MAX RANK`:`${state.xp} / ${next} XP`;$('#xpFill').style.width=pct+'%';$('#avatarName').textContent=state.avatar==='female'?'MAYA SATO':'ALEX CHEN';
}
function updateMetrics(){
  const vals=[['Efficiency',state.efficiency],['Safety',state.safety],['Production',state.production]];
  vals.forEach(([n,v])=>{const txt=$('#metric'+n),bar=$('#bar'+n);if(txt)txt.textContent=Math.round(v);if(bar)bar.style.width=clamp(v,0,100)+'%'});
  if($('#metricTime'))$('#metricTime').textContent=`${state.time} MIN`;
  if($('#metricReward'))$('#metricReward').textContent=Math.max(0,state.rewardPool);
  if($('#backtrackBtn'))$('#backtrackBtn').disabled=!state.history.some(h=>h.kind==='choice');
}
function setFault(active){
  const m=mission();$('#productionStatus').textContent=active?'STOPPED':'RUNNING';$('#productionStatusBox').classList.toggle('running',!active);
  const side=$('#s2Side');if(side){side.textContent=active?'FAULT':'OK';side.style.color=active?'var(--red)':'var(--green)'}
  $('#sensorBeacon').classList.toggle('repaired',!active);$('#scene').classList.toggle('running',!active);const sc=$('#scene');['mission-m1','mission-m2','mission-m3','mission-m4'].forEach(c=>sc.classList.remove(c));sc.classList.add('mission-'+state.currentMission);
  const profile=SCENE_PROFILES[state.currentMission]||SCENE_PROFILES.m1;const bg=$('.factory-bg',sc);if(bg)bg.style.backgroundImage=`url("${profile.asset}")`;
  const sig=$('#signalState');if(sig){sig.textContent=active?m.statusFault:m.statusOk;sig.className=active?'signal-state':'signal-state active'}
}
function feedback(text,kind='info'){const el=$('#feedbackToast');el.textContent=text;el.className='feedback-toast show '+kind;clearTimeout(feedback.timer);feedback.timer=setTimeout(()=>el.classList.remove('show'),2400)}
function showBonus(amount){if(!amount)return;const b=$('#bonusFlash');b.textContent=`COMPREHENSION BONUS +${amount}`;b.classList.remove('play');void b.offsetWidth;b.classList.add('play')}
function hasTag(card,tags){return card.tags.includes('*')||card.tags.some(t=>tags.includes(t))}
function cardMaxUses(id){const c=cards.find(x=>x.id===id);return c?.maxUses||1}
function chargeRemaining(id){return state.cardCharges?.[id]??cardMaxUses(id)}
function used(id){return chargeRemaining(id)<=0}
function initializeCardCharges(){state.cardCharges={};state.deck.forEach(id=>{state.cardCharges[id]=cardMaxUses(id)});state.used=[]}
function consumeCard(card){
  if(!card)return;
  if(!state.cardCharges)initializeCardCharges();
  const left=Math.max(0,chargeRemaining(card.id)-1);
  state.cardCharges[card.id]=left;
  if(left<=0&&!state.used.includes(card.id))state.used.push(card.id);
  record({kind:'card',node:state.node,label:`${card.name} used`,body:`${left} of ${card.maxUses||1} uses remain.`});
}
function cardEvidence(card,n){
  if(!card)return '';
  if(card.id==='senior')return n.hint||'Senior technician recommends validating the strongest evidence before replacing components.';
  const key=`${state.currentMission}:${state.node}:${card.id}`;
  const evidence={
    'm1:check1:multimeter':'MEASUREMENT: 24 VDC supply is present at S2. The fault is not a missing supply.',
    'm1:check1:wiring':'SCHEMATIC TRACE: S2 signal wiring reaches the PLC input with no open circuit.',
    'm1:check1:sensor':'DATASHEET: S2 requires the target to cross the sensing axis within its specified alignment window.',
    'm1:check2:sensor':'DATASHEET: current mounting angle is outside the recommended target geometry.',
    'm1:check2:precision':'ALIGNMENT TOOL: target centerline is visibly offset from S2.',
    'm1:check3:multimeter':'MEASUREMENT: S2 output remains electrically stable through repeated target passes.',
    'm2:check1:multimeter':'MEASUREMENT: phase supply is balanced. Current rises primarily when mechanical load is applied.',
    'm2:check1:thermal':'TREND: current and temperature climb together under load, pointing away from a simple supply fault.',
    'm2:check1:lockout':'ISOLATION: M3 is electrically isolated and verified safe for mechanical inspection.',
    'm2:check2:precision':'MECHANICAL CHECK: roller resistance is concentrated at one guide position.',
    'm2:check3:thermal':'TREND: loaded current returns to the normal band after the obstruction is removed.',
    'm2:check3:multimeter':'MEASUREMENT: loaded current is stable with no phase imbalance.',
    'm3:check1:sensor':'DATASHEET: reflective targets can create false returns when the sensor is mounted at a shallow angle.',
    'm3:check1:precision':'OPTICAL ALIGNMENT: reflected light returns toward the receiver only with the silver wrapper.',
    'm3:check2:sensor':'DATASHEET: background suppression can reject the reflective guard while retaining package detection.',
    'm3:check2:precision':'CALIBRATION: the new angle separates package detection from the unwanted reflective return.',
    'm4:check1:pressure':'LIVE PRESSURE: header stays near 6.0 bar while the A4 branch falls near 4.1 bar during extension.',
    'm4:check1:lockout':'ISOLATION: pneumatic energy is isolated and residual pressure is safely released before inspection.',
    'm4:check2:pressure':'MEASUREMENT: pressure loss occurs locally near the cylinder, not at the plant header.',
    'm4:check2:leakspray':'LEAK TEST: bubbles form at the flexible tube beside the A4 fitting, localizing the escape point.',
    'm4:check3:pressure':'LIVE PRESSURE: A4 branch pressure now remains stable throughout repeated extension cycles.',
    'm4:check3:leakspray':'LEAK TEST: no bubble formation appears after repair during the loaded cycle.'
  };
  return evidence[key]||`${card.name}: contextual evidence supports this diagnostic path.`;
}
function cardDifficulty(card,n){return Math.max(5,n.diff+(card?.difficultyMod||0))}

function record(entry){state.history.push({time:state.time,...entry});}
function impactParts(impact={}){
  const parts=[];
  if(impact.efficiency)parts.push(['EFFICIENCY',impact.efficiency]);
  if(impact.safety)parts.push(['SAFETY',impact.safety]);
  if(impact.production)parts.push(['PRODUCTION',impact.production]);
  if(impact.time)parts.push(['TIME',impact.time,'min']);
  if(impact.xp)parts.push(['MISSION XP',impact.xp]);
  if(impact.repSafety)parts.push(['SAFETY REP',impact.repSafety]);
  if(impact.repReliability)parts.push(['RELIABILITY REP',impact.repReliability]);
  if(impact.repTeamwork)parts.push(['TEAMWORK REP',impact.repTeamwork]);
  return parts;
}
function applyImpact(impact={},reason=''){
  state.efficiency=clamp(state.efficiency+(impact.efficiency||0),0,100);
  state.safety=clamp(state.safety+(impact.safety||0),0,100);
  state.production=clamp(state.production+(impact.production||0),0,100);
  state.time=Math.max(0,state.time+(impact.time||0));
  state.rewardPool=Math.max(0,state.rewardPool+(impact.xp||0));
  state.reputation=state.reputation||{safety:50,reliability:50,teamwork:50};
  if(impact.repSafety)state.reputation.safety=clamp(state.reputation.safety+impact.repSafety,0,100);
  if(impact.repReliability)state.reputation.reliability=clamp(state.reputation.reliability+impact.repReliability,0,100);
  if(impact.repTeamwork)state.reputation.teamwork=clamp(state.reputation.teamwork+impact.repTeamwork,0,100);
  if(impact.repSafety||impact.repReliability||impact.repTeamwork)savePrefs();
  updateMetrics();
  if(reason&&impactParts(impact).length) record({kind:'impact',label:reason,impact});
  checkFailureCondition();
}
function checkFailureCondition(){
  if(state.safety<=20||state.production<=20){state.node='failed';return true}
  return false;
}
function resetMission(keepXp=true){
  const xp=state.xp,avatar=state.avatar,sound=state.sound,currentMission=state.currentMission,completedMissions=state.completedMissions,bestRatings=state.bestRatings,unlockedCards=state.unlockedCards,deck=state.deck,reputation=state.reputation;
  nodes=mission().nodes;
  Object.assign(state,{node:'briefing',englishBank:0,englishScore:0,decision:0,technical:0,complications:0,used:[],cardCharges:{},selected:null,xp:keepXp?xp:0,avatar,sound,currentMission,missionStarted:true,efficiency:100,safety:100,production:100,time:0,rewardPool:mission().baseReward,history:[],scoredNodes:new Set(),reviewNode:null,completed:false,completedMissions,bestRatings,unlockedCards,deck,reputation});
  initializeCardCharges();configureMissionUI();setFault(true);setSceneMode('idle');renderNode();updateProfile();updateMetrics();
}
