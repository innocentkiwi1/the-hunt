(async()=>{
const $=id=>document.getElementById(id);
const root=$('app');
let cfg;
try{const r=await fetch('data/questions.json');cfg=await r.json();}catch(e){root.innerHTML='<h1>Could not load the hunt</h1><p>Please check the website files are uploaded together.</p>';return;}
document.title=cfg.siteTitle||'THE HUNT';
$('heading').textContent=cfg.introTitle;$('intro').textContent=cfg.introText;
let index=0,correct=0,attempt=0,clipTimer=null,audio=null;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function stopAudio(){if(clipTimer)clearTimeout(clipTimer);if(audio){audio.pause();audio.currentTime=0;audio=null;}}
function startQuiz(){index=0;correct=0;attempt=0;renderQuestion();}
function renderQuestion(){
 stopAudio();
 if(index>=cfg.questions.length){renderEnd();return;}
 const q=cfg.questions[index];
 root.innerHTML=`<p class="eyebrow">THE SOUNDTRACK TEST</p><div class="section-head"><h1>${esc(cfg.quizTitle)}</h1><span class="pill">Question ${index+1} / ${cfg.questions.length}</span></div><p class="lead">${esc(q.prompt)}</p><div class="progress"><div style="width:${index/cfg.questions.length*100}%"></div></div><p class="small">Correct answers: <b>${correct}</b> · Needed to unlock: <b>${cfg.questionsToUnlock}</b></p><p id="clipLabel" class="small">Listen to the 10-second clip, then choose an answer.</p><audio id="clip" class="audio-player" controls></audio><div class="answers">${q.options.map((o,i)=>`<button class="answer" data-choice="${i}">${String.fromCharCode(65+i)}. ${esc(o)}</button>`).join('')}</div><div id="feedback" class="feedback" aria-live="polite">Attempt 1 of 3</div><button id="next" class="primary" hidden>Next question →</button>`;
 audio=$('clip');loadClip(10);
 root.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>choose(Number(b.dataset.choice))));
 $('next').addEventListener('click',()=>{index++;attempt=0;renderQuestion();});
}
function loadClip(seconds){
 const q=cfg.questions[index],path=q.audio?.[String(seconds)];
 $('clipLabel').textContent=`Attempt ${attempt+1} of 3 — ${seconds}-second clip`;
 if(!path){$('feedback').textContent=`Audio file missing: ${path||'add this clip in Host Setup'}`;return;}
 audio.src=path;audio.load();
 audio.onplay=()=>{if(clipTimer)clearTimeout(clipTimer);clipTimer=setTimeout(()=>{audio.pause();},seconds*1000);};
}
function choose(choice){
 const q=cfg.questions[index];if($('next').hidden===false)return;
 if(choice===Number(q.correctIndex)){
  correct++;stopAudio();$('feedback').innerHTML='<span class="good">Correct! Well done.</span>';finishQuestion();return;
 }
 attempt++;
  if(attempt===1){$('feedback').innerHTML='<span class="bad">Not quite. Try again — here is a longer clip.</span>';loadClip(15);}
 else if(attempt===2){$('feedback').innerHTML='<span class="bad">Not that one. One final attempt with an even longer clip.</span>';loadClip(20);}
 else{$('feedback').innerHTML=`<span class="bad">The correct answer was ${String.fromCharCode(65+Number(q.correctIndex))}. ${esc(q.options[q.correctIndex])}.</span>`;stopAudio();finishQuestion();}
}
function finishQuestion(){root.querySelectorAll('[data-choice]').forEach(b=>b.disabled=true);$('next').hidden=false;}
function renderEnd(){
 const passed=correct>=Number(cfg.questionsToUnlock);
 root.innerHTML=`<div class="end"><p class="eyebrow">CHALLENGE COMPLETE</p><h1>${passed?'Stage unlocked!':'Not quite yet'}</h1><p class="lead">You got <b>${correct}</b> out of ${cfg.questions.length} questions correct.</p><p>${passed?esc(cfg.nextStageTitle):`You need ${cfg.questionsToUnlock} correct answers to unlock the next stage.`}</p>${passed?`<div class="feedback">${esc(cfg.nextStageText)}</div>`:''}<button id="again" class="primary">${passed?'View results again':'Try the quiz again'}</button></div>`;
 $('again').addEventListener('click',startQuiz);
}
$('startBtn').addEventListener('click',()=>{
 root.innerHTML=`<p class="eyebrow">STAGE 1</p><h1>${esc(cfg.quizTitle)}</h1><p class="lead">${esc(cfg.quizIntro)}</p><p class="small">You need ${cfg.questionsToUnlock} correct answers to unlock the next stage.</p><button id="go" class="primary">Start challenge →</button>`;
 $('go').addEventListener('click',startQuiz);
});
})();
