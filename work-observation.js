const $=id=>document.getElementById(id),API="https://ckiltjhcvxriwjfreqfz.supabase.co/functions/v1/teacher-work-observation",K=["expressing_evidence","listening","assigned_work","responsibility_time","technology_use"],L=["การแสดงความคิดเห็นโดยอ้างอิงหลักฐาน","การยอมรับฟังความคิดเห็นของผู้อื่น","การทำงานตามหน้าที่ที่ได้รับมอบหมาย","ความรับผิดชอบและการตรงต่อเวลา","การใช้เทคโนโลยีอย่างเหมาะสม"];let rows=[],student=null,dirty=false,loadedRoom='',loadedDate='';
$("room").innerHTML='<option value="">เลือกห้อง</option>'+Array.from({length:13},(_,i)=>'<option value="'+(i+1)+'">ม.4/'+(i+1)+'</option>').join("");
$("group").innerHTML='<option value="">ไม่ระบุ</option>'+Array.from({length:8},(_,i)=>'<option value="'+(i+1)+'">กลุ่ม '+(i+1)+'</option>').join("");
const dt=new Date();$("date").value=new Date(dt.getTime()-dt.getTimezoneOffset()*60000).toISOString().slice(0,10);$("code").value=sessionStorage.getItem("aihq_teacher_code")||"";
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function info(a){const obj=(a&&typeof a==="object")?a:{};const v=K.map(k=>obj[k]).filter(x=>x!==null&&x!==undefined&&x!=="").map(Number),sum=v.reduce((a,b)=>a+b,0),complete=v.length===5;return{sum,complete,count:v.length,quality:!complete?"ยังไม่ครบ":sum>=14?"ดีมาก":sum>=11?"ดี":sum>=8?"พอใช้":"ปรับปรุง"}}
function ctx(){if(!$("room").value||!$("date").value)throw Error("เลือกห้องและวันที่ก่อน");return{room:Number($("room").value),assessment_date:$("date").value}}
async function api(action,body={}){const code=$("code").value.trim();if(!code)throw Error("กรุณากรอกรหัสครู");sessionStorage.setItem("aihq_teacher_code",code);const r=await fetch(API,{method:"POST",headers:{"content-type":"application/json","x-teacher-code":code},body:JSON.stringify({action,...body})}),j=await r.json();if(!r.ok||!j.ok)throw Error(j.error||"เชื่อมต่อไม่ได้");return j}
function state(s){$("status").textContent=s}
function current(){let c=ctx();if(!student||String(c.room)!==loadedRoom||c.assessment_date!==loadedDate)throw Error("ห้องหรือวันที่เปลี่ยนไป กรุณาโหลดรายชื่อใหม่");let o={...c,student_no:student.student_no,group_no:$("group").value||null,evaluator_name:$("evaluator").value,general_note:$("general").value,evidence_notes:(student.observation&&student.observation.evidence_notes&&typeof student.observation.evidence_notes==="object")?student.observation.evidence_notes:{}};K.forEach(k=>{let v=document.querySelector('input[name="'+k+'"]:checked')?.value||"";o[k]=v?Number(v):null});return o}
function show(no){if(dirty&&!confirm("ข้อมูลยังไม่บันทึก ต้องการเปลี่ยนหรือไม่?"))return;student=rows.find(r=>r.student_no===no);dirty=false;const a=student.observation||{};$("form").hidden=false;$("title").textContent="เลขที่ "+no+" "+student.name;$("group").value=a.group_no||"";$("evaluator").value=a.evaluator_name||"";$("general").value=a.general_note||"";$("criteria").innerHTML=K.map((k,i)=>'<div class="entry"><b>'+(i+1)+". "+L[i]+'</b><div>'+[["","ไม่ประเมิน"],["3","3 สม่ำเสมอ"],["2","2 บ่อยครั้ง"],["1","1 บางครั้ง"]].map(([v,t])=>'<label><input type="radio" name="'+k+'" value="'+v+'" '+(String(a[k]??"")===v?"checked":"")+"> "+t+"</label>").join("")+'</div></div>").join("");$("form").querySelectorAll("input,select,textarea").forEach(e=>e.addEventListener("input",()=>{dirty=true;rating()}));rating();listing()}
function rating(){const z=info(current());$("rating").textContent="คะแนน "+z.sum+"/15 • "+z.count+"/5 รายการ • "+z.quality}
function listing(){const q=$("search").value.toLowerCase();$("list").innerHTML=rows.filter(x=>String(x.student_no).includes(q)||x.name.toLowerCase().includes(q)).map(x=>'<button data-n="'+x.student_no+'" class="'+(student?.student_no===x.student_no?"active":"")+'">'+esc(x.student_no+" "+x.name)+" ("+info(x.observation).count+"/5)</button>").join("");$("list").querySelectorAll("button").forEach(b=>b.onclick=()=>show(Number(b.dataset.n)))}
function summary(){
 const complete=rows.filter(r=>info(r.observation).complete).length;
 $("summary").textContent="ทั้งหมด "+rows.length+" คน • ประเมินครบ "+complete+" คน • ยังไม่ครบ "+(rows.length-complete)+" คน";
 $("summaryRows").innerHTML=rows.map(r=>{
  const a=r.observation||{},z=info(a);
  const criteria=K.map(k=>'<td class="score-cell">'+(a[k]==null?'—':Number(a[k]))+'</td>').join("");
  const total=z.count?(z.sum+"/15"+(z.complete?"":" ("+z.count+"/5)")):"—";
  return '<tr><td>'+r.student_no+'</td><td>'+esc(r.name)+'</td><td class="score-cell">'+esc(a.group_no||"—")+'</td>'+criteria+'<td class="score-cell"><b>'+total+'</b></td><td>'+z.quality+'</td></tr>';
 }).join("");
}
async function load(){if(dirty&&!confirm("มีข้อมูลไม่บันทึก โหลดใหม่หรือไม่?"))return;try{state("กำลังโหลด...");let d=await api("list",ctx());rows=Array.isArray(d.rows)?d.rows:[];loadedRoom=String(d.room);loadedDate=d.assessment_date;student=null;dirty=false;$("form").hidden=true;listing();summary();state("โหลดสำเร็จ "+rows.length+" คน")}catch(e){state("ผิดพลาด: "+e.message)}}
async function save(){if(!student)return;try{$("save").disabled=true;const a=current(),r=await api("save",a);student.observation={...a,updated_at:r.record.updated_at};dirty=false;listing();summary();state("บันทึกสำเร็จ "+student.name)}catch(e){state("บันทึกไม่สำเร็จ: "+e.message)}finally{$("save").disabled=false}}
$("load").onclick=load;$("save").onclick=save;$("search").oninput=listing;

function exportCSV(){
 if(!rows.length)return state("กรุณาโหลดรายชื่อนักเรียนก่อน");
 if(dirty)return state("กรุณาบันทึกข้อมูลที่แก้ไขก่อนส่งออก CSV");
 const headers=["เลขที่","ชื่อ–นามสกุล","ห้อง","วันที่","กลุ่ม",...L,"คะแนนรวม (15)","ระดับคุณภาพ","ผู้ประเมิน","หมายเหตุ"];
 const lines=[headers,...rows.map(r=>{
  const a=r.observation||{},z=info(a);
  return [r.student_no,r.name,"ม.4/"+$("room").value,$("date").value,a.group_no||"",...K.map(k=>a[k]??""),z.count?z.sum:"",z.quality,a.evaluator_name||"",a.general_note||""];
 })];
 const csv="\ufeff"+lines.map(line=>line.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(",")).join("\r\n");
 const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
 const a=document.createElement("a");a.href=url;a.download="WorkObservation_M4-"+$("room").value+"_"+$("date").value+".csv";a.click();
 setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function paper(r){
 const a=r.observation||{},z=info(a);
 const criteria=K.map((k,i)=>'<tr><td>'+(i+1)+'</td><td>'+L[i]+'</td><td class="score-cell">'+(a[k]??"—")+'</td></tr>').join("");
 return '<article class="page"><h2>แบบสังเกตพฤติกรรมการทำงานรายบุคคล</h2>'+
  '<p>ชื่อ–สกุล '+esc(r.name)+' &nbsp; ชั้น ม.4/'+$("room").value+' &nbsp; เลขที่ '+r.student_no+' &nbsp; กลุ่มที่ '+esc(a.group_no||"—")+' &nbsp; วันที่ '+esc($("date").value)+'</p>'+
  '<p>เกณฑ์คะแนน 3 = สม่ำเสมอ • 2 = บ่อยครั้ง • 1 = บางครั้ง • — = ยังไม่ประเมิน</p>'+
  '<table><thead><tr><th>ข้อ</th><th>รายการประเมิน</th><th>คะแนน (เต็ม 3)</th></tr></thead><tbody>'+criteria+'</tbody></table>'+
  '<p><strong>คะแนนรวม '+(z.count?z.sum:"—")+'/15 &nbsp; ระดับคุณภาพ: '+z.quality+'</strong></p>'+
  '<p>ช่วงคะแนน: 14–15 ดีมาก • 11–13 ดี • 8–10 พอใช้ • ต่ำกว่า 8 ปรับปรุง (ประเมินครบ 5 ข้อจึงตัดสินระดับ)</p>'+
  '<p>หมายเหตุ '+esc(a.general_note||"—")+'</p>'+
  '<p>ลงชื่อ ...................................... ผู้ประเมิน ('+esc(a.evaluator_name||"..................")+')</p><p>.........../................................/...........</p></article>';
}
function reportSummary(){
 const count=rows.filter(r=>info(r.observation).complete).length;
 const body=rows.map(r=>{
  const a=r.observation||{},z=info(a);
  return '<tr><td>'+r.student_no+'</td><td>'+esc(r.name)+'</td><td>'+esc(a.group_no||"—")+'</td>'+
   K.map(k=>'<td class="score-cell">'+(a[k]??"—")+'</td>').join("")+
   '<td class="score-cell"><b>'+(z.count?z.sum:"—")+'</b></td><td>'+z.quality+'</td></tr>';
 }).join("");
 return '<article class="report-summary"><h2>สรุปผลแบบสังเกตพฤติกรรมการทำงานรายบุคคล</h2>'+
  '<p>AI to ESP32 • ชั้น ม.4/'+$("room").value+' • วันที่ '+esc($("date").value)+
  ' • นักเรียน '+rows.length+' คน • ประเมินครบ '+count+' คน</p>'+
  '<table><thead><tr><th>เลขที่</th><th>ชื่อ–นามสกุล</th><th>กลุ่ม</th>'+
  K.map((k,i)=>'<th class="score-head">ข้อ '+(i+1)+'</th>').join("")+
  '<th>รวม /15</th><th>ระดับคุณภาพ</th></tr></thead><tbody>'+body+'</tbody></table>'+
  '<p style="font-size:11px">ข้อ 1 แสดงความคิดเห็นโดยอ้างอิงหลักฐาน | ข้อ 2 รับฟังผู้อื่น | ข้อ 3 ทำงานตามหน้าที่ | ข้อ 4 รับผิดชอบและตรงต่อเวลา | ข้อ 5 ใช้เทคโนโลยีเหมาะสม</p>'+
  '<p>เกณฑ์คุณภาพ 14–15 ดีมาก • 11–13 ดี • 8–10 พอใช้ • ต่ำกว่า 8 ปรับปรุง (เฉพาะผู้ได้รับประเมินครบ)</p></article>';
}
function printReport(one){
 if(dirty)return state("กรุณาบันทึกก่อนพิมพ์");
 if(!rows.length)return state("กรุณาโหลดนักเรียนก่อน");
 if(one && !student)return state("กรุณาเลือกนักเรียนก่อน");
 $("report").innerHTML=one?paper(student):reportSummary();window.print();
}
$("csv").onclick=exportCSV;
$("printOne").onclick=()=>printReport(true);
$("printAll").onclick=()=>printReport(false);
$("dates").onclick=async()=>{try{const r=await api("dates",{room:Number($("room").value)});
 if(!r.dates.length)return state("ไม่พบวันที่เคยบันทึก");
 const date=prompt("วันที่เคยประเมิน:\n"+r.dates.slice(0,20).join("\n")+"\nกรอกวันที่",r.dates[0]);
 if(date&&r.dates.includes(date)){$("date").value=date;load()}
 }catch(e){state(e.message)}};
["date","room"].forEach(id=>$(id).addEventListener("change",()=>{if(dirty){$("room").value=loadedRoom;$("date").value=loadedDate;return state("มีข้อมูลไม่บันทึก โปรดบันทึกก่อนเปลี่ยนวันที่หรือห้อง")}rows=[];student=null;loadedRoom="";loadedDate="";$("form").hidden=true;$("list").innerHTML="";summary();state("เลือกห้องหรือวันที่ใหม่แล้ว กรุณากดโหลดรายชื่อ")}));
window.addEventListener("beforeunload",e=>{if(dirty){e.preventDefault();e.returnValue=""}});
