// -------------------------- Backtrack / log --------------------------------
function backtrack(){
  const choices=state.history.map((h,i)=>({...h,_i:i})).filter(h=>h.kind==='choice');if(!choices.length){feedback('No earlier decision point available.','info');return}
  backtrackTo(choices[choices.length-1].node, choices[choices.length-1]._i);
}
function backtrackTo(nodeId,historyIndex){
  if(!nodes[nodeId]||nodes[nodeId].type!=='choice')return;
  $('#missionLogModal')?.classList.remove('open');$('#reviewModal')?.classList.remove('open');
  const cost={efficiency:-4,time:3,xp:-3};applyImpact(cost,'Backtrack cost');
  record({kind:'backtrack',node:nodeId,label:'Returned to decision point',body:`Returned to ${nodes[nodeId].title}. Previous consequences remain.`,impact:cost,sourceIndex:historyIndex});
  if(state.node==='failed'){renderNode();return}
  state.node=nodeId;state.englishBank=0;state.decision=0;state.selected=null;setSceneMode('idle');renderNode();feedback('Backtracked. Previous penalties remain.','danger');
}
function openMissionLog(){
  const tl=$('#logTimeline');tl.innerHTML='';
  if(!state.history.length){tl.innerHTML='<div class="log-empty">No decisions recorded yet.</div>'}
  state.history.forEach((h,i)=>{
    const row=document.createElement('div');row.className='log-entry '+(h.kind||'');const impacts=impactParts(h.impact||{}).map(([n,v,s=''])=>`${n} ${v>0?'+':''}${v}${s}`).join(' · ');
    const canReview=h.node&&nodes[h.node];const canBacktrack=h.kind==='choice'&&h.node&&nodes[h.node]?.type==='choice';
    row.innerHTML=`<div class="log-index">${String(i+1).padStart(2,'0')}</div><div class="log-copy"><small>${h.time} MIN · ${(h.kind||'event').toUpperCase()}</small><strong>${h.label||''}</strong><p>${h.body||''}</p>${impacts?`<em>${impacts}</em>`:''}</div><div class="log-actions">${canReview?'<button class="review-entry">REVIEW</button>':''}${canBacktrack?'<button class="backtrack-entry">BACKTRACK HERE</button>':''}</div>`;
    const b=row.querySelector('.review-entry');if(b)b.onclick=()=>reviewScreen(h.node);const bt=row.querySelector('.backtrack-entry');if(bt)bt.onclick=()=>backtrackTo(h.node,i);tl.append(row);
  });
  $('#missionLogModal').classList.add('open');
}
function reviewScreen(nodeId){
  const n=nodes[nodeId];if(!n)return;$('#missionLogModal').classList.remove('open');$('#reviewTitle').textContent=n.title;$('#reviewBody').textContent=n.body;const wrap=$('#reviewChoices');wrap.innerHTML='';
  if(n.type==='choice')n.opts.forEach(o=>{const d=document.createElement('div');d.className='review-choice';d.innerHTML=`<strong>${o.label}</strong><span>${o.sub}</span>`;wrap.append(d)});
  else if(n.type==='quiz')n.opts.forEach((o,i)=>{const d=document.createElement('div');d.className='review-choice';d.innerHTML=`<strong>${String.fromCharCode(65+i)}. ${o[0]}</strong>`;wrap.append(d)});
  else {const d=document.createElement('div');d.className='review-choice';d.innerHTML=`<strong>${n.kicker}</strong><span>${n.body}</span>`;wrap.append(d)}
  $('#reviewModal').classList.add('open');
}
