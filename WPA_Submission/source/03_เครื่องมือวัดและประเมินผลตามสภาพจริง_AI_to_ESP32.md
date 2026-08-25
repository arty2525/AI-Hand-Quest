# เครื่องมือวัดและประเมินผลตามสภาพจริง
## หน่วยที่ 3 การพัฒนาโครงงาน — AI to ESP32

รายวิชา ว31101 ชั้นมัธยมศึกษาปีที่ 4

---

# 1. หลักการประเมิน

ใช้หลักฐานหลายแหล่ง ไม่ตัดสินจากแบบทดสอบหรือ Mentimeter เพียงอย่างเดียว

- Pre-test 10 ข้อ: Diagnostic ไม่คิดคะแนน
- Mentimeter ท้าย Explore: Formative Assessment / Evidence of Thinking ไม่คิดคะแนนแยก
- ผลการปฏิบัติจริง: 90 คะแนน
- Post-test 10 ข้อ: 10 คะแนน
- คะแนนรวม: 100 คะแนน
- เกณฑ์ Post-test ผ่าน: 7/10 หรือ 70%

---

# 2. หลักฐานตามช่วงการเรียนรู้

| ช่วง | หลักฐาน | ใช้เพื่อ |
|---|---|---|
| ก่อนเรียน | Pre-test 10 ข้อ | วินิจฉัยความเข้าใจเดิม |
| Explore | 3 Stations + System Flow | เห็นการสำรวจ/ทดสอบจริง |
| ท้าย Explore | Mentimeter Q1/Q2 | ตรวจข้อค้นพบและ misconception แบบ real-time |
| Explain | การอธิบายจากผล Menti + การสุ่มถาม | ตรวจเหตุผล/ความเข้าใจ |
| Elaborate | Challenge Before/After Feedback | เห็นพัฒนาการกระบวนการคิด |
| Application | Application Design Card | เชื่อมชีวิตจริง |
| Evaluate | Post-test + Performance Evidence | สรุปผลการเรียนรู้ |

---

# 3. Rubric ผลการปฏิบัติจริง 90 คะแนน

| องค์ประกอบ | คะแนน |
|---|---:|
| AI / Browser Station | 10 |
| ESP32 / Output Station | 10 |
| Integration & Data Flow | 20 |
| System Flow + Input–Process–Output | 15 |
| Challenge Debugging | 20 |
| Application to Real Life | 10 |
| Collaborative Learning | 5 |
| **รวม** | **90** |

> Mentimeter ไม่เพิ่ม/ลดคะแนน 90 คะแนนโดยตรง แต่ใช้เป็นหลักฐานประกอบ Integration, Data Flow, Collaborative Learning และการให้ Feedback ของครู

## 3.1 AI / Browser Station — 10
- ระบุ Browser เป็นผู้ประมวลผล AI ในต้นแบบ
- อ่าน Prediction/Confidence
- อธิบายความไม่เสถียรและแนวทางปรับปรุง

## 3.2 ESP32 / Output Station — 10
- อธิบาย Web Server / Route / GPIO
- ทดสอบ `/on` และ `/off`
- ใช้ผลทดสอบตัดสาเหตุที่ไม่เกี่ยวข้อง

## 3.3 Integration & Data Flow — 20
- ลำดับข้อมูลถูกต้อง
- เชื่อม Browser → HTTP → ESP32
- ระบุจุดเชื่อม Software/Hardware
- ทดสอบ End-to-End
- ใช้ผล Mentimeter อธิบายจุดเสี่ยงของระบบด้วยหลักฐานได้

## 3.4 System Flow + IPO — 15
- Input, Process, Output ถูกต้อง
- Flow อ่านได้และสมเหตุผล

## 3.5 Challenge Debugging — 20
- อาการ → สมมติฐาน → หลักฐาน → การทดสอบ → ตีความ → วิธีแก้
- มี Before / Feedback / After

## 3.6 Application to Real Life — 10
- ปัญหา/ผู้ใช้ชัด
- IPO สมเหตุผล
- ระบุสิ่งที่ต้องปรับ
- มีวิธีทดสอบและคำนึงความปลอดภัย

## 3.7 Collaborative Learning — 5
- ทำตามบทบาท
- แลกเปลี่ยน/รับฟัง
- ใช้หลักฐานร่วมตัดสินใจ
- ตอบ Mentimeter ในนามกลุ่มหลังหารือ ไม่ใช่ความเห็นคนเดียว

---

# 4. การใช้ Mentimeter เป็น Formative Assessment

คำถามหลัก:
1. Open-ended — จุดเสี่ยง/ปัญหา/ข้อค้นพบ + หลักฐาน
2. Multiple Choice — ถ้า AI ตรวจพบ Hand ถูกต้อง แต่ LED ไม่ติด ควรตรวจส่วนใดก่อน

ครูควร:
- เลือกคำตอบ 2–3 ตัวอย่างจากผลจริง
- ใช้ทั้งคำตอบถูกและ misconception
- ถามต่อว่า “หลักฐานนี้ตัดสาเหตุใดออกได้บ้าง?”
- เชื่อมเข้าสู่ Data Flow / IPO / Debugging ใน Explain

หลักฐานที่เก็บ:
- Screenshot Q1
- Screenshot Q2
- คลิปการอภิปรายจากผล Menti
- ใบงานกลุ่มที่สอดคล้องกับคำตอบ

**ห้ามใช้จำนวนคำตอบถูกจาก Mentimeter เป็นผลสัมฤทธิ์หลักโดยลำพัง**

---

# 5. Rubric 4 ระดับ

| ระดับ | ลักษณะ |
|---|---|
| 4 ดีเยี่ยม | เชื่อมโยงครบ ใช้หลักฐานชัด ทดสอบเป็นขั้นตอน อธิบายและประยุกต์ได้ |
| 3 ดี | เชื่อมโยงถูกเป็นส่วนใหญ่ ใช้หลักฐานและแก้ปัญหาได้ด้วยคำชี้แนะเล็กน้อย |
| 2 พอใช้ | เข้าใจบางส่วน ยังทดสอบไม่เป็นระบบหรือเหตุผลไม่ครบ |
| 1 ต้องพัฒนา | เชื่อมโยงระบบไม่ได้ แก้แบบสุ่ม หรืออธิบายหลักฐานไม่ได้ |

เกณฑ์คุณภาพ: ระดับ 3 ขึ้นไป

---

# 6. Pre/Post และพัฒนาการ

Pre-test และ Post-test อย่างละ 10 ข้อ

**พัฒนาการ (จุดเปอร์เซ็นต์) = Post-test (%) – Pre-test (%)**

รายงานร่วมกับ Before/After Feedback, Mentimeter Evidence และผลงานจริง

---

# 7. ระบบดิจิทัล

AI Hand Quest ส่งผลเข้า Teacher Dashboard / Supabase อัตโนมัติ  
Mentimeter เก็บคำตอบเพื่อใช้ระหว่างเรียนและบันทึกเป็นภาพ/คลิปหลักฐาน

ทั้งสองระบบเป็น **เครื่องมือสนับสนุน** ไม่ใช่สาระการเรียนรู้หลัก

---

# 8. การรายงานผล

แยกให้ชัด:
- เป้าหมาย
- ผลจริง
- หลักฐาน
- Misconception ที่ตรวจพบจาก Mentimeter
- Feedback ที่ครูใช้
- พัฒนาการหลัง Feedback
- สิ่งที่จะปรับครั้งต่อไป

ห้ามเติมจำนวนผู้ผ่าน ค่าเฉลี่ย หรือพัฒนาการก่อนมีข้อมูลจริง
