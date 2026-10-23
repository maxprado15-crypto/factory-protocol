function renderCheck(n){
  const selected=selectedCard(n),target=cardDifficulty(selected,n);
  const check=document.createElement('div');check.className='check-grid';check.innerHTML=`<div><small>ATTRIBUTE</small><strong>+${n.attr}</strong></div><div><small>TARGET</small><strong>${selected&&target!==n.diff?`${n.diff} → ${target}`:n.diff}</strong></div><div><small>ENGLISH</small><strong>+${state.englishBank}</strong></div><div><small>DECISION</small><strong>${state.decision>=0?'+':''}${state.decision}</strong></div>`;$('#actionArea').append(check);
  const tip=document.createElement('div');tip.className='check-tip';tip.textContent='VISUAL INSPECTION ONLY · Observe or infer without instruments. Existing HMI/log values remain readable. Resource evidence is revealed only after spending a charge.';$('#actionArea').append(tip);
  const status=document.createElement('div');status.className='tool-status';
  const heading=document.createElement('strong');heading.textContent=selected&&n.toolEvidence?.[selected.id]?'MEASUREMENT AVAILABLE · Use '+selected.name:'VISUAL INSPECTION ONLY';status.append(heading);
  Object.keys(n.toolEvidence||{}).forEach(id=>{
    const card=cards.find(c=>c.id===id),available=canUseTool(id,n);
    const b=document.createElement('button');b.disabled=!available;
    b.textContent=(available?'MEASUREMENT AVAILABLE':'TOOL REQUIRED')+' · '+card.name+' · '+TOOL_RULES[id]+(available?` · ${chargeRemaining(id)} uses remain`:!cardUnlocked(id)?' · not unlocked':!state.deck.includes(id)?' · not in field deck':' · no uses remaining');
    b.onclick=()=>{state.selected=state.selected===id?null:id;renderNode()};status.append(b);
  });$('#actionArea').append(status);
  if(selected){const intel=document.createElement('div');intel.className='card-effect-panel';intel.innerHTML=`<small>CARD EFFECT · ${chargeRemaining(selected.id)} USES REMAIN</small><strong>${selected.effect||selected.desc}</strong><p>Evidence pending. Roll to use this card and spend one charge.</p>`;$('#actionArea').append(intel)}
  cards.filter(c=>state.deck.includes(c.id)&&cardUnlocked(c.id)&&!used(c.id)&&(n.toolEvidence?.[c.id]||hasTag(c,n.tags))).forEach(c=>$('#cardShelf').append(renderCard(c,n)));
  const roll=document.createElement('button');roll.className='roll-button';roll.disabled=!!state.rolling;
  roll.innerHTML='<span class="die-mini">20</span><span><strong>ROLL D20</strong><small>'+(selected?'Use '+selected.name+' · spend 1 charge':n.manualNext?'Visual / manual route · additional investigation and downtime':'Visual / HMI observation · no instrument reading')+'</small></span>';
  roll.onclick=()=>{sfx('select');vibrate(18);performRoll(n)};$('#actionArea').append(roll);
}
function renderCard(card,n){
  const left=chargeRemaining(card.id),max=card.maxUses||1;
  const el=document.createElement('button');el.className='tool-card '+card.type.toLowerCase()+(state.selected===card.id?' selected':'');el.style.setProperty('--card-img',`url("${card.image}")`);el.innerHTML=`<span class="card-type">${card.type}</span><span class="card-charge">${left}/${max}</span><span class="card-info"><strong>${card.name}</strong><small>${card.effect||card.desc}</small></span>`;
  el.onclick=()=>{if(state.rolling)return;sfx('card');vibrate(10);state.selected=state.selected===card.id?null:card.id;renderNode()};return el;
}
