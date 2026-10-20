'use strict';

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const clamp = (v,min,max) => Math.min(max,Math.max(min,v));
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const ASSETS = window.FP_ASSETS || {};

const cards = [
  {id:'multimeter', name:'MULTIMETER', type:'EQUIPMENT', image:ASSETS.cardMultimeter, bonus:2, tags:['electrical','signal'], desc:'+2 on electrical or signal checks.'},
  {id:'wiring', name:'WIRING DIAGRAM', type:'REFERENCE', image:ASSETS.cardWiring, bonus:2, tags:['wiring','signal'], desc:'+2 on wiring or signal-path checks.'},
  {id:'sensor', name:'SENSOR DATASHEET', type:'REFERENCE', image:ASSETS.cardDatasheet, bonus:2, tags:['sensor','mechanical'], desc:'+2 when diagnosing a sensor.'},
  {id:'lockout', name:'LOCKOUT KIT', type:'SAFETY', image:ASSETS.lockout, bonus:2, tags:['safety'], desc:'+2 on safety checks.'},
  {id:'reroll', name:'SECOND CHECK', type:'SKILL', image:ASSETS.cardSecond, bonus:0, tags:['*'], reroll:true, desc:'Roll two D20s and keep the higher result.'},
  {id:'senior', name:'ASK THE SENIOR TECH', type:'SUPPORT', image:ASSETS.cardSecond, bonus:1, tags:['*'], hint:true, timeCost:5, desc:'Reveal a useful clue. Costs +5 min.'},
  {id:'precision', name:'PRECISION ALIGNMENT', type:'SKILL', image:ASSETS.cardDatasheet, bonus:2, tags:['mechanical','sensor','alignment'], unlock:'m1', desc:'+2 on alignment, calibration and mechanical-position checks.'},
  {id:'thermal', name:'THERMAL TREND', type:'REFERENCE', image:ASSETS.cardWiring, bonus:2, tags:['electrical','mechanical','overcurrent'], unlock:'m2', desc:'+2 when interpreting current, load or thermal trends.'},
  {id:'pressure', name:'PORTABLE PRESSURE GAUGE', type:'EQUIPMENT', image:ASSETS.cardMultimeter, bonus:2, tags:['pneumatic','pressure','leak'], unlock:'m3', desc:'+2 on pneumatic pressure and leak diagnostics.'},
  {id:'leakspray', name:'LEAK DETECTION SPRAY', type:'EQUIPMENT', image:ASSETS.lockout, bonus:2, tags:['pneumatic','leak'], unlock:'m4', desc:'+2 when locating compressed-air leaks.'}
];
