
const STORAGE_KEY="ai_to_esp32_online_worksheet_v2";
const ids=[
"group_name","class_room","group_no","date_work","member1","member2","member3","member4","member5",
"a_obs","a_hyp","a_evi","a_sum","b_obs","b_hyp","b_evi","b_sum","c_obs","c_hyp","c_evi","c_sum",
"flow_input","flow_p1","flow_p2","flow_ctrl","flow_out","menti_q1","menti_q2",
"challenge_topic","before_symptom","before_hyp","before_evi","before_test","before_result","before_fix",
"after_symptom","after_hyp","after_evi","after_test","after_result","after_fix","feedback_note",
"app_problem","app_user","app_input","app_process","app_output","app_adjust","app_risk","app_test","app_sketch"
];
const $=id=>document.getElementById(id);

for(let i=1;i<=13;i++){let o=document.createElement("option");o.value=`ม.4/${i}`;o.textContent=`ม.4/${i}`;$("class_room").appendChild(o)}
for(let i=1;i<=8;i++){let o=document.createElement("option");o.value=i;o.textContent=i;$("group_no").appendChild(o)}

function collect(){const d={};ids.forEach(id=>d[id]=$(id)?.value||"");return d}
function updateProgress(){
  const values=ids.filter(id=>!["date_work"].includes(id)).map(id=>($(id)?.value||"").trim());
  const filled=values.filter(Boolean).length, pct=Math.round(filled/values.length*100);
  $("progress").style.width=pct+"%";$("progressText").textContent=pct+"%";
}
function saveData(show=true){
  localStorage.setItem(STORAGE_KEY,JSON.stringify(collect()));
  $("saveState").textContent="บันทึกแล้ว ✓";$("autoText").textContent="บันทึกล่าสุด "+new Date().toLocaleTimeString("th-TH",{hour:"2-digit",minute:"2-digit"});
  updateProgress(); if(show) toast("บันทึกคำตอบเรียบร้อยแล้ว ✅");
}
function loadData(){
  try{
    const d=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");
    ids.forEach(id=>{if($(id)&&d[id]!==undefined)$(id).value=d[id]});
  }catch(e){}
  if(!$("date_work").value)$("date_work").value=new Date().toISOString().slice(0,10);
  updateProgress();
}
function resetForm(){
  if(!confirm("ต้องการล้างคำตอบทั้งหมดหรือไม่?"))return;
  ids.forEach(id=>{if($(id))$(id).value=""});localStorage.removeItem(STORAGE_KEY);
  $("date_work").value=new Date().toISOString().slice(0,10);updateProgress();toast("ล้างข้อมูลแล้ว");
}
function exportJSON(){
  const blob=new Blob([JSON.stringify(collect(),null,2)],{type:"application/json;charset=utf-8"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`AI_to_ESP32_Worksheet_${$("class_room").value||"M4"}_G${$("group_no").value||"-"}.json`;a.click();URL.revokeObjectURL(a.href);
}
function toast(msg){
  const d=document.createElement("div");d.textContent=msg;Object.assign(d.style,{position:"fixed",left:"50%",bottom:"22px",transform:"translateX(-50%)",zIndex:9999,padding:"11px 16px",borderRadius:"999px",background:"#07172fee",color:"#fff",fontWeight:"800",boxShadow:"0 12px 30px #0006"});
  document.body.appendChild(d);setTimeout(()=>d.remove(),1700)
}
document.querySelectorAll(".tab").forEach(btn=>btn.onclick=()=>{
  document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));btn.classList.add("active");
  document.querySelectorAll(".panel").forEach(p=>p.classList.remove("active"));$(btn.dataset.tab).classList.add("active");
  window.scrollTo({top:document.querySelector(".nav").offsetTop-8,behavior:"smooth"})
});
ids.forEach(id=>{const el=$(id);if(el){el.addEventListener("input",()=>{ $("saveState").textContent="กำลังบันทึก…"; updateProgress(); clearTimeout(window.__sv);window.__sv=setTimeout(()=>saveData(false),450)});el.addEventListener("change",()=>saveData(false))}});
loadData();
