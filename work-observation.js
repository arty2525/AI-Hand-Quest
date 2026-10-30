const $=id=>document.getElementById(id),API="https://ckiltjhcvxriwjfreqfz.supabase.co/functions/v1/teacher-work-observation",K=["expressing_evidence","listening","assigned_work","responsibility_time","technology_use"],L=["การแสดงความคิดเห็นโดยอ้างอิงหลักฐาน","การยอมรับฟังความคิดเห็นของผู้อื่น","การทำงานตามหน้าที่ที่ได้รับมอบหมาย","ความรับผิดชอบและการตรงต่อเวลา","การใช้เทคโนโลยีอย่างเหมาะสม"];let rows=[],student=null,dirty=false;
$("room").innerHTML='<option value="">เลือกห้อง</option>'+Array.from({length:13},(_,i)=>'<option value="'+(i+1)+'">ม.4/'+(i+1)+'</option>').join("");
$("group").innerHTML='<option value="">ไม่ระบุ</option>'+Array.from({length:8},(_,i)=>'<option value="'+(i+1)+'">กลุ่ม '+(i+1)+'</option>').join("");
const dt=new Date();$("date").value=new Date(dt.getTime()-dt.getTimezoneOffset()*60000).toISOString().slice(0,10);$("code").value=sessionStorage.getItem("aihq_teacher_code")||"";
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function info(a){const obj=(a&&typeof a==="object")?a:{};const v=K.map(k=>obj[k]).filter(x=>x!==null&&x!==undefined&&x!=="").map(Number),sum=v.reduce((a,b)=>a+b,0),complete=v.length===5;return{sum,complete,count:v.length,quality:!complete?"ยังไม่ครบ":sum>=14?"ดีมาก":sum>=11?"ดี":sum>=8?"พอใช้":"ปรับปรุง"}}
function ctx(){if(!$("room").value||!$("date").value)throw Error("เลือกห้องและวันที่ก่อน");return{room:Number($("room").value),assessment_date:$("date").value}}
async function api(action,body={}){const code=$("code").value.trim();if(!code)throw Error("กรุณากรอกรหัสครู");sessionStorage.setItem("aihq_teacher_code",code);const r=await fetch(API,{method:"POST",headers:{"content-type":"application/json","x-teacher-code":code},body:JSON.stringify({action,...body})}),j=await r.json();if(!r.ok||!j.ok)throw Error(j.error||"เชื่อมต่อไม่ได้");return j}
function state(s){$("status").textContent=s}
function current(){let o={...ctx(),student_no:student.student_no,group_no:$("group").value||null,evaluator_name:$("evaluator").value,general_note:$("general").value,evidence_notes:{}};K.forEach(k=>{let v=document.querySelector('input[name="'+k+'"]:checked')?.value||"";o[k]=v?Number(v):null;o.evidence_notes[k]=$("note_"+k).value});return o}
function show(no){if(dirty&&!confirm("ข้อมูลยังไม่บันทึก ต้องการเปลี่ยนหรือไม่?"))return;student=rows.find(r=>r.student_no===no);dirty=false;const a=student.observation||{},notes=a.evidence_notes||{};$("form").hidden=false;$("title").textContent="เลขที่ "+no+" "+student.name;$("group").value=a.group_no||"";$("evaluator").value=a.evaluator_name||"";$("general").value=a.general_note||"";$("criteria").innerHTML=K.map((k,i)=>'<div class="entry"><b>'+(i+1)+". "+L[i]+'</b><div>'+[["","ไม่ประเมิน"],["3","3 สม่ำเสมอ"],["2","2 บ่อยครั้ง"],["1","1 บางครั้ง"]].map(([v,t])=>'<label><input type="radio" name="'+k+'" value="'+v+'" '+(String(a[k]??"")===v?"checked":"")+"> "+t+"</label>").join("")+'</div><textarea id="note_'+k+'" placeholder="หลักฐานที่สังเกตจริง">'+esc(notes[k]||"")+"</textarea></div>").join("");$("form").querySelectorAll("input,select,textarea").forEach(e=>e.addEventListener("input",()=>{dirty=true;rating()}));rating();listing()}
function rating(){const z=info(current());$("rating").textContent="คะแนน "+z.sum+"/15 • "+z.count+"/5 รายการ • "+z.quality}
function listing(){const q=$("search").value.toLowerCase();$("list").innerHTML=rows.filter(x=>String(x.student_no).includes(q)||x.name.toLowerCase().includes(q)).map(x=>'<button data-n="'+x.student_no+'" class="'+(student?.student_no===x.student_no?"active":"")+'">'+esc(x.student_no+" "+x.name)+" ("+info(x.observation).count+"/5)</button>").join("");$("list").querySelectorAll("button").forEach(b=>b.onclick=()=>show(Number(b.dataset.n)))}
function summary(){const complete=rows.filter(r=>info(r.observation).complete).length;$("summary").textContent="ทั้งหมด "+rows.length+" คน ประเมินครบ "+complete+" คน";$("summaryRows").innerHTML=rows.map(r=>{let a=r.observation||{},z=info(a);return"<tr><td>"+r.student_no+"</td><td>"+esc(r.name)+"</td><td>"+(a.group_no||"—")+"</td><td>"+(z.count?z.sum+"/15":"—")+"</td><td>"+z.quality+"</td></tr>"}).join("")}
async function load(){if(dirty&&!confirm("มีข้อมูลไม่บันทึก โหลดใหม่หรือไม่?"))return;try{state("กำลังโหลด...");let d=await api("list",ctx());rows=Array.isArray(d.rows)?d.rows:[];student=null;dirty=false;$("form").hidden=true;listing();summary();state("โหลดสำเร็จ "+rows.length+" คน")}catch(e){state("ผิดพลาด: "+e.message)}}
async function save(){if(!student)return;try{$("save").disabled=true;const a=current(),r=await api("save",a);student.observation={...a,updated_at:r.record.updated_at};dirty=false;listing();summary();state("บันทึกสำเร็จ "+student.name)}catch(e){state("บันทึกไม่สำเร็จ: "+e.message)}finally{$("save").disabled=false}}
$("load").onclick=load;$("save").onclick=save;$("search").oninput=listing;

function exportCSV(){
 const headers=["เลขที่","ชื่อ–นามสกุล","ห้อง","วันที่","กลุ่ม",...L,"คะแนนรวม","ระดับ","ผู้ประเมิน",...L.map(v=>"หลักฐาน "+v),"หมายเหตุ"];
 const data=[headers,...rows.map(r=>{const a=r.observation||{},z=info(a),notes=a.evidence_notes||{};return[r.student_no,r.name,"ม.4/"+$("room").value,$("date").value,a.group_no||"",...K.map(k=>a[k]??""),z.count?z.sum:"",z.quality,a.evaluator_name||"",...K.map(k=>notes[k]||""),a.general_note||""]})].map(row=>row.map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(",")).join("\r\n");
 const url=URL.createObjectURL(new Blob(["\ufeff"+data],{type:"text/csv;charset=utf-8"})),a=document.createElement("a");a.href=url;a.download="WorkObservation_M4-"+$("room").value+"_"+$("date").value+".csv";a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function paper(r){
 const a=r.observation||{},notes=a.evidence_notes||{},z=info(a);
 return '<article class="page"><h2>แบบสังเกตพฤติกรรมการทำงานรายบุคคล</h2><p>ชื่อ–สกุล '+esc(r.name)+' ชั้น ม.4/'+$("room").value+' เลขที่ '+r.student_no+' กลุ่มที่ '+esc(a.group_no||"—")+' วันที่ '+esc($("date").value)+'</p><p>คำชี้แจง: สังเกตพฤติกรรมระหว่างกิจกรรม หากไม่มีหลักฐานเพียงพอให้เว้นไว้และประเมินเพิ่มเติม</p><table><tr><th>ลำดับ</th><th>รายการประเมิน</th><th>3</th><th>2</th><th>1</th><th>หลักฐานที่สังเกตได้</th></tr>'+K.map((k,i)=>'<tr><td>'+(i+1)+'</td><td>'+L[i]+'</td>'+[3,2,1].map(n=>'<td>'+(Number(a[k])===n?'✓':'□')+'</td>').join("")+'<td>'+esc(notes[k]||"—")+'</td></tr>').join("")+'</table><p>คะแนนรวม '+(z.count?z.sum:"—")+'/15 • ระดับคุณภาพ '+z.quality+'</p><p>3 = สม่ำเสมอ, 2 = บ่อยครั้ง, 1 = บางครั้ง<br>14–15 ดีมาก, 11–13 ดี, 8–10 พอใช้, ต่ำกว่า 8 ปรับปรุง (เมื่อประเมินครบ 5 รายการ)</p><p>หมายเหตุ '+esc(a.general_note||"—")+'</p><p>ลงชื่อ ...................................... ผู้ประเมิน ('+esc(a.evaluator_name||"..................")+')</p><p>.........../................................/...........</p></article>';
}
function printReport(one){
 if(dirty)return state("กรุณาบันทึกก่อนพิมพ์");
 const selectedRows=one?(student?[student]:[]):rows;
 if(!selectedRows.length)return state("กรุณาโหลดนักเรียนก่อน");
 $("report").innerHTML=selectedRows.map(paper).join("");window.print();
}
$("csv").onclick=exportCSV;
$("printOne").onclick=()=>printReport(true);
$("printAll").onclick=()=>printReport(false);
$("dates").onclick=async()=>{try{const r=await api("dates",{room:Number($("room").value)});
 if(!r.dates.length)return state("ไม่พบวันที่เคยบันทึก");
 const date=prompt("วันที่เคยประเมิน:\n"+r.dates.slice(0,20).join("\n")+"\nกรอกวันที่",r.dates[0]);
 if(date&&r.dates.includes(date)){$("date").value=date;load()}
 }catch(e){state(e.message)}};
["date","room"].forEach(id=>$(id).addEventListener("change",()=>{if(dirty)return state("มีข้อมูลไม่บันทึก โปรดบันทึกก่อนเปลี่ยนวันที่หรือห้อง");rows=[];student=null;$("form").hidden=true;$("list").innerHTML="";summary()}));
window.addEventListener("beforeunload",e=>{if(dirty){e.preventDefault();e.returnValue=""}});
