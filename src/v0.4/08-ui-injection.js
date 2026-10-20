// --------------------------- UI injection ----------------------------------
function injectV03UI(){
  const controls=$('.top-controls');
  const campaign=document.createElement('button');campaign.id='campaignBtn';campaign.textContent='CAMPAIGN';campaign.title='Return to mission selection.';
  const back=document.createElement('button');back.id='backtrackBtn';back.textContent='BACKTRACK';back.title='Return to the last decision point. Consequences remain.';
  const log=document.createElement('button');log.id='missionLogBtn';log.textContent='MISSION LOG';
  controls.prepend(log);controls.prepend(back);controls.prepend(campaign);

  const missionStrip=$('.mission-strip');
  const perf=document.createElement('div');perf.className='performance-strip';perf.innerHTML=`
    <div class="perf-box efficiency"><small>EFFICIENCY</small><strong id="metricEfficiency">100</strong><span><i id="barEfficiency"></i></span></div>
    <div class="perf-box safety"><small>SAFETY</small><strong id="metricSafety">100</strong><span><i id="barSafety"></i></span></div>
    <div class="perf-box production"><small>PRODUCTION</small><strong id="metricProduction">100</strong><span><i id="barProduction"></i></span></div>
    <div class="perf-box time"><small>DOWNTIME</small><strong id="metricTime">0 MIN</strong><em>SHIFT CLOCK</em></div>
    <div class="perf-box potential"><small>MISSION XP</small><strong id="metricReward">200</strong><em>POTENTIAL</em></div>`;
  missionStrip.parentNode.insertBefore(perf,missionStrip.nextSibling);

  const scene=$('#scene');
  const fx=document.createElement('div');fx.id='sceneFx';fx.className='scene-fx';fx.innerHTML='<div id="sceneFxText" class="scene-fx-text">FAULT SOURCE · S2</div><div class="sensor-ring"></div><div class="wire-flow"></div><div class="hazard-layer"></div>';
  scene.appendChild(fx);
  const reaction=document.createElement('div');reaction.id='sceneReaction';reaction.className='scene-reaction';reaction.innerHTML=`<div class="reaction-head"><span id="reactionKicker">ACTION RESULT</span><strong id="reactionTitle">RESULT</strong></div><p id="reactionBody"></p><div id="reactionImpact" class="reaction-impact"></div><button id="reactionContinue">CONTINUE</button>`;
  scene.appendChild(reaction);

  const logModal=document.createElement('div');logModal.id='missionLogModal';logModal.className='log-modal';logModal.innerHTML=`<div class="log-box"><div class="log-top"><div><small id="logMissionLabel">MISSION 001</small><h2>DECISION LOG</h2></div><button id="closeLog">CLOSE</button></div><p class="log-help">Reviewing the log is free. BACKTRACK returns to a previous decision, but time and penalties remain.</p><div id="logTimeline" class="log-timeline"></div></div>`;document.body.appendChild(logModal);

  const reviewModal=document.createElement('div');reviewModal.id='reviewModal';reviewModal.className='review-modal';reviewModal.innerHTML=`<div class="review-box"><small>REVIEW MODE · NO CONSEQUENCES CHANGED</small><h2 id="reviewTitle"></h2><p id="reviewBody"></p><div id="reviewChoices"></div><button id="closeReview">RETURN TO CURRENT STATE</button></div>`;document.body.appendChild(reviewModal);

  const hub=document.createElement('div');hub.id='campaignHub';hub.className='campaign-hub';hub.innerHTML=`<div class="campaign-shell"><div class="campaign-header"><div><small>FACTORY PROTOCOL · CAMPAIGN</small><h1>SHIFT CONTROL</h1><p>Choose an incident, prepare a four-card field deck, then start the diagnostic shift.</p></div><div class="campaign-tech"><img id="campaignAvatar"><div><small id="campaignRole"></small><strong id="campaignName"></strong><span id="campaignXp"></span></div></div></div><div class="campaign-grid"><section><div class="hub-section-title"><span>AVAILABLE MISSIONS</span><small>PERFORMANCE PERSISTS BETWEEN SHIFTS</small></div><div id="missionCards" class="mission-cards"></div></section><section><div class="hub-section-title"><span>FIELD DECK · 4 CARDS</span><small>UNLOCK NEW CARDS BY COMPLETING MISSIONS</small></div><div id="deckBuilder" class="deck-builder"></div><div class="deck-counter"><span>SELECTED</span><strong id="deckCount">0 / 4</strong></div><div class="reputation-panel"><div class="hub-section-title"><span>CAREER REPUTATION</span><small>DECISIONS PERSIST BETWEEN SHIFTS</small></div><div class="rep-grid"><div class="rep-box"><small>SAFETY</small><strong id="repSafety">50</strong><div class="rep-bar"><i id="repSafetyBar"></i></div></div><div class="rep-box"><small>RELIABILITY</small><strong id="repReliability">50</strong><div class="rep-bar"><i id="repReliabilityBar"></i></div></div><div class="rep-box"><small>TEAMWORK</small><strong id="repTeamwork">50</strong><div class="rep-bar"><i id="repTeamworkBar"></i></div></div></div></div></section></div></div>`;document.body.appendChild(hub);

  $('#campaignBtn').onclick=()=>{if(confirm('Return to campaign? Current mission progress will be abandoned.'))showCampaignHub();};
  $('#backtrackBtn').onclick=backtrack;
  $('#missionLogBtn').onclick=openMissionLog;
  $('#closeLog').onclick=()=>$('#missionLogModal').classList.remove('open');
  $('#missionLogModal').onclick=e=>{if(e.target.id==='missionLogModal')e.currentTarget.classList.remove('open')};
  $('#closeReview').onclick=()=>$('#reviewModal').classList.remove('open');
  $('#reactionContinue').onclick=()=>{};
}
