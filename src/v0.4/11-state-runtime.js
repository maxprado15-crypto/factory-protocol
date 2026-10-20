// ----------------------------- State ---------------------------------------
function savePrefs(){try{localStorage.setItem('fp-v04-avatar',state.avatar);localStorage.setItem('fp-v04-xp',String(state.xp));localStorage.setItem('fp-v04-completed',JSON.stringify(state.completedMissions));localStorage.setItem('fp-v04-ratings',JSON.stringify(state.bestRatings));localStorage.setItem('fp-v04-unlocked',JSON.stringify(state.unlockedCards));localStorage.setItem('fp-v04-deck',JSON.stringify(state.deck));localStorage.setItem('fp-v04-reputation',JSON.stringify(state.reputation||{safety:50,reliability:50,teamwork:50}))}catch(e){}}
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
  const sig=$('#signalState');if(sig){sig.textContent=active?m.statusFault:m.statusOk;sig.className=active?'signal-state':'signal-state active'}
}
function feedback(text,kind='info'){const el=$('#feedbackToast');el.textContent=text;el.className='feedback-toast show '+kind;clearTimeout(feedback.timer);feedback.timer=setTimeout(()=>el.classList.remove('show'),2400)}
function showBonus(amount){if(!amount)return;const b=$('#bonusFlash');b.textContent=`COMPREHENSION BONUS +${amount}`;b.classList.remove('play');void b.offsetWidth;b.classList.add('play')}
function hasTag(card,tags){return card.tags.includes('*')||card.tags.some(t=>tags.includes(t))}
function used(id){return state.used.includes(id)}

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
  Object.assign(state,{node:'briefing',englishBank:0,englishScore:0,decision:0,technical:0,complications:0,used:[],selected:null,xp:keepXp?xp:0,avatar,sound,currentMission,missionStarted:true,efficiency:100,safety:100,production:100,time:0,rewardPool:mission().baseReward,history:[],scoredNodes:new Set(),reviewNode:null,completed:false,completedMissions,bestRatings,unlockedCards,deck,reputation});
  configureMissionUI();setFault(true);setSceneMode('idle');renderNode();updateProfile();updateMetrics();
}
