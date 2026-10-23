import re, pathlib, hashlib, json
repo=pathlib.Path(__file__).resolve().parents[2]
root=repo/'tools/v0.5.1'
root.mkdir(parents=True,exist_ok=True)
baseline=(repo/'releases/v0.5/factory-protocol-v0.5-standalone.html').read_text(encoding='utf-8')
html=baseline
script=re.search(r'<script[^>]*>(.*?)</script>',html,re.S).group(1)
def replace(old,new):
    global script
    assert old in script, old[:100]
    script=script.replace(old,new)
def function(name, nextname, source):
    global script
    start=script.index('function '+name+'(')
    if start>=6 and script[start-6:start]=='async ': start-=6
    end=script.index('function '+nextname+'(',start)
    if script[end-6:end]=='async ':end-=6
    script=script[:start]+source+'\n'+script[end:]

# Save migration reads stable state but every write belongs to this release.
script=re.sub(r"localStorage.getItem\('fp-v05-([^']+)'\)",lambda m:f"localStorage.getItem('fp-v051-{m[1]}') || localStorage.getItem('fp-v05-{m[1]}')",script)
script=re.sub(r"localStorage.setItem\('fp-v(?:05|031)-", "localStorage.setItem('fp-v051-",script)
replace("if(state.deck.length<=1){feedback('Keep at least one card in the field deck.','danger');return}","")
replace('prepare a four-card field deck','prepare a field deck of 0–4 cards')
replace('FIELD DECK · 4 CARDS','FIELD DECK · MAX 4 CARDS')
replace('<div class="reputation-panel">','<p id="loadoutWarning" class="loadout-warning" role="status"></p><div class="reputation-panel">')
replace('<div id="deckBuilder" class="deck-builder"></div><div class="deck-counter"><span>SELECTED</span><strong id="deckCount">0 / 4</strong></div><p id="loadoutWarning" class="loadout-warning" role="status"></p>', '<div class="deck-counter"><span>SELECTED</span><strong id="deckCount">0 / 4</strong></div><p id="loadoutWarning" class="loadout-warning" role="status"></p><div id="deckBuilder" class="deck-builder"></div>')
replace("$('#deckCount').textContent=`${state.deck.length} / 4`;","$('#deckCount').textContent=`${state.deck.length} / 4`; $('#loadoutWarning').textContent=state.deck.length<4?'LIMITED LOADOUT · Some diagnostic actions may be unavailable.':'';")
replace("if(!missionUnlocked(id))return;state.currentMission=id;","if(!missionUnlocked(id))return;if(state.deck.length>4){feedback('Field deck limit: 4 cards.','danger');return}state.currentMission=id;")

# Keep the approved graphs; patch their evidence contracts and add explicit manual paths.
contracts=(repo/'src/v0.5.1/tool-contracts.js').read_text(encoding='utf-8')
replace('let nodes = mission1Nodes;', contracts+'\nlet nodes = mission1Nodes;')
function('cardEvidence','cardDifficulty',"""function cardEvidence(card,n){
  if(!card)return '';
  // This accessor is called only after a validated use is committed by performRoll.
  if(card.id==='senior')return 'SUPPORT: '+n.hint+' This is a diagnostic suggestion, not a measurement.';
  return n.toolEvidence?.[card.id] || (card.id==='lockout'?'SAFETY SUPPORT: follow the site isolation procedure; a kit does not measure absence of voltage.':card.id==='reroll'?'SECOND CHECK: repeat the reasoning; no new instrument evidence.':card.id==='systematic'?'METHOD: organize only observations and recorded evidence already available.':'SUPPORT: assists this visual check; no additional measured data.');
}
""")
function('renderCheck','renderCheckOnly',(repo/'src/v0.5.1/check-ui.js').read_text(encoding='utf-8'))
replace("const card=cards.find(c=>c.id===state.selected)||null;\n  if(card&&used(card.id))", "if(state.rolling)return;\n  const card=selectedCard(n);\n  if(state.selected&&!card){state.selected=null;feedback('TOOL REQUIRED · Select an available card with charges.','danger');renderNode();return}\n  state.rolling=true;\n  if(card&&used(card.id))")
replace("state.selected=null;feedback('That card has no uses remaining this mission.'", "state.rolling=false;state.selected=null;feedback('That card has no uses remaining this mission.'")
replace("let impact={time:2};", "let impact={time:2};")
replace("applyImpact(impact,success?'Diagnostic check completed':'Diagnostic delay');", "const manual=!card||!n.toolEvidence?.[card.id];\n  if(manual&&n.manualNext)impact.time+=(n.manualCost||3);\n  applyImpact(impact,success?'Diagnostic check completed':'Diagnostic delay');")
replace("const body=(r===20?'Critical success. ':complication?'Complication. ':'')+(success?n.success:n.fail)+evidence;", "const resolvedText=card&&n.toolEvidence?.[card.id]?(success?'Resource-backed check completed.':'After additional diagnostic time, the resource-backed check is completed.'):(success?n.success:n.fail);\n  const body=(r===20?'Critical success. ':complication?'Complication. ':'')+resolvedText+evidence;")
replace("if(state.node==='failed'){renderNode();return}\n  state.englishBank=0;state.decision=0;state.selected=null;state.node=n.next;renderNode();", "state.rolling=false;\n  if(state.node==='failed'){renderNode();return}\n  state.englishBank=0;state.decision=0;state.selected=null;state.node=manual&&n.manualNext?n.manualNext:n.next;renderNode();")
replace("const xp=state.xp,avatar=", "state.rolling=false;\n  const xp=state.xp,avatar=")
# Maintain 0-card choices and never auto-fill an intentionally small loadout.
replace("if(state.deck.length<4)state.deck.push(m.unlock)", "/* Newly unlocked cards are selected by the player in Shift Control. */")
replace("wiring:'24 VDC · WIRING TRACE'", "wiring:'VISUAL CABLE INSPECTION'")
replace("verify:'PRESSURE MEASUREMENT'", "verify:'A4 FUNCTIONAL OBSERVATION'")
replace("plc:'PLC SEQUENCE TRACE',wiring:'S6 SIGNAL-PATH TRACE'", "plc:'HMI SEQUENCE STATUS',wiring:'S6 CONNECTION INSPECTION'")
replace("wiring:'24 VDC DISTRIBUTION TRACE',verify:'CONTROL-POWER CAPTURE'", "wiring:'CABINET CONDITION INSPECTION',verify:'CONTROL-SYSTEM OBSERVATION'")
html=html.replace(re.search(r'<script[^>]*>(.*?)</script>',html,re.S).group(1),script)
html=html.replace('Factory Protocol v0.5</title>','Factory Protocol v0.5.1</title>')
html=html.replace('</head>','<style>.loadout-warning{color:var(--amber);font-size:11px;line-height:1.5}.tool-status{border:1px solid #285d70;padding:9px;color:var(--cyan);font-size:10px}.tool-status.required{color:var(--amber)}.tool-status button{display:block;width:100%;text-align:left;padding:8px;margin-top:6px;background:#0a202b;border:1px solid #285d70;cursor:pointer}.tool-status button:disabled{opacity:.6;cursor:not-allowed}</style></head>')
html=html.replace('<small>FACTORY PROTOCOL · CAMPAIGN</small>','<small>FACTORY PROTOCOL · v0.5.1 · TOOL DEPENDENCY UPDATE</small>')
out=repo/'releases/v0.5.1'
out.mkdir(parents=True,exist_ok=True)
(out/'factory-protocol-v0.5.1-standalone.html').write_bytes(html.encode('utf-8'))
src=repo/'src/v0.5.1';src.mkdir(parents=True,exist_ok=True)
(src/'tool-contracts.js').write_text(contracts,encoding='utf-8')
(src/'check-ui.js').write_text((repo/'src/v0.5.1/check-ui.js').read_text(encoding='utf-8'),encoding='utf-8')
# Lightweight executable source for validation, excluding image payloads only.
logic='\n'.join(line for line in script.splitlines() if len(line)<15000)
(root/'logic-v051.js').write_text(logic,encoding='utf-8')
(root/'final-script.js').write_text(script,encoding='utf-8')
manifest={'version':'0.5.1','baseline':'approved v0.5 standalone from ChatGPT Library','baselineSha256':hashlib.sha256(baseline.encode()).hexdigest(),'standaloneSha256':hashlib.sha256(html.encode()).hexdigest(),'missions':6,'deck':{'min':0,'max':4},'saveNamespace':'fp-v051-*','migration':'Read-only fallback from fp-v05-* and older stable saves; beta namespace untouched.'}
(out/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
print(json.dumps(manifest,indent=2))
