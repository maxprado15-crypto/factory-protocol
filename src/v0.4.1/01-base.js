'use strict';

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const clamp = (v,min,max) => Math.min(max,Math.max(min,v));
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const ASSETS = window.FP_ASSETS || {};

const cards = [
  {id:'multimeter', name:'MULTIMETER', type:'EQUIPMENT', image:ASSETS.cardMultimeter, bonus:1, difficultyMod:-2, maxUses:3, tags:['electrical','signal'], desc:'3 uses · measures voltage/current and reduces electrical or signal check difficulty.', effect:'MEASUREMENT · target difficulty −2'},
  {id:'wiring', name:'WIRING DIAGRAM', type:'REFERENCE', image:ASSETS.cardWiring, bonus:1, difficultyMod:-2, maxUses:3, tags:['wiring','signal','electrical'], desc:'3 consultations · narrows the signal path and reduces wiring/electrical check difficulty.', effect:'REFERENCE · target difficulty −2'},
  {id:'sensor', name:'SENSOR DATASHEET', type:'REFERENCE', image:ASSETS.cardDatasheet, bonus:1, difficultyMod:-2, maxUses:3, tags:['sensor','mechanical','alignment','optical'], desc:'3 consultations · reveals operating limits and sensor setup evidence.', effect:'SPECIFICATION · target difficulty −2'},
  {id:'lockout', name:'LOCKOUT KIT', type:'SAFETY', image:ASSETS.lockout, bonus:2, difficultyMod:-1, maxUses:2, tags:['safety','electrical','mechanical','pneumatic'], desc:'2 uses · confirms safe isolation and improves hazardous diagnostic checks.', effect:'SAFETY CONTROL · +2 and target difficulty −1'},
  {id:'reroll', name:'SECOND CHECK', type:'SKILL', image:ASSETS.cardSecond, bonus:0, difficultyMod:0, maxUses:2, tags:['*'], reroll:true, desc:'2 uses · roll two D20s and keep the higher result.', effect:'SKILL · roll 2D20, keep highest'},
  {id:'senior', name:'ASK THE SENIOR TECH', type:'SUPPORT', image:ASSETS.cardSecond, bonus:1, difficultyMod:-1, maxUses:2, tags:['*'], hint:true, timeCost:5, desc:'2 uses · reveals a targeted clue and reduces difficulty. Costs +5 min.', effect:'SUPPORT · clue + target difficulty −1 · +5 min'},
  {id:'precision', name:'PRECISION ALIGNMENT', type:'SKILL', image:ASSETS.cardDatasheet, bonus:2, difficultyMod:-2, maxUses:2, tags:['mechanical','sensor','alignment','optical'], unlock:'m1', desc:'2 uses · precise setup for alignment/calibration checks.', effect:'PRECISION · +2 and target difficulty −2'},
  {id:'thermal', name:'THERMAL TREND', type:'REFERENCE', image:ASSETS.cardWiring, bonus:1, difficultyMod:-2, maxUses:3, tags:['electrical','mechanical','overcurrent'], unlock:'m2', desc:'3 consultations · correlates load, current and temperature trends.', effect:'TREND ANALYSIS · target difficulty −2'},
  {id:'pressure', name:'PORTABLE PRESSURE GAUGE', type:'EQUIPMENT', image:ASSETS.cardMultimeter, bonus:1, difficultyMod:-3, maxUses:3, tags:['pneumatic','pressure','leak'], unlock:'m3', desc:'3 uses · produces a pressure reading and strongly improves pneumatic diagnosis.', effect:'LIVE PRESSURE · target difficulty −3'},
  {id:'leakspray', name:'LEAK DETECTION SPRAY', type:'EQUIPMENT', image:ASSETS.lockout, bonus:1, difficultyMod:-3, maxUses:2, tags:['pneumatic','leak'], unlock:'m4', desc:'2 uses · localizes small compressed-air leaks.', effect:'LEAK LOCALIZATION · target difficulty −3'}
];

const SCENE_PROFILES = {
  m1:{asset:'scenes/m1-sensor.svg',accent:'sensor',beacon:'S2'},
  m2:{asset:'scenes/m2-motor.svg',accent:'motor',beacon:'M3'},
  m3:{asset:'scenes/m3-optical.svg',accent:'optical',beacon:'S4'},
  m4:{asset:'scenes/m4-pneumatic.svg',accent:'pneumatic',beacon:'A4'}
};
