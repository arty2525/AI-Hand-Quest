from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.formatting.rule import CellIsRule, ColorScaleRule, DataBarRule
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.chart import BarChart, Reference
from openpyxl.utils import get_column_letter
from pathlib import Path

OUT=Path('WPA_Submission/docs/06_แบบบันทึกคะแนนและสรุปผล_40คน.xlsx')
OUT.parent.mkdir(parents=True,exist_ok=True)

wb=Workbook()
ws=wb.active
ws.title='คะแนนรายบุคคล'
dash=wb.create_sheet('Dashboard')
rub=wb.create_sheet('เกณฑ์คะแนน')
imp=wb.create_sheet('นำเข้าระบบ')

DARK='123B46'; TEAL='0F6B78'; LIGHT='DFF1F4'; WHITE='FFFFFF'
thin=Side(style='thin',color='D1D5DB')

def head(cell,fill=TEAL,size=11):
    cell.fill=PatternFill('solid',fgColor=fill)
    cell.font=Font(name='Noto Sans Thai',bold=True,color=WHITE,size=size)
    cell.alignment=Alignment(horizontal='center',vertical='center',wrap_text=True)
    cell.border=Border(bottom=thin)

def normal(cell,center=False):
    cell.font=Font(name='Noto Sans Thai',size=10)
    cell.alignment=Alignment(horizontal='center' if center else 'left',vertical='center',wrap_text=True)
    cell.border=Border(bottom=thin)

ws.merge_cells('A1:T1')
ws['A1']='แบบบันทึกคะแนนและสรุปผล — หน่วยที่ 3 การพัฒนาโครงงาน: AI to ESP32'
head(ws['A1'],DARK,15)
ws.merge_cells('A2:T2')
ws['A2']='ว31101 ม.4 | เลือกห้อง ม.4/1–ม.4/13 | Pre-test 10 ข้อ (วินิจฉัย) | ปฏิบัติ 90 + Post-test 10 = 100'
ws['A2'].fill=PatternFill('solid',fgColor=LIGHT)
ws['A2'].font=Font(name='Noto Sans Thai',bold=True)
ws['A2'].alignment=Alignment(horizontal='center')

headers=['เลขที่','ชื่อ-สกุล','ห้อง','กลุ่ม','Pre /10','Pre %','Post /10','Post %','ผล 70%','พัฒนาการ (จุด%)','AI/Browser /10','ESP32/Output /10','Integration /20','System Flow+IPO /15','Debugging /20','Application /10','Collaborative /5','ปฏิบัติ /90','รวม /100','หมายเหตุ']
for c,h in enumerate(headers,1):
    ws.cell(4,c,h); head(ws.cell(4,c))

for i in range(1,41):
    r=4+i
    ws.cell(r,1,i)
    ws.cell(r,4,(i-1)//5+1)
    ws.cell(r,6,f'=IF(E{r}="","",E{r}/10*100)')
    ws.cell(r,8,f'=IF(G{r}="","",G{r}/10*100)')
    ws.cell(r,9,f'=IF(H{r}="","",IF(H{r}>=70,"ผ่าน","ไม่ผ่าน"))')
    ws.cell(r,10,f'=IF(OR(F{r}="",H{r}=""),"",H{r}-F{r})')
    ws.cell(r,18,f'=IF(COUNTA(K{r}:Q{r})=0,"",SUM(K{r}:Q{r}))')
    ws.cell(r,19,f'=IF(OR(G{r}="",R{r}=""),"",G{r}+R{r})')
    for c in range(1,21): normal(ws.cell(r,c),center=(c not in [2,20]))

widths={'A':7,'B':24,'C':9,'D':8,'E':9,'F':9,'G':9,'H':9,'I':11,'J':15,'K':13,'L':13,'M':13,'N':15,'O':12,'P':13,'Q':14,'R':12,'S':12,'T':22}
for col,w in widths.items(): ws.column_dimensions[col].width=w
ws.freeze_panes='A5'; ws.row_dimensions[4].height=42

for rng,lo,hi in [('C5:C44',1,13),('D5:D44',1,8),('E5:E44',0,10),('G5:G44',0,10),('K5:K44',0,10),('L5:L44',0,10),('M5:M44',0,20),('N5:N44',0,15),('O5:O44',0,20),('P5:P44',0,10),('Q5:Q44',0,5)]:
    dv=DataValidation(type='decimal',operator='between',formula1=lo,formula2=hi,allow_blank=True); ws.add_data_validation(dv); dv.add(rng)

ws.conditional_formatting.add('I5:I44',CellIsRule(operator='equal',formula=['"ผ่าน"'],fill=PatternFill('solid',fgColor='DCFCE7')))
ws.conditional_formatting.add('I5:I44',CellIsRule(operator='equal',formula=['"ไม่ผ่าน"'],fill=PatternFill('solid',fgColor='FEE2E2')))
ws.conditional_formatting.add('J5:J44',ColorScaleRule(start_type='min',start_color='FEE2E2',mid_type='percentile',mid_value=50,mid_color='FEF3C7',end_type='max',end_color='DCFCE7'))
ws.conditional_formatting.add('S5:S44',DataBarRule(start_type='num',start_value=0,end_type='num',end_value=100,color='5B9BD5'))

rub.merge_cells('A1:D1'); rub['A1']='เกณฑ์คะแนนรวม 100 คะแนน'; head(rub['A1'],DARK,15)
for c,h in enumerate(['องค์ประกอบ','คะแนนเต็ม','เกณฑ์คุณภาพ','หลักฐาน'],1): rub.cell(3,c,h); head(rub.cell(3,c))
rub_rows=[('Post-test',10,'ผ่าน 7/10','ผลจาก AI Hand Quest / Teacher Dashboard'),('AI / Browser Station',10,'ระดับดีขึ้นไป','Prediction / คำอธิบาย'),('ESP32 / Output Station',10,'ระดับดีขึ้นไป','/on /off / Web Server / GPIO'),('Integration & Data Flow',20,'ระดับดีขึ้นไป','End-to-End Test'),('System Flow + IPO',15,'ระดับดีขึ้นไป','แผนภาพและคำอธิบาย'),('Challenge Debugging',20,'ระดับดีขึ้นไป','Before / Feedback / After'),('Application to Real Life',10,'ระดับดีขึ้นไป','Application Design Card'),('Collaborative Learning',5,'ระดับดีขึ้นไป','Peer Teaching / สุ่มถามสมาชิก')]
for r,row in enumerate(rub_rows,4):
    for c,v in enumerate(row,1): rub.cell(r,c,v); normal(rub.cell(r,c),center=(c==2))
for col,w in {'A':29,'B':12,'C':22,'D':46}.items(): rub.column_dimensions[col].width=w

imp.merge_cells('A1:P1'); imp['A1']='รูปแบบข้อมูลจาก Teacher Dashboard / Supabase'; head(imp['A1'],DARK,14)
imp_headers=['created_at','name','student_no','room','group_no','mode','pre_score','pre_percent','post_score','post_percent','passed','gain_percentage_points','game_score','first_try','attempts','control']
for c,h in enumerate(imp_headers,1): imp.cell(3,c,h); head(imp.cell(3,c))
for c in range(1,len(imp_headers)+1): imp.column_dimensions[get_column_letter(c)].width=18
imp.freeze_panes='A4'

dash.merge_cells('A1:J1'); dash['A1']='Dashboard สรุปผล — หน่วยที่ 3 การพัฒนาโครงงาน AI to ESP32'; head(dash['A1'],DARK,16)
dash.merge_cells('A2:J2'); dash['A2']='ว31101 ม.4 | Pre/Post อย่างละ 10 ข้อ | ผลงานปฏิบัติ 90 + Post-test 10'; dash['A2'].fill=PatternFill('solid',fgColor=LIGHT); dash['A2'].font=Font(name='Noto Sans Thai',bold=True); dash['A2'].alignment=Alignment(horizontal='center')
for c,h in enumerate(['นักเรียนที่กรอกชื่อ','ผ่าน Post-test','ไม่ผ่าน','Pre เฉลี่ย %','Post เฉลี่ย %','พัฒนาการเฉลี่ย'],1): dash.cell(4,c,h); head(dash.cell(4,c))
forms=['=COUNTIF(คะแนนรายบุคคล!B5:B44,"<>")','=COUNTIF(คะแนนรายบุคคล!I5:I44,"ผ่าน")','=COUNTIF(คะแนนรายบุคคล!I5:I44,"ไม่ผ่าน")','=IFERROR(AVERAGE(คะแนนรายบุคคล!F5:F44),0)','=IFERROR(AVERAGE(คะแนนรายบุคคล!H5:H44),0)','=IFERROR(AVERAGE(คะแนนรายบุคคล!J5:J44),0)']
for c,f in enumerate(forms,1): dash.cell(5,c,f); normal(dash.cell(5,c),True); dash.cell(5,c).font=Font(name='Noto Sans Thai',bold=True,size=15)
for c,h in enumerate(['กลุ่ม','จำนวนนักเรียน','ผ่าน','Post เฉลี่ย %','คะแนนรวมเฉลี่ย /100'],1): dash.cell(8,c,h); head(dash.cell(8,c))
for g in range(1,9):
    r=8+g; dash.cell(r,1,g); dash.cell(r,2,f'=COUNTIFS(คะแนนรายบุคคล!D5:D44,A{r},คะแนนรายบุคคล!B5:B44,"<>")'); dash.cell(r,3,f'=COUNTIFS(คะแนนรายบุคคล!D5:D44,A{r},คะแนนรายบุคคล!I5:I44,"ผ่าน")'); dash.cell(r,4,f'=IFERROR(AVERAGEIFS(คะแนนรายบุคคล!H5:H44,คะแนนรายบุคคล!D5:D44,A{r}),0)'); dash.cell(r,5,f'=IFERROR(AVERAGEIFS(คะแนนรายบุคคล!S5:S44,คะแนนรายบุคคล!D5:D44,A{r}),0)')
    for c in range(1,6): normal(dash.cell(r,c),True)
dash.merge_cells('G4:J4'); dash['G4']='หลักฐานที่ควรพิจารณาร่วมกับคะแนน'; head(dash['G4'])
dash.merge_cells('G5:J9'); dash['G5']='• System Flow + Input–Process–Output\n• Challenge Before/After Feedback\n• Application Design Card\n• การสุ่มถามสมาชิก\n• ผลปฏิบัติจริง 90 คะแนน\n• Post-test 10 คะแนน'; dash['G5'].fill=PatternFill('solid',fgColor='FFF7D6'); dash['G5'].alignment=Alignment(wrap_text=True,vertical='top'); dash['G5'].font=Font(name='Noto Sans Thai',size=10)
for col,w in {'A':16,'B':17,'C':14,'D':16,'E':20,'F':18,'G':18,'H':18,'I':18,'J':18}.items(): dash.column_dimensions[col].width=w
chart=BarChart(); chart.type='col'; chart.title='Post-test เฉลี่ยรายกลุ่ม'; chart.y_axis.title='เปอร์เซ็นต์'; chart.x_axis.title='กลุ่ม'; data=Reference(dash,min_col=4,min_row=8,max_row=16); cats=Reference(dash,min_col=1,min_row=9,max_row=16); chart.add_data(data,titles_from_data=True); chart.set_categories(cats); chart.height=8; chart.width=13; dash.add_chart(chart,'G11')

wb.save(OUT)
print(f'Saved {OUT}')
