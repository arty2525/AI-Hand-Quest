const STORAGE_KEY="ai_to_esp32_online_worksheet_v3";
const EVIDENCE_KEY="ai_to_esp32_evidence_meta_v2";
const SUBMISSION_KEY="ai_to_esp32_submission_id_v1";
const API="https://ckiltjhcvxriwjfreqfz.supabase.co/functions/v1/worksheet-submit";
const SUPABASE_URL="https://ckiltjhcvxriwjfreqfz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY="sb_publishable_PhE23kwVYhQ1CRUAiSvAjQ_EDgnIPTv";
const BUCKET="worksheet-evidence";

const ids=[
"group_name","class_room","group_no","date_work","member1","member2","member3","member4","member5",
"a_obs","a_hyp","a_evi","a_sum","b_obs","b_hyp","b_evi","b_sum","c_obs","c_hyp","c_evi","c_sum",
"flow_input","flow_p1","flow_p2","flow_ctrl","flow_out","menti_q1","menti_q2",
"challenge_topic","before_symptom","before_hyp","before_evi","before_test","before_result","before_fix",
"after_symptom","after_hyp","after_evi","after_test","after_result","after_fix","feedback_note",
"app_problem","app_user","app_input","app_process","app_output","app_adjust","app_risk","app_test","app_sketch",
"evidence_section","evidence_desc","link1","link2","link3","evidence_summary"
];
const $=id=>document.getElementById(id);
let evidenceQueue=[];
let evidenceMeta=[];
let supabaseClient=null;

function injectEvidenceUI(){
  const tools=document.querySelector('.top-tools');
  if(tools && !$('submitWorksheet')){
    const b=document.createElement('button');
    b.id='submitWorksheet'; b.className='btn btn-green'; b.innerHTML='📤 ส่งใบกิจกรรม';
    b.onclick=submitWorksheet; tools.prepend(b);
  }
  const stats=document.querySelectorAll('.stat');
  if(stats.length>=4){stats[3].innerHTML='<small>หลักฐานแนบ</small><strong id="evidenceCount">0 ไฟล์</strong>'}
  const nav=document.querySelector('.nav');
  if(nav && !$('evidenceTab')){
    nav.style.gridTemplateColumns='repeat(4,1fr)';
    const t=document.createElement('button');
    t.id='evidenceTab'; t.className='tab'; t.dataset.tab='p4';
    t.innerHTML='หลักฐาน<span>ภาพถ่าย • วิดีโอ • ลิงก์</span>';
    nav.appendChild(t);
  }
  const main=document.querySelector('main');
  if(main && !$('p4')){
    const s=document.createElement('section'); s.id='p4'; s.className='panel';
    s.innerHTML=`<div class="sheet glass">
      <div class="sheet-head"><div><div class="sheet-kicker">ภาคผนวกหลักฐาน</div><h3>เก็บหลักฐานจากการปฏิบัติงาน</h3><p class="sheet-desc">แนบภาพถ่าย วิดีโอ และลิงก์ที่แสดงการลงมือปฏิบัติ ผลการทดลอง การ Debug และการพัฒนาต้นแบบของกลุ่ม</p></div><div class="step-chip">📸 Evidence</div></div>
      <div class="evidence-grid">
        <div class="evidence-card">
          <div class="field"><label>กิจกรรมที่เกี่ยวข้อง</label><select id="evidence_section" class="select"><option>ใบกิจกรรม 3.4.1 สำรวจ 3 Stations</option><option>ใบกิจกรรม 3.4.2 Challenge Debugging</option><option>ใบกิจกรรม 3.4.3 Application Design</option><option>หลักฐานทั่วไป</option></select></div>
          <div class="field" style="margin-top:12px"><label>คำอธิบายหลักฐาน</label><textarea id="evidence_desc" class="textarea" placeholder="เช่น ภาพหน้าจอ AI ตรวจพบ Hand / คลิปทดสอบ LED / ภาพการทำงานร่วมกัน"></textarea></div>
          <div class="upload-box" style="margin-top:14px"><b>เลือกภาพถ่ายหรือวิดีโอ</b><p class="small-note">ไฟล์ละไม่เกิน 50 MB • รองรับ image/* และ video/* • สามารถเลือกหลายไฟล์</p><input id="evidence_files" type="file" accept="image/*,video/*" multiple capture="environment"><div class="evidence-note">ไฟล์ที่เลือกจะยังไม่ถูกส่งจนกด “ส่งใบกิจกรรม” ระบบจะอัปโหลดเข้า Supabase Storage แบบ Private และครูเปิดดูผ่าน Teacher Dashboard เท่านั้น</div></div>
          <div class="no-print" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button type="button" class="btn btn-primary" id="addEvidence">➕ เพิ่มเข้ารายการ</button><button type="button" class="btn btn-soft" id="clearEvidence">ล้างไฟล์ที่ยังไม่ส่ง</button></div>
        </div>
        <div class="evidence-card">
          <div class="field"><label>ลิงก์หลักฐานเพิ่มเติม</label><div class="link-list"><input class="input" id="link1" placeholder="Google Drive / YouTube / Google Photos 1"><input class="input" id="link2" placeholder="ลิงก์ 2"><input class="input" id="link3" placeholder="ลิงก์ 3"></div></div>
          <div class="field" style="margin-top:14px"><label>สรุปว่าหลักฐานยืนยันการเรียนรู้อย่างไร</label><textarea class="textarea" id="evidence_summary" placeholder="เช่น แสดงให้เห็นว่าสมาชิกสามารถแยกตรวจระบบและแก้ปัญหาจากหลักฐานได้"></textarea></div>
        </div>
      </div>
      <div id="previewGrid" class="preview-grid"></div>
      <div id="submitReceipt" class="submit-receipt" style="display:none"></div>
    </div>`;
    main.appendChild(s);
  }
  bindTabs();
  if($('addEvidence')) $('addEvidence').onclick=addEvidenceFiles;
  if($('clearEvidence')) $('clearEvidence').onclick=clearPendingEvidence;
  if($('evidence_files')) $('evidence_files').onchange=()=>{ if($('evidence_files').files.length) toast(`เลือก ${$('evidence_files').files.length} ไฟล์แล้ว`) };
  bindAutoSave();
}

function bindTabs(){
  document.querySelectorAll('.tab').forEach(btn=>btn.onclick=()=>{
    document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
    document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active')); const p=$(btn.dataset.tab); if(p)p.classList.add('active');
    window.scrollTo({top:document.querySelector('.nav').offsetTop-8,behavior:'smooth'});
  });
}

for(let i=1;i<=13;i++){let o=document.createElement('option');o.value=`ม.4/${i}`;o.textContent=`ม.4/${i}`;$('class_room').appendChild(o)}
for(let i=1;i<=8;i++){let o=document.createElement('option');o.value=i;o.textContent=i;$('group_no').appendChild(o)}

function collect(){const d={};ids.forEach(id=>d[id]=$(id)?.value||'');return d}
function worksheetAnswers(){const d=collect(); const omit=new Set(['group_name','class_room','group_no','date_work','member1','member2','member3','member4','member5','evidence_section','evidence_desc','link1','link2','link3']); const a={}; Object.entries(d).forEach(([k,v])=>{if(!omit.has(k))a[k]=v}); return a}
function members(){return [1,2,3,4,5].map(i=>$('member'+i)?.value.trim()).filter(Boolean)}
function roomNumber(){const m=String($('class_room')?.value||'').match(/\/(\d+)$/); return m?Number(m[1]):0}
function evidenceLinks(){return ['link1','link2','link3'].map(id=>$(id)?.value.trim()).filter(Boolean)}

function updateProgress(){
  const values=ids.filter(id=>!['date_work','evidence_section','evidence_desc','link1','link2','link3'].includes(id) && $(id)).map(id=>($(id)?.value||'').trim());
  const filled=values.filter(Boolean).length, pct=values.length?Math.round(filled/values.length*100):0;
  $('progress').style.width=pct+'%'; $('progressText').textContent=pct+'%';
}
function updateEvidenceCount(){if($('evidenceCount'))$('evidenceCount').textContent=(evidenceMeta.length+evidenceQueue.length)+' ไฟล์'}
function saveData(show=true){
  localStorage.setItem(STORAGE_KEY,JSON.stringify(collect()));
  localStorage.setItem(EVIDENCE_KEY,JSON.stringify(evidenceMeta));
  $('saveState').textContent='บันทึกแล้ว ✓'; $('autoText').textContent='บันทึกล่าสุด '+new Date().toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'});
  updateProgress(); updateEvidenceCount(); if(show)toast('บันทึกคำตอบเรียบร้อยแล้ว ✅');
}
function loadData(){
  try{const d=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');ids.forEach(id=>{if($(id)&&d[id]!==undefined)$(id).value=d[id]})}catch(e){}
  try{evidenceMeta=JSON.parse(localStorage.getItem(EVIDENCE_KEY)||'[]')}catch(e){evidenceMeta=[]}
  if(!$('date_work').value)$('date_work').value=new Date().toISOString().slice(0,10);
  renderEvidence(); updateProgress(); updateEvidenceCount();
}
function bindAutoSave(){
  ids.forEach(id=>{const el=$(id);if(el && !el.dataset.bound){el.dataset.bound='1';el.addEventListener('input',()=>{$('saveState').textContent='กำลังบันทึก…';updateProgress();clearTimeout(window.__sv);window.__sv=setTimeout(()=>saveData(false),450)});el.addEventListener('change',()=>saveData(false))}})
}
function resetForm(){
  if(!confirm('ต้องการล้างคำตอบทั้งหมดหรือไม่?'))return;
  ids.forEach(id=>{if($(id))$(id).value=''});localStorage.removeItem(STORAGE_KEY);localStorage.removeItem(EVIDENCE_KEY);localStorage.removeItem(SUBMISSION_KEY);
  evidenceQueue.forEach(x=>x.preview&&URL.revokeObjectURL(x.preview)); evidenceQueue=[]; evidenceMeta=[];
  $('date_work').value=new Date().toISOString().slice(0,10); renderEvidence(); updateProgress(); toast('ล้างข้อมูลแล้ว');
}
function exportJSON(){
  const bundle={form:collect(),submission_id:localStorage.getItem(SUBMISSION_KEY)||null,evidence:evidenceMeta};
  const blob=new Blob([JSON.stringify(bundle,null,2)],{type:'application/json;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`AI_to_ESP32_Worksheet_${$('class_room').value||'M4'}_G${$('group_no').value||'-'}.json`;a.click();URL.revokeObjectURL(a.href);
}
function toast(msg){const d=document.createElement('div');d.textContent=msg;Object.assign(d.style,{position:'fixed',left:'50%',bottom:'22px',transform:'translateX(-50%)',zIndex:9999,padding:'11px 16px',borderRadius:'999px',background:'#07172fee',color:'#fff',fontWeight:'800',boxShadow:'0 12px 30px #0006'});document.body.appendChild(d);setTimeout(()=>d.remove(),2000)}

function addEvidenceFiles(){
  const input=$('evidence_files'), files=Array.from(input.files||[]); if(!files.length){toast('กรุณาเลือกไฟล์ก่อน');return}
  const section=$('evidence_section').value, desc=$('evidence_desc').value.trim();
  for(const file of files){
    if(!(file.type.startsWith('image/')||file.type.startsWith('video/'))){toast('ข้ามไฟล์ที่ไม่ใช่ภาพหรือวิดีโอ');continue}
    if(file.size>50*1024*1024){toast(`${file.name} ใหญ่เกิน 50 MB`);continue}
    evidenceQueue.push({id:crypto.randomUUID(),file,name:file.name,type:file.type,size:file.size,section,description:desc,preview:URL.createObjectURL(file),status:'pending'});
  }
  input.value=''; renderEvidence(); updateEvidenceCount();
}
function clearPendingEvidence(){evidenceQueue.forEach(x=>x.preview&&URL.revokeObjectURL(x.preview));evidenceQueue=[];renderEvidence();updateEvidenceCount()}
function removePending(id){const i=evidenceQueue.findIndex(x=>x.id===id);if(i>=0){const x=evidenceQueue[i];if(x.preview)URL.revokeObjectURL(x.preview);evidenceQueue.splice(i,1);renderEvidence();updateEvidenceCount()}}
function renderEvidence(){
  const grid=$('previewGrid'); if(!grid)return; grid.innerHTML='';
  [...evidenceMeta.map(x=>({...x,status:'uploaded'})),...evidenceQueue].forEach(item=>{
    const card=document.createElement('div');card.className='preview-item';const video=(item.type||item.mime_type||'').startsWith('video/');
    const thumb=item.preview?(video?`<video class="preview-thumb" controls src="${item.preview}"></video>`:`<img class="preview-thumb" src="${item.preview}" alt="">`):`<div class="preview-thumb file-placeholder">${video?'🎥':'📷'}</div>`;
    card.innerHTML=`${thumb}<div class="preview-body"><div class="preview-type">${video?'วิดีโอ':'ภาพถ่าย'} • ${item.section||''}</div><div class="preview-name">${item.name||item.file_name||''}</div><div class="small-note">${item.description||'-'}</div><div class="evidence-status ${item.status==='uploaded'?'done':''}">${item.status==='uploaded'?'✓ อัปโหลดแล้ว':'รอส่ง'}</div>${item.status!=='uploaded'?`<button class="mini-remove no-print" onclick="removePending('${item.id}')">ลบ</button>`:''}</div>`;
    grid.appendChild(card);
  });
}
window.removePending=removePending;

async function api(action,payload={}){
  const r=await fetch(API,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action,...payload})});
  const j=await r.json().catch(()=>({})); if(!r.ok||!j.ok)throw new Error(j.error||'เชื่อมต่อระบบไม่ได้'); return j;
}
async function getSupabase(){if(supabaseClient)return supabaseClient;const mod=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');supabaseClient=mod.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});return supabaseClient}
async function uploadEvidence(submissionId){
  if(!evidenceQueue.length)return 0; const client=await getSupabase(); let done=0;
  for(const item of [...evidenceQueue]){
    setSubmitState(`กำลังอัปโหลดหลักฐาน ${done+1}/${evidenceQueue.length}…`);
    const prep=await api('prepare_upload',{submission_id:submissionId,file_name:item.name,mime_type:item.type,file_size:item.size,section:item.section,description:item.description});
    const {error}=await client.storage.from(prep.bucket||BUCKET).uploadToSignedUrl(prep.path,prep.token,item.file,{contentType:item.type,cacheControl:'3600'}); if(error)throw error;
    await api('register_evidence',{submission_id:submissionId,storage_path:prep.path,file_name:item.name,mime_type:item.type,file_size:item.size,section:item.section,description:item.description});
    evidenceMeta.push({file_name:item.name,mime_type:item.type,file_size:item.size,section:item.section,description:item.description,storage_path:prep.path});
    if(item.preview)URL.revokeObjectURL(item.preview); const idx=evidenceQueue.findIndex(x=>x.id===item.id); if(idx>=0)evidenceQueue.splice(idx,1); done++;
  }
  saveData(false); renderEvidence(); return done;
}
function setSubmitState(text,kind=''){const b=$('submitWorksheet');if(b){b.textContent=text;b.dataset.kind=kind}}
async function submitWorksheet(){
  const room=roomNumber(),group=Number($('group_no').value),mem=members();
  if(!room){toast('กรุณาเลือกห้องเรียน');return} if(!group){toast('กรุณาเลือกกลุ่ม');return} if(!mem.length){toast('กรุณากรอกชื่อสมาชิกอย่างน้อย 1 คน');return}
  const b=$('submitWorksheet');b.disabled=true;
  try{
    setSubmitState('⏳ กำลังบันทึกใบกิจกรรม…');
    const existing=localStorage.getItem(SUBMISSION_KEY)||undefined;
    const j=await api('save_submission',{submission_id:existing,room,group_no:group,group_name:$('group_name').value.trim(),members:mem,worksheet_answers:worksheetAnswers(),evidence_links:evidenceLinks(),status:'submitted'});
    const sid=j.row.submission_id;localStorage.setItem(SUBMISSION_KEY,sid);
    const uploaded=await uploadEvidence(sid);
    setSubmitState('✅ ส่งใบกิจกรรมแล้ว','done');
    if($('submitReceipt')){$('submitReceipt').style.display='block';$('submitReceipt').innerHTML=`<b>ส่งสำเร็จ ✅</b><br>ห้อง ม.4/${room} • กลุ่ม ${group} • หลักฐานอัปโหลดใหม่ ${uploaded} ไฟล์<br><span class="small-note">รหัสงาน: ${sid}</span>`}
    saveData(false);toast('ส่งใบกิจกรรมและหลักฐานเข้าระบบครูแล้ว ✅');
  }catch(e){console.error(e);setSubmitState('📤 ส่งใบกิจกรรม');alert('ส่งไม่สำเร็จ: '+(e.message||e))}finally{b.disabled=false}
}

injectEvidenceUI();bindAutoSave();loadData();