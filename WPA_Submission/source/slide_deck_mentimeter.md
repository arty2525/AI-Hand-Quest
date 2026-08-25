---
title: "AI to ESP32 Prototype"
subtitle: "หน่วยที่ 3 การพัฒนาโครงงาน • ว31101 • 5E + Collaborative Learning"
author: "นายศิวัสว์ โตนอก"
lang: th-TH
aspectratio: 169
---

# ภารกิจวันนี้

**ทำให้ AI และ ESP32 ทำงานร่วมกันได้**  
และเมื่อระบบผิดพลาด ต้องหาสาเหตุจาก **หลักฐาน** ไม่แก้แบบสุ่ม

Webcam → Browser/AI → HTTP → ESP32 → Output

---

# เป้าหมายการเรียนรู้

- อธิบาย Input–Process–Output และ Data Flow
- ระบุบทบาท Browser/AI และ ESP32
- Debug โดยใช้หลักฐานและลำดับการทดสอบ
- ปรับคำตอบหลัง Feedback
- ออกแบบการประยุกต์ต้นแบบกับชีวิตจริง

---

# Engage • 5 นาที

## Fault Demo

**Hand → LED ON**  
**No Hand → LED OFF**

จากนั้นครูสร้างสถานการณ์:

> AI ตรวจพบ Hand แต่ LED ไม่ติด

**อย่าเพิ่งแก้ — หลักฐานอะไรที่เราต้องตรวจ?**

---

# มองระบบเป็น Input–Process–Output

**Input**  
Webcam / ภาพมือ

**Process**  
Browser + AI Model + Prediction + Logic

**Output**  
HTTP → ESP32 → GPIO → LED/อุปกรณ์

---

# Data Flow

Webcam  
↓  
Web Browser  
↓  
AI Model / Prediction  
↓  
JavaScript / HTTP Request  
↓  
ESP32 Web Server  
↓  
GPIO → Output

---

# Explore • 11 นาที

## 3 Stations

**A — AI / Browser**  
Webcam • Hand/No Hand • Prediction • Confidence

**B — ESP32 / Output**  
Web Server • `/on` • `/off` • GPIO

**C — Integration**  
Browser → HTTP → ESP32 → Output

> ทดลอง • สังเกต • บันทึกหลักฐาน • Peer Teaching

---

# Station A — AI / Browser

ตรวจสอบ:

- Webcam เปิดหรือไม่
- AI จำแนก Hand / No Hand ได้หรือไม่
- Prediction เสถียรหรือไม่
- หลักฐานอะไรยืนยันว่า AI ทำงาน

**AI ในต้นแบบนี้ทำงานที่ Browser หรือ ESP32?**

---

# Station B — ESP32 / Output

ทดลอง:

- เปิด `/on` ด้วยตนเอง
- เปิด `/off` ด้วยตนเอง
- สังเกต GPIO / LED

**ถ้า `/on` ทำงาน เราตัดสาเหตุใดออกได้บ้าง?**

---

# Station C — Integration

ตรวจทีละจุด:

1. Webcam
2. Prediction
3. JavaScript condition
4. HTTP request / `fetch`
5. ESP32 route
6. GPIO / Output

> Debugging = ลดพื้นที่ของปัญหาด้วยหลักฐาน

---

# Explore Check-in • Mentimeter • 4 นาที

**1 เครื่อง / กลุ่ม**  
Recorder & Presenter ส่งคำตอบหลังกลุ่มหารือ

เข้าโดยตรง: **https://www.menti.com/alxdzgt83ktx**  
รหัส Menti ปัจจุบัน: **7812 2870**

> สแกน QR_Mentimeter_Join.png ได้โดยตรง และควรตรวจรหัสอีกครั้งก่อนสอนจริง

> Mentimeter ใช้เป็น Formative Assessment ไม่คิดคะแนนแยก

---

# Mentimeter Q1 • Open-ended

**จากการสำรวจ 3 Stations**  
กลุ่มของคุณพบ “จุดเสี่ยง / ปัญหา / ข้อค้นพบ” ที่สำคัญที่สุดคืออะไร

**และมีหลักฐานอะไรสนับสนุน?**

รูปแบบ:

> กลุ่ม X: พบว่า...  
> หลักฐานคือ...

---

# Mentimeter Q2 • Multiple Choice

ถ้า **AI ตรวจพบ Hand ถูกต้อง** แต่ **LED ไม่ติด** ควรตรวจส่วนใดก่อน?

A. ข้อมูลฝึก Teachable Machine  
B. HTTP Route `/on` `/off`, `fetch`, ESP32 Web Server  
C. สีของ LED  
D. เปลี่ยนสายไฟทั้งหมดทันที

---

# จาก Explore → Explain

ครูเลือกคำตอบจริง 2–3 ตัวอย่างจาก Mentimeter

ถามต่อ:

> “หลักฐานนี้ตัดสาเหตุใดออกได้บ้าง?”

> “ถ้า AI ตรวจ Hand ถูกแล้ว เราควรย้อนกลับไป Train AI ก่อนหรือไม่?”

---

# Explain • 8 นาที

## สรุปจากหลักฐานของผู้เรียน

- AI Model ประมวลผลใน **Web Browser**
- ESP32 ทำหน้าที่ **Web Server + Physical Control**
- HTTP เชื่อม Software → Hardware
- Debugging ต้องมี **สมมติฐาน + หลักฐาน + การทดสอบ**

---

# Challenge Debugging • 14 นาที

สุ่ม 1 Challenge:

- AI พบ Hand แต่ LED ไม่ติด
- Webcam เปิดไม่ได้
- Prediction สลับ Hand / No Hand
- `/on` ทำงาน แต่ AI สั่งไม่ได้

**ห้ามแก้แบบสุ่ม**

---

# Before → Feedback → After

## BEFORE
อาการ → สมมติฐาน → หลักฐาน → Test Plan

## FEEDBACK
ครู/เพื่อนถามเพื่อชี้ทาง ไม่เฉลยทันที

## AFTER
ปรับสมมติฐาน → ทดสอบ → ตีความ → วิธีแก้

---

# จาก Prototype สู่ชีวิตจริง

Application Design Card:

1. ปัญหาที่ต้องการแก้
2. ผู้ใช้งาน
3. Input
4. Process
5. Output
6. สิ่งที่ต้องปรับจาก Hand → LED
7. ความเสี่ยง
8. วิธีทดสอบ

---

# Evaluate • 8 นาที

- สุ่มถามสมาชิกในกลุ่ม
- ตรวจ System Flow / Challenge / Application
- Post-test 10 ข้อ
- เกณฑ์ผ่าน 7/10
- ผลส่งเข้า Teacher Dashboard อัตโนมัติ

---

# การประเมิน

**Pre-test 10 ข้อ**  
Diagnostic — ไม่คิดคะแนน

**Performance 90 คะแนน**  
Stations • Flow • Debugging • Application • Collaboration

**Post-test 10 คะแนน**  
รวม 100 คะแนน

Mentimeter = **Formative Evidence**

---

# หลักฐาน วPA ที่ควรเห็น

Pre-test  
→ Stations  
→ Mentimeter Q1/Q2  
→ Explain จากคำตอบผู้เรียน  
→ Challenge Before  
→ Feedback  
→ After  
→ Application  
→ Post-test / Dashboard

---

# Exit Reflection

**วันนี้หลักฐานอะไรทำให้เราเปลี่ยนความคิด?**

**ถ้าพัฒนาต้นแบบต่อ เราจะนำระบบนี้ไปแก้ปัญหาอะไร?**

---

# Backup Plan

ถ้า Mentimeter / Internet ขัดข้อง:

- Q1 → Sticky Note / กระดาษ A5
- Q2 → ป้าย A / B / C / D

**หลักการเดิม:**  
รวบรวมความคิดท้าย Explore → ใช้คำตอบผู้เรียนเข้าสู่ Explain
