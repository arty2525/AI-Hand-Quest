from pathlib import Path
p=Path('teacher-summary.html')
t=p.read_text(encoding='utf-8')
old="function refresh(){const q=$('search').value.trim().toLowerCase(),filtered=!q?rows:rows.filter(r=>String(r.name).toLowerCase().includes(q)||String(r.no).toLowerCase().includes(q)||String(r.group).toLowerCase().includes(q));renderStats(filtered);renderGroups(filtered);renderStudents(filtered)}"
new="function refresh(){const q=$('search').value.trim().toLowerCase(),room=$('roomFilter')?$('roomFilter').value:'';let filtered=rows.filter(r=>!room||String(r.room)===String(room));if(q)filtered=filtered.filter(r=>String(r.name).toLowerCase().includes(q)||String(r.no).toLowerCase().includes(q)||String(r.room).toLowerCase().includes(q)||String(r.group).toLowerCase().includes(q));renderStats(filtered);renderGroups(filtered);renderStudents(filtered)}"
t=t.replace(old,new)
if "$('roomFilter').addEventListener('change',refresh);" not in t:
    t=t.replace("$('search').addEventListener('input',refresh);","$('search').addEventListener('input',refresh);$('roomFilter').addEventListener('change',refresh);")
t=t.replace("$('resetBtn').onclick=()=>{rows.length=0;$('files').value='';$('search').value='';refresh()};","$('resetBtn').onclick=()=>{rows.length=0;$('files').value='';$('search').value='';if($('roomFilter'))$('roomFilter').value='';refresh()};")
t=t.replace("$('printDate').textContent='วันที่จัดทำรายงาน: '+now.toLocaleDateString('th-TH',{year:'numeric',month:'long',day:'numeric'});","const rf=$('roomFilter')?.value;$('printDate').textContent=(rf?`ห้อง ม.4/${rf} • `:'ทุกห้อง • ')+'วันที่จัดทำรายงาน: '+now.toLocaleDateString('th-TH',{year:'numeric',month:'long',day:'numeric'});")
t=t.replace("{name:'กิตติ',no:'1',room:'5',group:'1',pre:2,prePct:40","{name:'กิตติ',no:'1',room:'5',group:'1',pre:4,prePct:40")
t=t.replace("{name:'ขวัญใจ',no:'2',room:'5',group:'1',pre:3,prePct:60","{name:'ขวัญใจ',no:'2',room:'5',group:'1',pre:6,prePct:60")
t=t.replace("{name:'จิรภา',no:'3',room:'6',group:'2',pre:1,prePct:20","{name:'จิรภา',no:'3',room:'6',group:'2',pre:2,prePct:20")
t=t.replace("{name:'ธนกฤต',no:'4',room:'6',group:'2',pre:4,prePct:80","{name:'ธนกฤต',no:'4',room:'6',group:'2',pre:8,prePct:80")
p.write_text(t,encoding='utf-8')
Path('WPA_Submission/media/AI-Hand-Quest-teacher-summary.html').write_text(t,encoding='utf-8')
print('room filter fixed')
