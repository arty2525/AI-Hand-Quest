from pathlib import Path
import re

p=Path('teacher-summary.html')
t=p.read_text(encoding='utf-8')

# Headings and filter
t=t.replace('ชั้นมัธยมศึกษาปีที่ 4/5','ชั้นมัธยมศึกษาปีที่ 4/1–4/13').replace('ว31101 ม.4/5','ว31101 ม.4/1–ม.4/13')
if 'id="roomFilter"' not in t:
    rooms=''.join(f'<option value="{i}">ม.4/{i}</option>' for i in range(1,14))
    filt=f'<label class="text-sm text-slate-300">ห้องเรียน <select id="roomFilter" class="ml-2 rounded-xl px-3 py-2 bg-slate-950/70 border border-white/10"><option value="">ทุกห้อง</option>{rooms}</select></label>'
    t=t.replace('</button></div><div id="stats"','</button>'+filt+'</div><div id="stats"',1)

# Individual table: Room between no and group
t=re.sub(r'<th>เลขที่</th>\s*<th>กลุ่ม</th>', '<th>เลขที่</th><th>ห้อง</th><th>กลุ่ม</th>', t)

# Normalize CSV fields
t=re.sub(
    r"no:\s*rec\.no\s*\|\|\s*rec\.student_no\s*\|\|\s*'-',\s*group:\s*rec\.group\s*\|\|\s*'-',\s*pre:\s*Number\(rec\.pre_score\s*\?\?\s*rec\.pre\s*\?\?\s*0\),",
    "no: rec.no || rec.student_no || '-', room: rec.room || rec.classroom || rec.class || '-', group: rec.group || '-', pre: Number(rec.pre_10 ?? rec.pre_score ?? rec.pre ?? 0),",
    t
)
# Multiline fallback
t=t.replace("no: rec.no || rec.student_no || '-',\n    group: rec.group || '-',\n    pre: Number(rec.pre_score ?? rec.pre ?? 0),","no: rec.no || rec.student_no || '-',\n    room: rec.room || rec.classroom || rec.class || '-',\n    group: rec.group || '-',\n    pre: Number(rec.pre_10 ?? rec.pre_score ?? rec.pre ?? 0),")

# Row renderer
t=re.sub(
    r'<td>\$\{escapeHtml\(String\(r\.no\)\)\}</td>\s*<td>\$\{escapeHtml\(String\(r\.group\)\)\}</td>',
    "<td>${escapeHtml(String(r.no))}</td><td>${r.room==='-'?'-':'ม.4/'+escapeHtml(String(r.room))}</td><td>${escapeHtml(String(r.group))}</td>",
    t
)
t=re.sub(
    r'<td>\$\{esc\(x\.no\)\}</td>\s*<td>\$\{esc\(x\.group\)\}</td>',
    "<td>${esc(x.no)}</td><td>${x.room==='-'?'-':'ม.4/'+esc(x.room)}</td><td>${esc(x.group)}</td>",
    t
)

# Search placeholder
t=t.replace('ค้นหาชื่อ / เลขที่ / กลุ่ม','ค้นหาชื่อ / เลขที่ / ห้อง / กลุ่ม')

# Refresh function for verbose teacher page
pattern=r"function refresh\(\)\{.*?\}\n\n\$\('files'\)\.addEventListener"
replacement="""function refresh(){
  const q=$('search').value.trim().toLowerCase();
  const room=$('roomFilter')?$('roomFilter').value:'';
  let filtered=rows.filter(r=>!room||String(r.room)===String(room));
  if(q){filtered=filtered.filter(r=>String(r.name).toLowerCase().includes(q)||String(r.no).toLowerCase().includes(q)||String(r.room).toLowerCase().includes(q)||String(r.group).toLowerCase().includes(q));}
  renderStats(filtered);renderGroups(filtered);renderStudents(filtered);
}

$('files').addEventListener"""
t=re.sub(pattern,replacement,t,flags=re.S)

if "$('roomFilter').addEventListener('change', refresh);" not in t and "$('search').addEventListener('input', refresh);" in t:
    t=t.replace("$('search').addEventListener('input', refresh);","$('search').addEventListener('input', refresh);\n$('roomFilter').addEventListener('change', refresh);")

# Compact page fallback refresh
if "function refresh(){let q=$('search')" in t:
    t=re.sub(r"function refresh\(\)\{let q=\$\('search'\).*?;render\(d\)\}","function refresh(){let q=$('search').value.trim().toLowerCase(),room=$('roomFilter')?$('roomFilter').value:'',d=R.filter(x=>(!room||String(x.room)===String(room))&&(!q||String(x.name).toLowerCase().includes(q)||String(x.no).toLowerCase().includes(q)||String(x.room).toLowerCase().includes(q)||String(x.group).toLowerCase().includes(q)));render(d)}",t,flags=re.S)

# Export schema room + 10-question pre-test
t=t.replace("['timestamp','name','no','group','pre_score','pre_percent','post_10','post_percent','pass_70','gain_percentage_points','game_1000','first_try_10','attempts','control']","['timestamp','name','no','room','group','pre_10','pre_percent','post_10','post_percent','pass_70','gain_percentage_points','game_1000','first_try_10','attempts','control']")
t=t.replace("[r.timestamp,r.name,r.no,r.group,r.pre,r.prePct,r.post,r.postPct,r.pass,r.gain,r.game,r.firstTry,r.attempts,r.control]","[r.timestamp,r.name,r.no,r.room,r.group,r.pre,r.prePct,r.post,r.postPct,r.pass,r.gain,r.game,r.firstTry,r.attempts,r.control]")
t=t.replace("[x.timestamp,x.name,x.no,x.group,x.pre,x.prePct,x.post,x.postPct,x.pass,x.gain,x.game,x.first,x.attempts,x.control]","[x.timestamp,x.name,x.no,x.room,x.group,x.pre,x.prePct,x.post,x.postPct,x.pass,x.gain,x.game,x.first,x.attempts,x.control]")

# Print title room context when available
t=t.replace("$('printDate').textContent = 'วันที่จัดทำรายงาน: ' + now.toLocaleDateString('th-TH', {year:'numeric',month:'long',day:'numeric'});","const rf=$('roomFilter')?.value; $('printDate').textContent=(rf?`ห้อง ม.4/${rf} • `:'ทุกห้อง • ')+'วันที่จัดทำรายงาน: '+now.toLocaleDateString('th-TH',{year:'numeric',month:'long',day:'numeric'});")

p.write_text(t,encoding='utf-8')
Path('WPA_Submission/media/AI-Hand-Quest-teacher-summary.html').write_text(t,encoding='utf-8')
print('teacher-summary repaired for rooms 1-13')
