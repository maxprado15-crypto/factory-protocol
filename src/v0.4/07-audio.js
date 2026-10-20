// ------------------------------ Audio --------------------------------------
let audioCtx=null, master=null, ambienceNodes=[];
function ensureAudio(){
  if(!state.sound) return;
  if(!audioCtx){ audioCtx=new (window.AudioContext||window.webkitAudioContext)(); master=audioCtx.createGain(); master.gain.value=.22; master.connect(audioCtx.destination); }
  if(audioCtx.state==='suspended') audioCtx.resume();
}
function tone(freq=440,dur=.08,type='sine',vol=.08,when=0){
  if(!state.sound) return; ensureAudio(); if(!audioCtx) return;
  const o=audioCtx.createOscillator(), g=audioCtx.createGain(); o.type=type; o.frequency.setValueAtTime(freq,audioCtx.currentTime+when);
  g.gain.setValueAtTime(0,audioCtx.currentTime+when); g.gain.linearRampToValueAtTime(vol,audioCtx.currentTime+when+.01); g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+when+dur);
  o.connect(g);g.connect(master);o.start(audioCtx.currentTime+when);o.stop(audioCtx.currentTime+when+dur+.03);
}
function sfx(name){
  if(name==='click'){tone(520,.045,'square',.025);tone(760,.05,'sine',.018,.03)}
  if(name==='select'){tone(330,.08,'triangle',.04);tone(600,.09,'sine',.025,.05)}
  if(name==='success'){tone(440,.12,'sine',.05);tone(660,.14,'sine',.05,.09);tone(880,.2,'sine',.055,.19)}
  if(name==='fail'){tone(180,.18,'sawtooth',.045);tone(135,.28,'triangle',.04,.10)}
  if(name==='critical'){[523,659,784,1047].forEach((f,i)=>tone(f,.22,'sine',.045,i*.07))}
  if(name==='xp'){tone(750,.05,'square',.018);tone(980,.08,'sine',.025,.04)}
  if(name==='alarm'){tone(880,.12,'square',.035);tone(660,.13,'square',.025,.14)}
  if(name==='card'){tone(220,.06,'triangle',.03);tone(900,.12,'sine',.028,.035)}
  if(name==='warning'){tone(250,.12,'square',.04);tone(210,.12,'square',.04,.13)}
}
function startAmbience(){
  if(!state.sound) return; ensureAudio(); if(!audioCtx||ambienceNodes.length) return;
  const g=audioCtx.createGain();g.gain.value=.035;g.connect(master);const o1=audioCtx.createOscillator();o1.type='sine';o1.frequency.value=55;const o2=audioCtx.createOscillator();o2.type='triangle';o2.frequency.value=82.4;const lfo=audioCtx.createOscillator();lfo.frequency.value=.16;const lg=audioCtx.createGain();lg.gain.value=.012;lfo.connect(lg);lg.connect(g.gain);o1.connect(g);o2.connect(g);o1.start();o2.start();lfo.start();ambienceNodes=[o1,o2,lfo,g,lg];
}
function stopAmbience(){ambienceNodes.forEach(n=>{try{n.stop&&n.stop()}catch(e){}try{n.disconnect&&n.disconnect()}catch(e){}});ambienceNodes=[]}
function toggleSound(){state.sound=!state.sound;try{localStorage.setItem('fp-v031-sound',state.sound?'on':'off')}catch(e){}if(state.sound){ensureAudio();startAmbience();sfx('click')}else stopAmbience();updateSoundButton()}
function updateSoundButton(){const b=$('#soundToggle');if(b)b.textContent=state.sound?'SOUND ON':'SOUND OFF'}
