// -------------------------- Scene reactions --------------------------------
function setSceneMode(mode='idle'){
  const scene=$('#scene');
  [...scene.classList].filter(c=>c.startsWith('fx-')).forEach(c=>scene.classList.remove(c));
  scene.classList.add('fx-'+mode);
  const m1={idle:'FAULT SOURCE · S2',inspect:'SCANNING SENSOR S2',plc:'PLC RESTART SEQUENCE',motor:'MECHANICAL INTERVENTION',bypass:'SAFETY BYPASS ACTIVE',contain:'SAFETY CIRCUIT RESTORED',wiring:'24 VDC · WIRING TRACE',align:'ALIGNMENT TARGET',restart:'PRODUCTION RESTART',verify:'SIGNAL VERIFICATION'};
  const m2={idle:'FAULT SOURCE · M3',lockout:'ENERGY ISOLATION · M3',plc:'VFD RESET SEQUENCE',thermal:'M3 THERMAL WARNING',motor:'MOTOR INTERVENTION',mechanical:'MECHANICAL LOAD TRACE',restart:'M3 PRODUCTION RESTART',verify:'CURRENT STABILITY CHECK',contain:'THERMAL RISK CONTAINED'};
  const m3={idle:'FAULT SOURCE · S4',inspect:'S4 OPTICAL OBSERVATION',align:'OPTICAL PATH CALIBRATION',plc:'INPUT MODULE CHECK',bypass:'COUNT INTEGRITY WARNING',mechanical:'GUIDE GEOMETRY CHECK',verify:'PACKAGE COUNT VALIDATION',restart:'PACKAGING LINE RELEASE'};
  const m4={idle:'FAULT SOURCE · A4',inspect:'A4 CYCLE OBSERVATION',lockout:'PNEUMATIC ISOLATION · A4',verify:'PRESSURE MEASUREMENT',mechanical:'LEAK PATH INSPECTION',align:'TUBE / FITTING REPAIR',bypass:'PRESSURE SAFETY WARNING',plc:'CONTROL OUTPUT CHECK',motor:'UPSTREAM AIR SYSTEM',restart:'A4 FUNCTIONAL TEST'};
  const labels=({m1,m2,m3,m4})[state.currentMission]||m1;$('#sceneFxText').textContent=labels[mode]||`${mission().area} DIAGNOSTICS`;
}
function showConsequence({kicker='ACTION RESULT',title,body,impact={},kind='info',scene='idle'}){
  return new Promise(resolve=>{
    setSceneMode(scene);const panel=$('#sceneReaction');panel.className='scene-reaction open '+kind;$('#reactionKicker').textContent=kicker;$('#reactionTitle').textContent=title;$('#reactionBody').textContent=body;
    const wrap=$('#reactionImpact');wrap.innerHTML='';const parts=impactParts(impact);
    if(!parts.length){const chip=document.createElement('span');chip.className='impact-chip neutral';chip.textContent='NO PERFORMANCE PENALTY';wrap.append(chip)}
    parts.forEach(([name,val,suffix=''])=>{const chip=document.createElement('span');chip.className='impact-chip '+(val<0?'negative':'positive');chip.innerHTML=`<b>${name}</b> ${val>0?'+':''}${val}${suffix}`;wrap.append(chip)});
    const btn=$('#reactionContinue');btn.onclick=()=>{sfx('click');panel.classList.remove('open');setTimeout(resolve,180)};
    kind==='danger'||kind==='unsafe'?sfx('warning'):sfx('success');vibrate(kind==='danger'||kind==='unsafe'?[35,40,35]:[15,25,15]);
  });
}
