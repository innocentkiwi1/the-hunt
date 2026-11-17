let config;
let currentIndex = 0;
let attempt = 1;
let correctCount = 0;
let answered = false;
const $ = (id) => document.getElementById(id);
const audio = $('audio-player');

async function loadConfig(){
  try{
    const response = await fetch('data/questions.json');
    if(!response.ok) throw new Error('Could not load configuration');
    config = await response.json();
    applyConfig();
    if(location.hash === '#host') showScreen('host');
  }catch(error){
    document.querySelector('.shell').innerHTML = '<section class="screen active"><h1>Configuration not found.</h1><p>Open this site through GitHub Pages or a local web server so the JSON file can load.</p></section>';
    console.error(error);
  }
}
function applyConfig(){
  $('site-title').textContent=config.siteTitle;
  document.title=config.siteTitle;
  $('site-subtitle').textContent=config.subtitle;
  $('intro-title').textContent=config.introTitle;
  $('intro-text').textContent=config.introText;
  $('music-title').textContent=config.musicTitle;
  $('music-intro').textContent=config.musicIntro;
  $('unlock-label').textContent=`${config.questionsToUnlock} NEEDED TO UNLOCK`;
  $('question-total').textContent=config.questions.length;
  $('next-stage-title').textContent=config.nextStageTitle;
  $('next-stage-text').textContent=config.nextStageText;
}
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  $(id).classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}
function startQuiz(){
  currentIndex=0;attempt=1;correctCount=0;
  showQuestion();
  showScreen('music-stage');
}
function showQuestion(){
  const q=config.questions[currentIndex];
  answered=false;
  $('question-number').textContent=String(currentIndex+1).padStart(2,'0');
  $('question-text').textContent=q.question;
  $('attempt-label').textContent=`ATTEMPT ${attempt} / 3 · ${[10,15,20][attempt-1]} SECOND CLIP`;
  $('progress-label').textContent=`${correctCount} CORRECT`;
  $('progress-fill').style.width=`${(currentIndex/config.questions.length)*100}%`;
  $('feedback').textContent='';
  $('next-question').classList.add('hidden');
  $('play-button').textContent='▶';
  $('audio-status').textContent='Press play to listen';
  audio.pause(); audio.currentTime=0;
  audio.src=q.clips?.[attempt-1] || '';
  const options=$('options'); options.innerHTML='';
  q.options.forEach((option,index)=>{
    const button=document.createElement('button');
    button.className='option';
    button.textContent=String.fromCharCode(65+index)+'.  '+option;
    button.addEventListener('click',()=>chooseAnswer(index,button));
    options.appendChild(button);
  });
}
$('play-button').addEventListener('click',()=>{
  if(!audio.src){$('audio-status').textContent='No audio file added yet';return;}
  if(audio.paused){
    audio.play().then(()=>{$('play-button').textContent='Ⅱ';$('audio-status').textContent='Playing clip…'}).catch(()=>{$('audio-status').textContent='Audio file could not be played'});
  }else{audio.pause();$('play-button').textContent='▶';$('audio-status').textContent='Paused'}
});
audio.addEventListener('timeupdate',()=>{
  const limit=[10,15,20][attempt-1];
  if(audio.currentTime>=limit){audio.pause();audio.currentTime=limit;$('play-button').textContent='▶';$('audio-status').textContent='Clip finished'}
});
audio.addEventListener('ended',()=>{$('play-button').textContent='▶'});
function chooseAnswer(index,button){
  if(answered)return;
  const q=config.questions[currentIndex];
  const buttons=[...$('options').children];
  if(index===q.answerIndex){
    answered=true;correctCount++;button.classList.add('correct');
    buttons.forEach(b=>b.disabled=true);
    $('feedback').textContent='CORRECT. Signal recognised.';
    $('progress-label').textContent=`${correctCount} CORRECT`;
    $('next-question').classList.remove('hidden');
  }else{
    button.classList.add('wrong');button.disabled=true;
    if(attempt<3){
      attempt++;
      $('feedback').textContent=`Not quite. Try again — the next clip is longer.`;
      $('attempt-label').textContent=`ATTEMPT ${attempt} / 3 · ${[10,15,20][attempt-1]} SECOND CLIP`;
      audio.pause();audio.currentTime=0;audio.src=q.clips?.[attempt-1]||'';
      $('audio-status').textContent='Press play for the longer clip';
    }else{
      answered=true;
      buttons.forEach(b=>b.disabled=true);
      buttons[q.answerIndex].classList.add('correct');
      $('feedback').textContent=`The answer was: ${q.options[q.answerIndex]}. Moving on.`;
      $('next-question').classList.remove('hidden');
    }
  }
}
$('next-question').addEventListener('click',()=>{
  currentIndex++;
  if(currentIndex>=config.questions.length){
    if(correctCount>=config.questionsToUnlock){
      $('progress-fill').style.width='100%';showScreen('stage-two');
    }else{
      const retry=confirm(`You got ${correctCount} correct. ${config.questionsToUnlock} are needed to unlock the next stage. Try the challenge again?`);
      if(retry)startQuiz();else showScreen('home');
    }
  }else showQuestion();
});
$('begin-button').addEventListener('click',()=>showScreen('stage-one'));
$('to-music').addEventListener('click',startQuiz);
$('reload-config').addEventListener('click',()=>{
  $('config-editor').value=JSON.stringify(config,null,2);
});
$('export-config').addEventListener('click',()=>{
  try{
    const edited=JSON.parse($('config-editor').value);
    const blob=new Blob([JSON.stringify(edited,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download='questions.json';a.click();URL.revokeObjectURL(url);
  }catch(e){alert('That JSON has an error. Check the formatting and try again.');}
});
loadConfig().then(()=>{$('config-editor').value=JSON.stringify(config,null,2)});
