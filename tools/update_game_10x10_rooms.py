from pathlib import Path
import re

ROOT=Path('.')
GAME_SRC=ROOT/'WPA_Submission/media/AI-Hand-Quest-final.html'
TEACHER_SRC=ROOT/'WPA_Submission/media/AI-Hand-Quest-teacher-summary.html'

# ---------- Student game ----------
h=GAME_SRC.read_text(encoding='utf-8')
h=h.replace('AI to ESP32 • ว31101 • ม.4/5 • ภาคเรียนที่ 1/2569','AI to ESP32 • ว31101 • ม.4/1–ม.4/13 • ภาคเรียนที่ 1/2569')
old='''<div class="grid md:grid-cols-3 gap-3 mt-5 text-left"><div><label>ชื่อ–สกุล</label><input id="nm" class="w-full rounded-xl px-3 py-2 mt-1"></div><div><label>เลขที่</label><input id="no" class="w-full rounded-xl px-3 py-2 mt-1"></div><div><label>กลุ่ม</label><select id="gp" class="w-full rounded-xl px-3 py-2 mt-1"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option></select></div></div>'''
rooms=''.join(f'<option value="{i}">ม.4/{i}</option>' for i in range(1,14))
new=f'''<div class="grid md:grid-cols-4 gap-3 mt-5 text-left"><div><label>ชื่อ–สกุล</label><input id="nm" class="w-full rounded-xl px-3 py-2 mt-1" placeholder="ชื่อ–สกุล"></div><div><label>เลขที่</label><input id="no" inputmode="numeric" class="w-full rounded-xl px-3 py-2 mt-1" placeholder="เลขที่"></div><div><label>ห้องเรียน</label><select id="room" class="w-full rounded-xl px-3 py-2 mt-1">{rooms}</select></div><div><label>กลุ่ม</label><select id="gp" class="w-full rounded-xl px-3 py-2 mt-1"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option></select></div></div>'''
h=h.replace(old,new)
h=h.replace('ก่อนเรียน 5 ข้อ → เกม 10 ด่าน → ภารกิจ 3 สถานี + Challenge → หลังเรียน 10 ข้อ','ก่อนเรียน 10 ข้อ → เกม 10 ด่าน → ภารกิจ 3 สถานี + Challenge → หลังเรียน 10 ข้อ')
pre="""const PRE=[
['ก่อนเรียน: หากต้องการให้คอมพิวเตอร์จำแนกภาพมือและไม่มีมือ ควรใช้ Project ประเภทใดใน Teachable Machine?',['Image Project','Audio Project','Pose Project'],0],
['ก่อนเรียน: คำว่า Class ในการฝึกโมเดล AI หมายถึงอะไร?',['หมวดของข้อมูลที่ต้องการให้โมเดลจำแนก','ขาของ ESP32','ชื่อเครือข่าย Wi-Fi'],0],
['ก่อนเรียน: หลังจากเก็บภาพตัวอย่างในแต่ละ Class แล้ว ควรทำอะไรต่อ?',['Train Model','เปิด /on','ตั้ง GPIO เป็น HIGH'],0],
['ก่อนเรียน: รูปแบบโมเดลใดเหมาะสำหรับนำไปใช้ใน Web Browser ด้วย JavaScript?',['TensorFlow.js','PDF','PowerPoint'],0],
['ก่อนเรียน: ในระบบ AI to ESP32 ของบทเรียนนี้ ส่วนใดเป็นผู้ประมวลผล AI?',['Web Browser บนคอมพิวเตอร์','ESP32 DevKit V1','LED'],0],
['ก่อนเรียน: หน้าที่หลักของ ESP32 ในระบบนี้คืออะไร?',['เป็น Web Server รับคำสั่งและควบคุม LED','Train โมเดล AI','เปิด Webcam และจำแนกภาพ'],0],
['ก่อนเรียน: Data Flow ใดถูกต้องที่สุด?',['Webcam → Browser/AI → HTTP → ESP32 → LED','ESP32 → AI → Webcam → LED','LED → Browser → ESP32 → AI'],0],
[\"ก่อนเรียน: คำสั่ง fetch('/on') ใน JavaScript ใช้ทำอะไร?\",['ส่ง HTTP Request ไปยัง ESP32','Train โมเดลใหม่','เปิดกล้องโดยตรง'],0],
['ก่อนเรียน: ถ้ากด /on ด้วยตนเองแล้ว LED ติด แต่ AI สั่งแล้วไม่ติด ควรตรวจส่วนใดก่อน?',['Prediction/เงื่อนไข JavaScript ใน Browser','เปลี่ยน LED ทันที','เปลี่ยน GPIO ทุกขา'],0],
['ก่อนเรียน: หาก Webcam เปิดไม่ได้บนหน้าเว็บ สิ่งใดควรตรวจสอบ?',['สิทธิ์กล้องและ Secure Context (HTTPS)','สีของ LED','จำนวน Class เท่านั้น'],0]];"""
h=re.sub(r'const PRE=\[.*?\];\nconst GAME=',lambda m:pre+'\nconst GAME=',h,flags=re.S)
h=h.replace("id={name:document.getElementById('nm').value||'-',no:document.getElementById('no').value||'-',group:document.getElementById('gp').value};","id={name:(document.getElementById('nm').value||'-').trim(),no:(document.getElementById('no').value||'-').trim(),room:document.getElementById('room').value,group:document.getElementById('gp').value};")
h=h.replace("S==='PRE'?`ก่อนเรียน ${i+1}/5`","S==='PRE'?`ก่อนเรียน ${i+1}/10`")
h=h.replace("x.fillText(`ก่อนเรียน ${pre}/5`,W()/2,H()*.22);","x.fillText(`ก่อนเรียน ${pre}/10`,W()/2,H()*.22);")
h=h.replace("x.fillText(`กลุ่ม ${id.group} • 5 คน • อุปกรณ์ 3 ชุด`,W()/2,H()*.21);","x.fillText(`ม.4/${id.room} • กลุ่ม ${id.group} • 5 คน • อุปกรณ์ 3 ชุด`,W()/2,H()*.21);")
h=h.replace("x.fillText(`${id.name} • เลขที่ ${id.no} • กลุ่ม ${id.group}`,W()/2,H()*.215);","x.fillText(`${id.name} • เลขที่ ${id.no} • ม.4/${id.room} • กลุ่ม ${id.group}`,W()/2,H()*.215);")
h=h.replace("['timestamp','name','no','group','pre_score','pre_percent','post_10','post_percent','pass_70','gain_percentage_points','game_1000','first_try_10','attempts','control']","['timestamp','name','no','room','group','pre_10','pre_percent','post_10','post_percent','pass_70','gain_percentage_points','game_1000','first_try_10','attempts','control']")
h=h.replace("[new Date().toISOString(),id.name,id.no,id.group,pre,prePct,post,pct,passed,pct-prePct,score,first,total,control]","[new Date().toISOString(),id.name,id.no,id.room,id.group,pre,prePct,post,pct,passed,pct-prePct,score,first,total,control]")
h=h.replace("a.download=`AIHQ_G${id.group}_${id.no}.csv`;","a.download=`AIHQ_M4-${id.room}_G${id.group}_No${id.no}.csv`;")
(ROOT/'index.html').write_text(h,encoding='utf-8')
GAME_SRC.write_text(h,encoding='utf-8')

# ---------- Teacher summary ----------
t=TEACHER_SRC.read_text(encoding='utf-8')
t=t.replace('ชั้นมัธยมศึกษาปีที่ 4/5','ชั้นมัธยมศึกษาปีที่ 4/1–4/13').replace('ว31101 ม.4/5','ว31101 ม.4/1–ม.4/13')
room_filter='<label class="text-sm text-slate-300">ห้องเรียน <select id="roomFilter" class="ml-2 rounded-xl px-3 py-2 bg-slate-950/70 border border-white/10"><option value="">ทุกห้อง</option>'+''.join(f'<option value="{i}">ม.4/{i}</option>' for i in range(1,14))+'</select></label>'
if 'id="roomFilter"' not in t:
    t=t.replace('<button id="resetBtn" class="px-4 py-2 rounded-xl glass font-bold">ล้างข้อมูล</button>','<button id="resetBtn" class="px-4 py-2 rounded-xl glass font-bold">ล้างข้อมูล</button>'+room_filter)
t=t.replace('<th>เลขที่</th>\n              <th>กลุ่ม</th>','<th>เลขที่</th>\n              <th>ห้อง</th>\n              <th>กลุ่ม</th>')
t=t.replace("no: rec.no || rec.student_no || '-',\n    group: rec.group || '-',\n    pre: Number(rec.pre_score ?? rec.pre ?? 0),","no: rec.no || rec.student_no || '-',\n    room: rec.room || rec.classroom || rec.class || '-',\n    group: rec.group || '-',\n    pre: Number(rec.pre_10 ?? rec.pre_score ?? rec.pre ?? 0),")
t=t.replace('<td>${escapeHtml(String(r.no))}</td>\n      <td>${escapeHtml(String(r.group))}</td>','<td>${escapeHtml(String(r.no))}</td>\n      <td>${r.room===\'-\'?\'-\':\'ม.4/\'+escapeHtml(String(r.room))}</td>\n      <td>${escapeHtml(String(r.group))}</td>')
t=t.replace("String(r.no).toLowerCase().includes(q) ||\n    String(r.group).toLowerCase().includes(q)","String(r.no).toLowerCase().includes(q) ||\n    String(r.room).toLowerCase().includes(q) ||\n    String(r.group).toLowerCase().includes(q)")
old_refresh="""function refresh(){
  const q = $('search').value.trim().toLowerCase();
  const filtered = !q ? rows : rows.filter(r =>
    String(r.name).toLowerCase().includes(q) ||
    String(r.no).toLowerCase().includes(q) ||
    String(r.room).toLowerCase().includes(q) ||
    String(r.group).toLowerCase().includes(q)
  );
  renderStats(filtered);
  renderGroups(filtered);
  renderStudents(filtered);
}"""
new_refresh="""function refresh(){
  const q = $('search').value.trim().toLowerCase();
  const room = $('roomFilter') ? $('roomFilter').value : '';
  let filtered = rows.filter(r => !room || String(r.room)===String(room));
  if(q){filtered=filtered.filter(r=>String(r.name).toLowerCase().includes(q)||String(r.no).toLowerCase().includes(q)||String(r.room).toLowerCase().includes(q)||String(r.group).toLowerCase().includes(q));}
  renderStats(filtered);renderGroups(filtered);renderStudents(filtered);
}"""
if old_refresh in t:t=t.replace(old_refresh,new_refresh)
t=t.replace("$('search').addEventListener('input', refresh);","$('search').addEventListener('input', refresh);\n$('roomFilter').addEventListener('change', refresh);")
t=t.replace("$('search').value='';\n  refresh();","$('search').value='';\n  if($('roomFilter')) $('roomFilter').value='';\n  refresh();")
t=t.replace("['timestamp','name','no','group','pre_score','pre_percent','post_10','post_percent','pass_70','gain_percentage_points','game_1000','first_try_10','attempts','control']","['timestamp','name','no','room','group','pre_10','pre_percent','post_10','post_percent','pass_70','gain_percentage_points','game_1000','first_try_10','attempts','control']")
t=t.replace("[r.timestamp,r.name,r.no,r.group,r.pre,r.prePct,r.post,r.postPct,r.pass,r.gain,r.game,r.firstTry,r.attempts,r.control]","[r.timestamp,r.name,r.no,r.room,r.group,r.pre,r.prePct,r.post,r.postPct,r.pass,r.gain,r.game,r.firstTry,r.attempts,r.control]")
t=t.replace("{name:'กิตติ',no:'1',group:'1'","{name:'กิตติ',no:'1',room:'5',group:'1'").replace("{name:'ขวัญใจ',no:'2',group:'1'","{name:'ขวัญใจ',no:'2',room:'5',group:'1'").replace("{name:'จิรภา',no:'3',group:'2'","{name:'จิรภา',no:'3',room:'6',group:'2'").replace("{name:'ธนกฤต',no:'4',group:'2'","{name:'ธนกฤต',no:'4',room:'6',group:'2'")
t=t.replace("$('printDate').textContent = 'วันที่จัดทำรายงาน: ' + now.toLocaleDateString('th-TH', {year:'numeric',month:'long',day:'numeric'});","const rf=$('roomFilter')?.value; $('printDate').textContent = (rf?`ห้อง ม.4/${rf} • `:'ทุกห้อง • ') + 'วันที่จัดทำรายงาน: ' + now.toLocaleDateString('th-TH', {year:'numeric',month:'long',day:'numeric'});")
(ROOT/'teacher-summary.html').write_text(t,encoding='utf-8')
TEACHER_SRC.write_text(t,encoding='utf-8')

print('Updated student game and teacher summary')
