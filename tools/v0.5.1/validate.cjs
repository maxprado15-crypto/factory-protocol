const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const file=path.resolve(__dirname,'../../releases/v0.5.1/factory-protocol-v0.5.1-standalone.html');
 await page.goto('file:///'+file.replaceAll('\\','/'));await page.waitForFunction(()=>document.querySelector('#campaignHub'));
 const report=await page.evaluate(async()=>{
  const checks=[],ok=(v,m)=>{if(!v)throw Error(m);checks.push(m)};
  const oldDice=showDiceModal,oldConsequence=showConsequence,oldRender=renderNode;
  showDiceModal=async()=>{};showConsequence=async()=>{};sfx=()=>{};
  const stats=[];
  for(const m of Object.values(missions)){
   for(const [id,n] of Object.entries(m.nodes)){
    for(const next of [n.next,n.manualNext,...(n.type==='choice'?n.opts.map(o=>o.next):[])].filter(Boolean))ok(!!m.nodes[next],`${m.id}:${id} -> ${next}`);
    if(n.type==='check'){
     ok(!!n.success&&!!n.fail,`${m.id}:${id} success/failure text`);
     for(const tool of Object.keys(n.toolEvidence||{}))ok(!!TOOL_RULES[tool]&&cards.some(c=>c.id===tool),`${m.id}:${id} valid tool ${tool}`);
    }
   }
   const seen=new Set(),walk=id=>{if(seen.has(id))return;seen.add(id);const n=m.nodes[id];for(const next of [n.type==='check'?n.manualNext||n.next:n.next,...(n.type==='choice'?n.opts.filter(o=>o.quality==='good').map(o=>o.next):[])].filter(Boolean))walk(next)};walk('briefing');
   ok(seen.has('end'),`${m.id} zero-card route reaches completion`);stats.push({mission:m.id,nodes:Object.keys(m.nodes).length,checks:Object.values(m.nodes).filter(n=>n.type==='check').length,manualNodes:Object.keys(m.nodes).filter(id=>id.startsWith('manual')).length});
  }
  state.sound=false;state.unlockedCards=cards.map(c=>c.id);state.completedMissions=Object.fromEntries(Object.keys(missions).map(id=>[id,true]));
  for(let count=0;count<=4;count++){
   state.deck=cards.slice(0,count).map(c=>c.id);renderCampaignHub();
   ok([...document.querySelectorAll('.mission-card button')].every(b=>!b.disabled),`${count} cards: START MISSION enabled`);
   ok(document.querySelector('#loadoutWarning').textContent.includes('LIMITED LOADOUT')===(count<4),`${count} cards: loadout warning`);
   startMissionFromHub('m1');ok(state.missionStarted&&state.deck.length===count,`${count} cards: start accepted`);
  }
  state.deck=['multimeter'];toggleDeckCard('multimeter');ok(state.deck.length===0,'Last card can be removed');
  state.deck=cards.slice(0,4).map(c=>c.id);toggleDeckCard('reroll');ok(state.deck.length===4,'Fifth card rejected');
  // Check all required resources absent, exhausted, locked, in deck but unselected, selected and used.
  renderNode=()=>{};
  let uses=0,blocked=0;
  for(const m of Object.values(missions))for(const [id,n] of Object.entries(m.nodes).filter(([id,n])=>n.type==='check')){
   for(const [tool,evidence] of Object.entries(n.toolEvidence||{})){
    for(const mode of ['absent','exhausted','locked','unselected','used']){
     state.currentMission=m.id;nodes=m.nodes;state.node=id;state.history=[];state.scoredNodes=new Set();state.completed=false;state.rolling=false;state.rewardPool=300;state.safety=100;state.production=100;state.efficiency=100;state.time=0;state.englishBank=0;state.decision=0;
     state.unlockedCards=mode==='locked'?cards.filter(c=>c.id!==tool).map(c=>c.id):cards.map(c=>c.id);
     state.deck=mode==='absent'?[]:[tool];state.cardCharges={[tool]:mode==='exhausted'?0:cardMaxUses(tool)};state.selected=mode==='unselected'?null:tool;
     const before=chargeRemaining(tool);await performRoll(n);
     const text=state.history.map(h=>h.body).join(' ');
     if(mode==='used'){ok(text.includes(evidence),`${m.id}:${id}:${tool} evidence after use`);ok(chargeRemaining(tool)===before-1,`${m.id}:${id}:${tool} consumes exactly one charge`);uses++;}
     else{ok(!text.includes(evidence),`${m.id}:${id}:${tool}:${mode} no evidence leak`);ok(chargeRemaining(tool)===before,`${m.id}:${id}:${tool}:${mode} no charge spent`);blocked++;}
    }
   }
  }
  // Run each actual zero-card mission path through choices, quizzes and D20 checks.
  let playthroughs=0;
  animateXpGain=async()=>{};renderNode=()=>{};
  for(const m of Object.values(missions)){
   state.currentMission=m.id;nodes=m.nodes;state.deck=[];state.xp=1000;resetMission(true);let steps=0;
   while(nodes[state.node].type!=='end'&&steps++<50){const n=nodes[state.node];if(n.type==='choice')await handleChoice(n,n.opts.find(o=>o.quality==='good'),0);else if(n.type==='quiz')await handleQuiz(n,n.opts[n.correct],n.correct);else if(n.type==='check')await performRoll(n);else throw Error(`Unexpected terminal ${m.id}:${state.node}`)}
   ok(nodes[state.node].type==='end',`${m.id} actual zero-card playthrough completes`);ok(state.xp===1000,`${m.id} career XP preserved during mission`);renderEnd();ok(state.deck.length===0,`${m.id} unlock does not auto-fill deck`);playthroughs++;
  }
  // Preview cannot reveal measurements before charge consumption.
  renderNode=oldRender;state.currentMission='m6';nodes=mission6Nodes;state.node='check1';state.deck=['multimeter'];state.unlockedCards=cards.map(c=>c.id);initializeCardCharges();state.selected='multimeter';renderNode();
  ok(!document.querySelector('#actionArea').textContent.includes('below 19 V'),'Selected tool preview hides captured voltage');
  ok(document.querySelector('#actionArea').textContent.includes('MEASUREMENT AVAILABLE'),'Selected instrument availability shown');
  state.selected=null;state.deck=[];renderNode();ok(document.querySelector('#actionArea').textContent.includes('TOOL REQUIRED'),'Missing tool requirement shown');
  // Backtracking keeps charges, prior consequences and adds cost.
  state.history=[];state.node='common';state.deck=['multimeter'];state.cardCharges={multimeter:1};state.time=10;state.efficiency=80;state.xp=1000;backtrackTo('briefing',0);
  ok(state.cardCharges.multimeter===1&&state.time===13&&state.efficiency===76&&state.xp===1000,'Backtrack preserves charges and XP; adds time and efficiency cost');
  savePrefs();ok(Object.keys(localStorage).filter(k=>k.startsWith('fp-')).every(k=>k.startsWith('fp-v051-')),'All saved keys isolated to v0.5.1');
  // Leave an honest UI proof of the empty loadout.
  state.deck=[];showCampaignHub();document.querySelector('#bootScreen').classList.add('hidden');
  return {version:'0.5.1',passed:checks.length,stats,toolUseCases:uses,blockedCases:blocked,zeroCardPlaythroughs:playthroughs};
 });
 assert.deepEqual(errors,[]);report.browserErrors=errors;
 await page.screenshot({path:path.resolve(__dirname,'empty-loadout.png'),fullPage:true});
 fs.writeFileSync(path.resolve(__dirname,'validation-v051.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
