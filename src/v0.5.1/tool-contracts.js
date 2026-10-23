// Factory Protocol v0.5.1 — explicit evidence provenance, independent of bonuses.
const TOOL_RULES = {
  multimeter:'Voltage / current / continuity', pressure:'Pneumatic pressure',
  leakspray:'Small leak localization', precision:'Exact alignment',
  wiring:'Wiring route / terminal trace', sensor:'Sensor operating limits / specifications',
  plcmanual:'PLC interlocks / sequence semantics', thermal:'Thermal / load trend'
};
function canUseTool(id,n){return state.deck.includes(id)&&cardUnlocked(id)&&chargeRemaining(id)>0&&!!n.toolEvidence?.[id]}
function selectedCard(n){return cards.find(c=>c.id===state.selected&&state.deck.includes(c.id)&&cardUnlocked(c.id)&&!used(c.id)&&(n.toolEvidence?.[c.id]||hasTag(c,n.tags)))||null}
function patchCheck(m,id,visual,tools,manualCost=3){
  Object.assign(m.nodes[id],visual,{toolEvidence:tools,manualCost});
}
function manualRoute(m,checkId,id,body,result,next){
  m.nodes[checkId].manualNext=id;
  m.nodes[id]={type:'choice',progress:m.nodes[checkId].progress+2,kicker:'VISUAL INSPECTION ONLY',title:'CONTINUE THE MANUAL INVESTIGATION',body,
    opts:[{label:'CONTINUE CONTROLLED INSPECTION',sub:'Additional observations and downtime; no instrument reading.',quality:'good',decision:0,next,scene:'inspect',reaction:'MANUAL EVIDENCE COLLECTED',result,impact:{time:3}}]};
}

patchCheck(missions.m1,'check1',{
  body:'Observe the S2 mounting, LED and HMI indication. Use a resource below for information that requires it.',
  success:'VISUAL INSPECTION ONLY: S2 looks intact, but its mounting appears offset. HMI: NO SIGNAL.',
  fail:'VISUAL INSPECTION ONLY: repeated observation suggests an offset mounting. HMI: NO SIGNAL; electrical values remain unknown.'
},{multimeter:'MEASUREMENT: S2 supply reads 24 VDC during a controlled electrical test. This is a supply measurement, not a continuity test.',
  wiring:'SCHEMATIC: the documented S2 signal route ends at the assigned PLC input. Continuity is not proven by a drawing.',
  sensor:'DATASHEET: the target must cross the sensing axis within the specified sensing window.'});
Object.assign(mission1Nodes.align.opts[1],{label:'VISUALLY INSPECT CABLE AND CONNECTORS FIRST',sub:'Look for visible damage; voltage and continuity require a Multimeter.',reaction:'VISUAL CABLE CHECK',result:'VISUAL INSPECTION ONLY: no obvious cable damage is seen. Voltage and continuity are unconfirmed. The mounting still looks offset.'});
patchCheck(missions.m1,'check2',{
  title:'CORRECT S2 POSITION',body:'A visible mounting offset can be corrected by controlled adjustment and repeated HMI checks. Exact alignment requires Precision Alignment.',
  success:'VISUAL INSPECTION ONLY: adjust incrementally using target passes. HMI INPUT S2 changes from OFF to ACTIVE. Exact geometry is not measured.',
  fail:'VISUAL INSPECTION ONLY: repeat incremental adjustments until HMI INPUT S2 becomes ACTIVE. No exact angle or sensor limit is established.'
},{precision:'ALIGNMENT: the alignment aid establishes the target centerline and confirms the corrected sensing axis.',
  sensor:'DATASHEET: consult the permitted target geometry and sensing-window limits; this reference does not measure the installed angle.'});
manualRoute(missions.m1,'check2','manualAlignment','Without an alignment aid, compare the visible target path with S2 and repeat controlled target passes.','Repeated target passes show consistent HMI INPUT S2: ACTIVE. Exact alignment remains unmeasured.','restart');
patchCheck(missions.m1,'check3',{
  body:'Read the existing HMI input while passing the target repeatedly. Physical electrical verification requires Multimeter.',
  success:'HMI OBSERVATION: INPUT S2 follows repeated target passes without a new alarm. No output voltage was measured.',
  fail:'HMI OBSERVATION: repeat target passes after a small visual adjustment; INPUT S2 then follows consistently.'
},{multimeter:'MEASUREMENT: S2 output voltage switches consistently during repeated target passes.'});

patchCheck(missions.m2,'check1',{
  body:'Review the maintenance history and observe the mechanism after site-approved isolation. Electrical measurements require Multimeter; a new load/temperature trend requires Thermal Trend.',
  success:'VISUAL INSPECTION ONLY: no obvious damage appears on the drive exterior. Trapped packaging near a guide suggests mechanical resistance. Supply quality is unconfirmed.',
  fail:'VISUAL INSPECTION ONLY: repeated observation identifies packaging caught near a guide. No electrical supply condition is measured.'
},{multimeter:'MEASUREMENT: a controlled electrical test records balanced supply and increased motor current under applied load.',
  thermal:'THERMAL / LOAD TREND: the supplied trend correlates rising temperature and current with load.'});
Object.assign(mission2Nodes.mechanical,{title:'MECHANICAL OBSTRUCTION SUSPECTED',body:'Caught material is visible near a conveyor guide. The maintenance log reports load-related trips. What should you inspect next?'});
mission2Nodes.restart.opts[0].result='You restore the approved protection and run a controlled test while reading the existing VFD current display.';
mission2Nodes.restart.opts[1].result='The conveyor resumes before verification. The VFD logs another transient warning and the supervisor requests a controlled test.';
mission2Nodes.mechanical.opts[3].result='The VFD logs increased current and the thermal warning returns. The protection bypass is stopped by supervision.';
patchCheck(missions.m2,'check3',{
  body:'Read the existing VFD current indication and fault log during a controlled cycle. A physical current test requires Multimeter; temperature/load correlation requires Thermal Trend.',
  success:'VFD DISPLAY / LOG: current indication stays in its normal band and no overload alarm returns during the controlled cycle.',
  fail:'VFD DISPLAY / LOG: the first test logs a transient; after another roller inspection, the display remains in its normal current band.'
},{multimeter:'MEASUREMENT: the controlled loaded electrical test records stable motor current.',thermal:'THERMAL / LOAD TREND: the trend returns to its normal load/current/temperature band after the repair.'});

patchCheck(missions.m3,'check1',{
  success:'VISUAL INSPECTION ONLY: the S4 LED flashes near reflective wrappers and sometimes during an empty gap. Reflection is a hypothesis, not an exact optical measurement.',
  fail:'VISUAL INSPECTION ONLY: slowing the controlled cycle makes the LED/reflective-wrapper association visible. Exact alignment and sensor limits remain unknown.'
},{precision:'ALIGNMENT: the alignment aid identifies the unwanted optical return path near the guard.',sensor:'DATASHEET: the sensor specification describes reflective-target sensitivity and the permitted installation geometry.'});
Object.assign(mission3Nodes.cause,{kicker:'OPTICAL INTERFERENCE SUSPECTED',title:'REFLECTION HYPOTHESIS',body:'Visible LED changes correlate with reflective packaging. Test the hypothesis through controlled setup and count checks; exact geometry requires an alignment aid.'});
Object.assign(mission3Nodes.cause.opts[0],{label:'MAKE A CONTROLLED VISUAL ADJUSTMENT',sub:'Change the angle incrementally, then compare HMI counts; exact geometry and limits remain resource-dependent.',result:'You make a small visible angle adjustment and schedule tests with real packages and empty gaps. No exact angle or operating limit is inferred.'});
patchCheck(missions.m3,'check2',{
  body:'Compare S4 LED and HMI count with actual packages and empty gaps. Exact alignment requires Precision Alignment; specified operating limits require Sensor Datasheet.',
  success:'VISUAL / HMI CHECK: each test package corresponds to a displayed count; empty gaps do not add counts. Exact alignment and operating limits are not measured.',
  fail:'VISUAL / HMI CHECK: a reflective wrapper adds an unwanted count. Repeat small adjustments and test packages until the HMI count matches the observed batch.'
},{precision:'ALIGNMENT: the alignment aid confirms separation of target detection from the reflective return.',sensor:'DATASHEET: consult the documented background-suppression settings and permitted sensor operating window.'});
manualRoute(missions.m3,'check2','manualBatch','Repeat small visual adjustments with normal and silver wrappers; check every empty gap.','A slower series of package passes matches the existing HMI count without claiming an exact optical setting.','verify');
mission3Nodes.report.opts[0][0]='S4 false triggers correlated with reflective packaging. I made controlled angle adjustments and verified the HMI package count against a physical batch.';

Object.assign(mission4Nodes.briefing.opts[0],{label:'OBSERVE A4 AND ASK THE OPERATOR',sub:'Compare visible motion with the reported symptom; pressure readings require Pressure Gauge.',result:'VISUAL INSPECTION ONLY: A4 slows during extension. No supply or branch pressure is measured.'});
patchCheck(missions.m4,'check1',{
  title:'INVESTIGATE A4 SLOW EXTENSION',body:'Observe the actuator and listen from a safe position. Measuring header or branch pressure requires Pressure Gauge and an approved controlled test.',
  success:'VISUAL INSPECTION ONLY: A4 slows during extension and a hiss is audible nearby. Header and branch pressures remain unmeasured.',
  fail:'VISUAL INSPECTION ONLY: repeated safe observation confirms slow extension and a nearby hiss. No pressure baseline is established.'
},{pressure:'MEASUREMENT: during a controlled test, header pressure stays near 6.0 bar while A4 branch pressure falls near 4.1 bar.'});
manualRoute(missions.m4,'check1','manualPneumatic','Without pressure readings, compare the observed slowdown with the operator report and inspect accessible tubing externally.','The hiss follows A4 movement. A local leak is suspected; main-supply pressure has not been measured.','leak');
Object.assign(mission4Nodes.leak,{kicker:'LOCAL LEAK SUSPECTED',title:'FOLLOW THE OBSERVABLE CLUES',body:'Slow extension and an audible hiss suggest a local air loss. Pressure remains unconfirmed unless measured with Pressure Gauge.'});
mission4Nodes.leak.opts[0].sub='Follow the hiss and visible tube movement; small escape-point localization requires Leak Detection Spray.';
mission4Nodes.leak.opts[2].sub='A local hiss does not justify replacing the compressor before inspecting A4.';
mission4Nodes.leak.opts[2].result='Upstream replacement does not address the observed local hiss; return to controlled A4 inspection.';
patchCheck(missions.m4,'check2',{
  body:'Small active leak localization requires Leak Detection Spray. Without it, isolate through the site procedure and remove the flexible tube for a slower visual inspection.',
  success:'VISUAL INSPECTION ONLY: the hiss cannot identify the small escape point. Proceed to isolated tube inspection without claiming leak localization.',
  fail:'VISUAL INSPECTION ONLY: the external check is inconclusive. A slower isolated tube inspection is required.'
},{leakspray:'LEAK LOCALIZATION: in a safe controlled test, bubbles identify air escaping from the split beside the A4 fitting. Isolate and depressurize again before repair.'});
manualRoute(missions.m4,'check2','manualTube','Have the pneumatic branch isolated and depressurized under the site procedure. Remove the accessible tube and examine it while unpressurized.','A visible split is found only after removing and flexing the isolated tube. This is visible damage; the active leak location was not instrumentally confirmed.','repair');
patchCheck(missions.m4,'check3',{
  title:'VERIFY A4 MOTION',body:'Observe repeated controlled extension/retraction and listen safely. Pressure stability requires Pressure Gauge; a small-leak test requires Leak Detection Spray.',
  success:'VISUAL INSPECTION ONLY: A4 completes repeated cycles without the previous slowdown or audible hiss. Pressure and small residual leaks remain unmeasured.',
  fail:'VISUAL INSPECTION ONLY: repeat cycles after repressurization. Motion settles without the earlier slowdown; pressure and residual small leaks remain unconfirmed.'
},{pressure:'MEASUREMENT: branch pressure stays stable during repeated controlled extension cycles.',leakspray:'LEAK TEST: no bubbles appear at the repaired tube/fitting during the controlled leak test. This does not establish pressure.'});
mission4Nodes.report.opts[0][0]='A4 was slow and a hiss suggested leakage. After isolation, inspection found a split tube. I replaced it, reseated the fitting and verified repeated motion; I report pressure only if measured.';
mission4Nodes.end.body='You investigated the slow actuator, repaired visible tube damage safely and verified motion. Only resource-backed tests can establish pressure or small-leak results.';
// Do not show a simulated HUD pressure as a physical reading.
missions.m4.statusFault='SLOW EXTENSION';missions.m4.statusOk='CYCLE RESTORED';

patchCheck(missions.m5,'check1',{
  body:'Compare physical A5 position, the visible S6 LED and the existing HMI position label. Voltage requires Multimeter; sequence meaning requires PLC Sequence Reference.',
  success:'VISUAL / HMI OBSERVATION: the HMI label RETRACTED appears when A5 is visibly extended. This is an observed mismatch; exact interlock semantics remain unconfirmed.',
  fail:'VISUAL / HMI OBSERVATION: repeat a controlled cycle; the HMI position label disagrees with the visible pusher position.'
},{multimeter:'MEASUREMENT: S6 output voltage switches cleanly at each controlled end position. This alone does not identify the intended PLC semantics.',
 wiring:'SCHEMATIC TRACE: the documented S6 NO output route terminates at the retract input; the drawing cannot prove field voltage or continuity.',
 sensor:'DATASHEET: the replacement S6 model has complementary NO and NC outputs, identified by the manufacturer lead markings.',
 plcmanual:'SEQUENCE REFERENCE: Step 30 requires S6 RETRACTED before extension and before S5 clears.'});
Object.assign(mission5Nodes.logic,{title:'INTERPRET THE OBSERVED MISMATCH',body:'HMI position labels disagree with physical motion after a sensor replacement. Which next step is justified?',correct:0,
 opts:[['Investigate replacement feedback before changing the program.','Correct. The observed mismatch is evidence; exact program interlocks require PLC Sequence Reference.'],['Assume every interlock is defective.','The observed label mismatch does not establish all program semantics.'],['Force the pusher to extend.','Never defeat position confirmation to hide an unknown fault.'],['Ignore physical position and trust the label.','Both observations must be reconciled before release.']]});
Object.assign(mission5Nodes.decision,{title:'FEEDBACK MISMATCH OBSERVED',body:'Physical position and HMI labels disagree after S6 replacement. Investigate the replacement connection before changing logic.'});
Object.assign(mission5Nodes.decision.opts[0],{label:'INVESTIGATE THE REPLACEMENT CONNECTION',sub:'A schematic enables route tracing; without it inspect visible service marks and return the labeled plug to its original configuration.',reaction:'CONNECTION INVESTIGATION STARTED',result:'You plan a controlled replacement-connection inspection. Sensor type, terminal route and program semantics require their respective references.'});
patchCheck(missions.m5,'check2',{
 title:'INSPECT THE S6 REPLACEMENT CONNECTION',body:'Wiring Diagram enables route/terminal tracing. Without it, use the slower isolated inspection of visible connector service marks; do not infer a route or pin specification.',
 success:'VISUAL INSPECTION ONLY: the replacement connector differs from the retained service marks. No terminal route or NO/NC specification is established.',
 fail:'VISUAL INSPECTION ONLY: repeat the external comparison with the retained service marks; an unverified replacement connection remains suspect.'
},{wiring:'SCHEMATIC TRACE: the field connection lands on the NC output where the drawing specifies the NO output for the retract input.',
 multimeter:'MEASUREMENT: an isolated continuity test identifies continuity through the currently connected lead. The intended route still requires the drawing.',
 sensor:'DATASHEET: the replacement model identifies separate complementary outputs; this does not identify the field terminal route.',
 plcmanual:'SEQUENCE REFERENCE: the retract permissive must agree with physical A5 retraction before the next step is enabled.'});
manualRoute(missions.m5,'check2','manualConnector','Use the site isolation procedure. Compare the keyed connector with visible retained service marks; do not trace concealed terminals without a diagram.','The connector was placed in the visibly alternate marked socket during replacement. Restore the retained original connector arrangement under the site procedure; no hidden route or NO/NC semantics are inferred.','repair');
Object.assign(mission5Nodes.repair,{title:'REPLACEMENT CONNECTION REQUIRES CORRECTION',body:'A replacement-connection mismatch is supported by visual service marks or schematic evidence. Restore the original marked arrangement under the site isolation procedure, then validate behavior.'});
Object.assign(mission5Nodes.repair.opts[0],{label:'RESTORE THE ORIGINAL MARKED CONNECTION SAFELY AND RECORD THE CHANGE',sub:'Use the documented route when the diagram was consulted, or the existing visible connector service marks.',result:'Under the site isolation procedure, the original marked connection is restored and the service record is updated.'});
patchCheck(missions.m5,'check3',{
 body:'Compare visible motion with the existing HMI position labels over repeated cycles. Detailed sequence semantics require PLC Sequence Reference.',
 success:'VISUAL / HMI OBSERVATION: position labels agree with visible A5 positions and repeated cycles complete without the previous timeout. The full interlock design is not inferred.',
 fail:'VISUAL / HMI OBSERVATION: repeat the controlled cycle; visible positions and HMI labels agree without the previous timeout.'
},{plcmanual:'SEQUENCE REFERENCE: the observed I/O order matches the documented retract permissive before extension.',sensor:'DATASHEET: the selected output configuration agrees with the replacement sensor specification.'});
mission5Nodes.report.opts[2][0]='After S6 replacement, HMI position labels disagreed with physical motion. I restored the original connection safely and verified repeated cycles. I report terminal and interlock details only when the corresponding references were consulted.';
mission5Nodes.end.body='You reconciled visible position and HMI feedback, corrected the replacement connection and validated controlled cycles without bypassing protection.';

patchCheck(missions.m6,'check1',{
 title:'CORRELATE VISIBLE FLICKER WITH CONVEYOR STARTS',body:'Observe LEDs and existing HMI event timestamps. A control-rail voltage capture requires Multimeter; shared wiring routes require Wiring Diagram.',
 success:'VISUAL / HMI LOG: device flicker coincides with transfer starts. Existing alarm timestamps cluster within 200 ms. Shared control power is a hypothesis; no voltage dip was measured.',
 fail:'VISUAL / HMI LOG: repeating the observation reveals coincident LED/HMI flicker and clustered recorded events. Physical rail voltage remains unmeasured.'
},{multimeter:'MEASUREMENT: the controlled transient test captures the nominal 24 VDC rail falling below 19 V at conveyor start.',
 wiring:'WIRING MAP: S2, S4 and A4 valve control share the field 0 V distribution block.',
 plcmanual:'SEQUENCE REFERENCE: compare documented input prerequisites with the existing timestamped event list; the reference does not measure rail voltage.'});
manualRoute(missions.m6,'check1','manualCorrelation','Without a voltage capture, compare several recorded starts with operator observations before opening the investigation to a common-cause hypothesis.','Repeated visible flicker and the existing HMI alarm log support a shared-power hypothesis. No voltage value or collapse is confirmed.','common');
Object.assign(mission6Nodes.common,{title:'SHARED CAUSE SUSPECTED',body:'The observed flicker and existing HMI log suggest a common cause. A voltage dip is confirmed only if measured; terminal routes require Wiring Diagram.'});
Object.assign(mission6Nodes.common.opts[0],{label:'INVESTIGATE THE CONTROL-POWER CABINET',sub:'Start with external condition clues and site-approved access; mapped terminal routes require Wiring Diagram.',reaction:'CABINET INVESTIGATION PLANNED',result:'You plan inspection of the control-power cabinet. No shared terminal route is claimed from visual flicker alone.'});
mission6Nodes.common.opts[1].result='Changing the nominal setting without diagnosis is stopped by supervision. It risks downstream devices and does not address the intermittent symptoms.';
mission6Nodes.common.opts[2].result='Filtering delays real input changes while visible flicker and the existing logged alarm pattern remain.';
mission6Nodes.common.opts[3].sub='Coincidence with a start does not establish a defective motor.';
mission6Nodes.common.opts[3].result='After unnecessary motor replacement, LEDs and the HMI still visibly flicker at the next controlled start. No motor current or rail voltage was measured.';
Object.assign(mission6Nodes.safety,{body:'The distribution hardware is inside the controls cabinet. A Lockout Kit supports procedure but cannot establish absence of voltage; that measurement requires Multimeter.'});
Object.assign(mission6Nodes.safety.opts[0],{label:'ARRANGE SITE-APPROVED ISOLATION BEFORE INSPECTION',sub:'Use the instrument-backed test if equipped; otherwise the authorized site isolation service must control access.',result:'The authorized site isolation service controls cabinet access under its procedure. No player voltage measurement is supplied.'});
patchCheck(missions.m6,'check2',{
 title:'INSPECT THE CONTROL CABINET CONDITION',body:'Inspect for visible discoloration after site-approved access. Circuit continuity or resistance requires Multimeter; identifying the route of a shared terminal requires Wiring Diagram.',
 success:'VISUAL INSPECTION ONLY: one connection is visibly heat-marked. The electrical resistance and concealed terminal route remain unmeasured.',
 fail:'VISUAL INSPECTION ONLY: a slower external condition survey finds a heat-marked connection. Its electrical resistance and route remain unconfirmed.'
},{multimeter:'MEASUREMENT: an approved de-energized continuity/resistance comparison finds an abnormal contact at the heat-marked connection. No live voltage-drop test is claimed during isolation.',
 wiring:'WIRING TRACE: the drawing identifies the heat-marked connection as the shared field 0 V return.'});
manualRoute(missions.m6,'check2','manualCabinet','Under site-controlled access, inspect the heat-marked connection without tracing hidden wiring. The authorized maintenance service handles the damaged assembly.','A visibly damaged contact is found during the isolated condition inspection. Its shared-route identity and resistance remain unconfirmed without the required resources.','repair');
Object.assign(mission6Nodes.repair,{title:'HEAT-DAMAGED CONNECTION FOUND',body:'A heat-marked connection requires authorized repair. Its exact route and resistance are known only if the appropriate resource was used.'});
Object.assign(mission6Nodes.repair.opts[0],{label:'ARRANGE REPLACEMENT OF THE DAMAGED CONNECTION TO SITE PROCEDURE',sub:'The authorized maintenance service restores the damaged assembly and records its work.',result:'The authorized maintenance service replaces the heat-damaged assembly under its procedure and documents the repair.'});
mission6Nodes.repair.opts[1].result='The visible contact damage remains after tightening. Electrical improvement has not been measured and the connection remains a reliability risk.';
patchCheck(missions.m6,'check3',{
 body:'Observe repeated starts, device LEDs, A4 motion and existing HMI alarms. Physical rail stability requires Multimeter; a new temperature/load trend requires Thermal Trend.',
 success:'VISUAL / HMI LOG: LEDs no longer flicker, A4 moves repeatedly and no correlated alarms return. Physical rail voltage was not measured.',
 fail:'VISUAL / HMI LOG: repeat the controlled batch. LEDs, observed motion and the existing fault log remain stable; no physical rail reading is supplied.'
},{multimeter:'MEASUREMENT: the nominal 24 VDC rail remains stable during repeated controlled loaded starts after repair.',
 thermal:'THERMAL / LOAD TREND: the recorded trend remains stable through the repeated loaded verification.',
 plcmanual:'SEQUENCE REFERENCE: use documented prerequisites to interpret the existing alarm-free sequence; no physical voltage measurement is implied.'});
mission6Nodes.report.opts[1][0]='Multiple devices flickered at conveyor starts. A heat-damaged connection was found during controlled inspection and repaired by the authorized service. Repeated starts then showed stable visible behavior and no correlated HMI alarms. I distinguish observed evidence from any instrument-backed measurements.';
mission6Nodes.report.opts[2][1]='Filtering masks symptoms and does not repair the visibly heat-damaged connection.';
mission6Nodes.end.body='You correlated operator observations and existing logs, investigated visible damage safely and validated loaded operation. Measured voltage, mapped routes and inferred common cause remain distinct.';

// More time is the cost of the alternative route, never a pre-mission deck gate.
// No reference, safety or support card can stand in for a measuring instrument.
cards.forEach(c=>{if(TOOL_RULES[c.id])c.desc=`${c.maxUses} uses · Required for ${TOOL_RULES[c.id].toLowerCase()}. Evidence is revealed only when used.`;});
cards.find(c=>c.id==='lockout').desc='2 uses · Supports site isolation procedures. Does not measure absence of voltage.';
