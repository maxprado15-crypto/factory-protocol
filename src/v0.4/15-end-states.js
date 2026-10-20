// --------------------------- End states ------------------------------------
function starsFrom(v){return clamp(Math.round(v/20),1,5)}
function starText(n){return '★★★★★'.slice(0,n)+'☆☆☆☆☆'.slice(0,5-n)}
function gradeFrom(score){return score>=92?'S':score>=82?'A':score>=70?'B':score>=58?'C':score>=45?'D':'E'}
function performanceBonus(){let b=0;if(state.efficiency>=90)b+=15;if(state.safety>=95)b+=15;if(state.production>=90)b+=10;if(state.time<=18)b+=20;else if(state.time<=28)b+=10;return b}
function renderEnd(){
  if(state.completed)return;state.completed=true;setFault(false);setSceneMode('restart');sfx('success');
  const m=mission(),bonus=performanceBonus(),gained=Math.max(0,state.rewardPool+bonus),oldLevel=levelForXp(state.xp);state.xp+=gained;const newLevel=levelForXp(state.xp);
  const score=(state.efficiency+state.safety+state.production)/3,grade=gradeFrom(score);state.completedMissions[m.id]=true;
  const previous=state.bestRatings[m.id];if(!previous||gradeRank(grade)>gradeRank(previous))state.bestRatings[m.id]=grade;
  let newlyUnlocked=null;if(m.unlock&&!state.unlockedCards.includes(m.unlock)){state.unlockedCards.push(m.unlock);newlyUnlocked=m.unlock;if(state.deck.length<4)state.deck.push(m.unlock)}
  savePrefs();
  $('#actionArea').innerHTML=`<div class="result-grid performance-results"><div><span>EFFICIENCY</span><strong>${starText(starsFrom(state.efficiency))}</strong><em>${Math.round(state.efficiency)}/100</em></div><div><span>SAFETY</span><strong>${starText(starsFrom(state.safety))}</strong><em>${Math.round(state.safety)}/100</em></div><div><span>PRODUCTION</span><strong>${starText(starsFrom(state.production))}</strong><em>${Math.round(state.production)}/100</em></div><div><span>ENGLISH</span><strong>${state.englishScore}</strong><em>COMPREHENSION</em></div></div><div class="final-grade"><span>OVERALL RATING</span><strong>${grade}</strong><em>${state.time} min downtime · ${state.complications} complication(s)</em></div><div class="mission-reward"><small>MISSION REWARD</small><strong>+${gained} XP</strong><span>${bonus?`Includes +${bonus} performance bonus`:'No performance bonus'}</span></div>`;
  const path=document.createElement('button');path.className='action-button';path.innerHTML='<span class="action-num">LOG</span><span class="action-copy"><strong>VIEW DIAGNOSTIC PATH</strong><small>Review every decision and consequence.</small></span><span class="action-chevron">›</span>';path.onclick=openMissionLog;$('#actionArea').append(path);
  $('#actionArea').append(actionButton('RETURN TO CAMPAIGN','Choose another incident or change your field deck.',showCampaignHub,0));
  $('#actionArea').append(actionButton('REPLAY MISSION','Try to improve your rating and downtime.',()=>resetMission(true),1));
  setTimeout(()=>animateXpGain(gained,oldLevel,newLevel,newlyUnlocked),450);
}
function renderFailed(){
  setFault(true);setSceneMode(state.currentMission==='m2'?'thermal':'bypass');$('#actionArea').innerHTML=`<div class="failure-card"><small>SHIFT SUPERVISOR OVERRIDE</small><strong>MISSION FAILED</strong><p>Safety or production integrity fell below the acceptable threshold.</p><div><span>EFFICIENCY ${Math.round(state.efficiency)}</span><span>SAFETY ${Math.round(state.safety)}</span><span>PRODUCTION ${Math.round(state.production)}</span><span>${state.time} MIN</span></div><em>Historical XP was not removed, but this mission awards 0 XP.</em></div>`;
  const log=actionButton('VIEW DECISION LOG','See which choices produced the shutdown.',openMissionLog,0);const retry=actionButton('RESTART MISSION','Start again with the same technician progression.',()=>resetMission(true),1);const hub=actionButton('RETURN TO CAMPAIGN','Change mission or field deck.',showCampaignHub,2);$('#actionArea').append(log,retry,hub);state.rewardPool=0;updateMetrics();
}
async function animateXpGain(gained,oldLevel,newLevel,newlyUnlocked){
  updateProfile();sfx('xp');const toast=$('#rewardOverlay');toast.classList.add('open');$('#rewardXp').textContent='+'+gained+' XP';$('#rewardTitle').textContent=gained?'SHIFT COMPLETE':'NO XP AWARDED';await sleep(800);
  if(newLevel>oldLevel){
    $('#rewardTitle').textContent='LEVEL UP';$('#rewardXp').textContent=`LV.${newLevel}`;sfx('critical');updateProfile();await sleep(850);
    if(roleForLevel(newLevel)!==roleForLevel(oldLevel)){ $('#rewardTitle').textContent='PROMOTION';$('#rewardXp').textContent=roleForLevel(newLevel);sfx('success');await sleep(1000); }
  }
  if(newlyUnlocked){const card=cards.find(c=>c.id===newlyUnlocked);$('#unlockCard small').textContent='NEW CARD UNLOCKED';$('#unlockCard strong').textContent=card?.name||mission().unlockName;$('#unlockCard span').textContent=card?.desc||'New field tool available.';$('#unlockCard').classList.add('show');sfx('card');await sleep(1050)}
  toast.classList.remove('open');$('#unlockCard').classList.remove('show');
}
