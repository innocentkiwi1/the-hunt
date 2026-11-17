(async()=>{
const $=id=>document.getElementById(id);
let cfg, audioFiles={};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
try{cfg=await (await fetch('data/questions.json')).json();}catch(e){$('status').textContent='Could not load data/questions.json. Check your project files.';return;}
const fields={siteTitle:'siteTitle',quizTitle:'quizTitle',unlock:'questionsToUnlock',introTitle:'introTitle',introText:'introText',quizIntro:'quizIntro',nextTitle:'nextStageTitle',nextText:'nextStageText'};
for(const [id,key] of Object.entries(fields))$(id).value=cfg[key]??'';
function buildEditors(){
 $('qCount').textContent=`${cfg.questions.length} questions`;
 $('questionsEditor').innerHTML=cfg.questions.map((q,i)=>`<details class="question-card" ${i===0?'open':''}><summary>Question ${i+1}: ${esc(q.prompt)}</summary><label>Question text<input data-q="${i}" data-field="prompt" value="${esc(q.prompt)}"></label><div class="option-grid">${q.options.map((o,j)=>`<label>Option ${String.fromCharCode(65+j)}<input data-q="${i}" data-option="${j}" value="${esc(o)}"></label>`).join('')}</div><label>Which option is correct?<select data-q="${i}" data-field="correctIndex">${q.options.map((o,j)=>`<option value="${j}" ${Number(q.correctIndex)===j?'selected':''}>${String.fromCharCode(65+j)} — ${esc(o)}</option>`).join('')}</select></label><div class="audio-grid">${[10,15,20].map(sec=>`<div class="audio-box"><label>${sec}-second clip<input type="file" accept="audio/*" data-audio-q="${i}" data-seconds="${sec}"><span class="small" id="file-${i}-${sec}">${esc(audioFiles[`${i}-${sec}`]?.name||q.audio?.[String(sec)]?.split('/').pop()||'No file selected yet')}</span></label></div>`).join('')}</div></details>`).join('');
 $('questionsEditor').querySelectorAll('[data-q]').forEach(el=>el.addEventListener('input',()=>{
  const i=Number(el.dataset.q);if(el.dataset.field==='prompt')cfg.questions[i].prompt=el.value;
  if(el.dataset.field==='correctIndex')cfg.questions[i].correctIndex=Number(el.value);
  if(el.dataset.option!==undefined){cfg.questions[i].options[Number(el.dataset.option)]=el.value;const sel=$(`unused`);const select=$('questionsEditor').querySelector(`select[data-q="${i}"]`);if(select){const old=select.value;select.innerHTML=cfg.questions[i].options.map((v,j)=>`<option value="${j}" ${Number(old)===j?'selected':''}>${String.fromCharCode(65+j)} — ${esc(v)}</option>`).join('');}}
 }));
 $('questionsEditor').querySelectorAll('[data-audio-q]').forEach(el=>el.addEventListener('change',()=>{
  const f=el.files[0];if(!f)return;const key=`${el.dataset.audioQ}-${el.dataset.seconds}`;audioFiles[key]=f;$(`file-${el.dataset.audioQ}-${el.dataset.seconds}`).textContent=f.name;
 }));
}
buildEditors();
$('exportBtn').addEventListener('click',async()=>{
 if(!window.JSZip){$('status').textContent='ZIP helper did not load. Check your internet connection and refresh this page.';return;}
 for(const [id,key] of Object.entries(fields))cfg[key]=id==='unlock'?Math.max(1,Math.min(15,Number($(id).value)||10)):$(id).value;
 const zip=new JSZip();
 const files=['index.html','admin.html','css/styles.css','js/app.js','js/admin.js'];
 for(const path of files){const response=await fetch(path);if(!response.ok)throw new Error(`Could not read ${path}`);zip.file(path,await response.text());}
 zip.file('data/questions.json',JSON.stringify(cfg,null,2));
 for(let i=0;i<cfg.questions.length;i++){
  for(const sec of [10,15,20]){
   const key=`${i}-${sec}`,file=audioFiles[key],path=cfg.questions[i].audio[String(sec)];
   if(file){zip.file(path,await file.arrayBuffer());}
   else{
    try{const response=await fetch(path);if(response.ok){const blob=await response.blob();if(blob.size)zip.file(path,blob);}}catch(e){}
   }
  }
 }
 zip.file('README.md',`# THE HUNT\n\nOpen index.html to test locally, or upload the contents of this ZIP to the root of your GitHub Pages repository.\n\nEdit questions and upload audio at admin.html. After editing, download a new website package and upload its contents to GitHub.\n\nAudio filenames are question-N-10s.mp3, question-N-15s.mp3 and question-N-20s.mp3. The host editor can accept other audio file types too; the selected file is saved using the expected filename.\n`);
 $('status').textContent='Building your ZIP…';
 const blob=await zip.generateAsync({type:'blob'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='the-hunt-updated-website.zip';a.click();URL.revokeObjectURL(url);
 $('status').textContent='Your updated website ZIP has downloaded. Extract it, then upload its contents to GitHub.';
});
})();
