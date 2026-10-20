const missions = {
  m1:{schemaVersion:'1.0',id:'m1',number:'001',title:'NO SIGNAL',area:'LINE 03',archetype:'TROUBLESHOOTING',description:'Restore Sensor S2 and return Line 03 to production.',technicalObjective:'Diagnose a missing photoelectric sensor signal.',englishFocus:'Maintenance logs · fault descriptions',recommendedLevel:1,npc:null,focus:'PHOTOELECTRIC SENSOR · S2',statusFault:'NO SIGNAL',statusOk:'ACTIVE',nodes:mission1Nodes,baseReward:200,unlock:'precision',unlockName:'PRECISION ALIGNMENT'},
  m2:{schemaVersion:'1.0',id:'m2',number:'002',title:'OVERCURRENT',area:'PACKAGING LINE',archetype:'TROUBLESHOOTING',description:'Diagnose Motor M3 overcurrent and protect the packaging line.',technicalObjective:'Separate electrical symptoms from mechanical overload.',englishFocus:'Measurements · cause and effect',recommendedLevel:1,npc:null,focus:'MOTOR DRIVE · M3',statusFault:'OVERCURRENT',statusOk:'CURRENT NORMAL',nodes:mission2Nodes,baseReward:220,unlock:'thermal',unlockName:'THERMAL TREND',requires:'m1'},
  m3:{schemaVersion:'1.0',id:'m3',number:'003',title:'FALSE TRIGGER',area:'PACKAGING CELL',archetype:'TROUBLESHOOTING + COMMUNICATION',description:'Find why Sensor S4 counts packages that are not present.',technicalObjective:'Diagnose optical interference and validate sensor calibration.',englishFocus:'Operator interview · inference · technical reporting',recommendedLevel:2,npc:'OPERATOR LENA',focus:'PHOTOELECTRIC SENSOR · S4',statusFault:'FALSE TRIGGER',statusOk:'COUNT STABLE',nodes:mission3Nodes,baseReward:240,unlock:'pressure',unlockName:'PORTABLE PRESSURE GAUGE',requires:'m2'},
  m4:{schemaVersion:'1.0',id:'m4',number:'004',title:'PRESSURE DROP',area:'ASSEMBLY CELL',archetype:'SAFETY + TROUBLESHOOTING',description:'Diagnose a slow pneumatic actuator and restore stable air pressure.',technicalObjective:'Locate a local pneumatic leak and repair it safely.',englishFocus:'Operator clues · safety language · maintenance reporting',recommendedLevel:2,npc:'OPERATOR MARCO',focus:'PNEUMATIC ACTUATOR · A4',statusFault:'LOW PRESSURE',statusOk:'PRESSURE STABLE',nodes:mission4Nodes,baseReward:250,unlock:'leakspray',unlockName:'LEAK DETECTION SPRAY',requires:'m3'}
};
let nodes = mission1Nodes;

const state = {
  node:'briefing', currentMission:'m1', englishBank:0, englishScore:0, decision:0, technical:0, complications:0,
  used:[], selected:null, xp:0, avatar:'male', sound:true, missionStarted:false,
  efficiency:100, safety:100, production:100, time:0, rewardPool:200,
  history:[], scoredNodes:new Set(), reviewNode:null, completed:false,
  completedMissions:{}, bestRatings:{}, unlockedCards:['multimeter','wiring','sensor','lockout','reroll','senior'],
  deck:['multimeter','wiring','sensor','lockout'],
  reputation:{safety:50,reliability:50,teamwork:50}
};

try {
  state.xp = parseInt(localStorage.getItem('fp-v04-xp') || localStorage.getItem('fp-v031-xp') || localStorage.getItem('fp-v03-xp') || localStorage.getItem('fp-v02-xp') || '0',10) || 0;
  state.avatar = localStorage.getItem('fp-v04-avatar') || localStorage.getItem('fp-v031-avatar') || localStorage.getItem('fp-v03-avatar') || localStorage.getItem('fp-v02-avatar') || 'male';
  state.sound = (localStorage.getItem('fp-v04-sound') || localStorage.getItem('fp-v031-sound') || localStorage.getItem('fp-v03-sound') || localStorage.getItem('fp-v02-sound')) !== 'off';
  state.completedMissions = JSON.parse(localStorage.getItem('fp-v04-completed') || localStorage.getItem('fp-v031-completed') || localStorage.getItem('fp-v03-completed') || '{}');
  state.bestRatings = JSON.parse(localStorage.getItem('fp-v04-ratings') || localStorage.getItem('fp-v031-ratings') || localStorage.getItem('fp-v03-ratings') || '{}');
  state.unlockedCards = JSON.parse(localStorage.getItem('fp-v04-unlocked') || localStorage.getItem('fp-v031-unlocked') || localStorage.getItem('fp-v03-unlocked') || '["multimeter","wiring","sensor","lockout","reroll","senior"]');
  state.deck = JSON.parse(localStorage.getItem('fp-v04-deck') || localStorage.getItem('fp-v031-deck') || localStorage.getItem('fp-v03-deck') || '["multimeter","wiring","sensor","lockout"]');
  state.reputation = JSON.parse(localStorage.getItem('fp-v04-reputation') || '{"safety":50,"reliability":50,"teamwork":50}');
} catch(e) {}

function mission(){ return missions[state.currentMission] || missions.m1; }
function missionUnlocked(id){ const m=missions[id]; return !m.requires || !!state.completedMissions[m.requires]; }
function cardUnlocked(id){ return state.unlockedCards.includes(id); }

const LEVEL_THRESHOLDS = [0,350,900,1600,2500,3500,4700,6100,7700,9500,11500,13750,16250,19000,22000];
const MAX_LEVEL = LEVEL_THRESHOLDS.length;
function levelForXp(xp){
  let level=1;
  for(let i=0;i<LEVEL_THRESHOLDS.length;i++){ if(xp>=LEVEL_THRESHOLDS[i]) level=i+1; else break; }
  return Math.min(level,MAX_LEVEL);
}
function roleForLevel(level){
  if(level<=2) return 'TRAINEE TECHNICIAN';
  if(level<=4) return 'JUNIOR TECHNICIAN';
  if(level<=7) return 'AUTOMATION TECHNICIAN';
  if(level<=10) return 'SENIOR TECHNICIAN';
  if(level<=14) return 'AUTOMATION SPECIALIST';
  return 'LEAD AUTOMATION SPECIALIST';
}
function levelTitle(level){ return roleForLevel(level); }
function currentThreshold(level){ return LEVEL_THRESHOLDS[Math.max(0,Math.min(level-1,LEVEL_THRESHOLDS.length-1))]; }
function nextThreshold(level){ return level>=MAX_LEVEL ? null : LEVEL_THRESHOLDS[level]; }
function visualTierForLevel(level){ return level<=2?1:level<=7?2:3; }
function avatarAsset(){
  const tier=visualTierForLevel(levelForXp(state.xp));
  if(state.avatar==='female') return tier===1?ASSETS.femaleL1:ASSETS.femaleL2;
  return tier===1?ASSETS.maleL1:tier===2?ASSETS.maleL2:ASSETS.maleL3;
}
