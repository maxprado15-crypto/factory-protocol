// -------------------------- Campaign hub ---------------------------------
function configureMissionUI(){
  const m=mission();nodes=m.nodes;
  const strips=$$('.mission-strip .strip-box');
  if(strips[0]){strips[0].querySelector('small').textContent=`MISSION ${m.number}`;strips[0].querySelector('strong').textContent=m.title}
  if(strips[1]){strips[1].querySelector('small').textContent='AREA';strips[1].querySelector('strong').textContent=m.area}
  const badge=$('.scene-badge small');if(badge)badge.textContent=m.focus;
  const lm=$('#logMissionLabel');if(lm)lm.textContent=`MISSION ${m.number}`;
  const sideRows=$$('.side-system .system-row');
  const labels={m1:['S1','S2'],m2:['VFD M3','MOTOR M3'],m3:['S3','S4'],m4:['AIR SUPPLY','ACTUATOR A4']}[state.currentMission]||['SYSTEM','FAULT'];
  if(sideRows[2]){sideRows[2].querySelector('span').textContent=labels[0];sideRows[2].querySelector('b').textContent='ONLINE'}
  if(sideRows[3]){sideRows[3].querySelector('span').textContent=labels[1]}
  const scene=$('#scene');['mission-m2','mission-m3','mission-m4'].forEach(c=>scene.classList.remove(c));scene.classList.add('mission-'+state.currentMission);
}
function gradeRank(g){return ({E:0,D:1,C:2,B:3,A:4,S:5})[g]??-1}
function renderCampaignHub(){
  const avatar=$('#campaignAvatar');if(avatar)avatar.src=avatarAsset();
  const campaignLevel=levelForXp(state.xp);$('#campaignRole').textContent=roleForLevel(campaignLevel);$('#campaignName').textContent=state.avatar==='female'?'MAYA SATO':'ALEX CHEN';$('#campaignXp').textContent=`LV.${campaignLevel} · ${state.xp} XP`;
  const mc=$('#missionCards');mc.innerHTML='';
  Object.values(missions).forEach(m=>{
    const unlocked=missionUnlocked(m.id),done=!!state.completedMissions[m.id],best=state.bestRatings[m.id]||'—';
    const el=document.createElement('article');el.className='mission-card '+(!unlocked?'locked':'')+(done?' completed':'');
    const req=m.requires?`COMPLETE MISSION ${missions[m.requires].number} TO UNLOCK`:'LOCKED';
    el.innerHTML=`<div class="mission-card-top"><span>MISSION ${m.number}</span><b>${done?'COMPLETE':unlocked?'AVAILABLE':'LOCKED'}</b></div><h2>${m.title}</h2><p>${m.description}</p>${m.npc?`<span class="npc-badge">NPC · ${m.npc}</span>`:''}<div class="mission-objectives"><b>${m.archetype}</b><br>${m.englishFocus}</div><div class="mission-meta"><span>AREA <strong>${m.area}</strong></span><span>BEST <strong>${best}</strong></span><span>REWARD <strong>${m.baseReward} XP+</strong></span></div><button ${unlocked?'':'disabled'}>${unlocked?(done?'REPLAY MISSION':'START MISSION'):req}</button>`;
    const b=el.querySelector('button');if(unlocked)b.onclick=()=>startMissionFromHub(m.id);mc.appendChild(el);
  });
  const db=$('#deckBuilder');db.innerHTML='';
  cards.filter(c=>cardUnlocked(c.id)).forEach(c=>{
    const el=document.createElement('button');el.className='deck-card '+c.type.toLowerCase()+(state.deck.includes(c.id)?' selected':'');el.style.setProperty('--card-img',`url("${c.image}")`);el.innerHTML=`<span>${c.type}</span><strong>${c.name}</strong><small>${c.desc}</small>`;el.onclick=()=>toggleDeckCard(c.id);db.appendChild(el);
  });
  $('#deckCount').textContent=`${state.deck.length} / 4`;
  const rep=state.reputation||{safety:50,reliability:50,teamwork:50};
  [['Safety','safety'],['Reliability','reliability'],['Teamwork','teamwork']].forEach(([cap,key])=>{const v=clamp(rep[key]??50,0,100);const t=$('#rep'+cap),b=$('#rep'+cap+'Bar');if(t)t.textContent=Math.round(v);if(b)b.style.width=v+'%'});
}
function toggleDeckCard(id){
  if(state.deck.includes(id)){if(state.deck.length<=1){feedback('Keep at least one card in the field deck.','danger');return}state.deck=state.deck.filter(x=>x!==id)}
  else {if(state.deck.length>=4){feedback('Field deck limit: 4 cards.','danger');return}state.deck.push(id)}
  savePrefs();sfx('card');renderCampaignHub();
}
function showCampaignHub(){
  state.missionStarted=false;$('#gameShell').classList.remove('visible');$('#campaignHub').classList.add('open');renderCampaignHub();updateProfile();
}
function startMissionFromHub(id){
  if(!missionUnlocked(id))return;state.currentMission=id;nodes=missions[id].nodes;$('#campaignHub').classList.remove('open');$('#gameShell').classList.add('visible');ensureAudio();startAmbience();sfx('alarm');resetMission(true);resizeCanvas();
}
