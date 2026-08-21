# AI Hand Quest — Teachable Machine × ESP32

เกม AR สำหรับนักเรียน ม.4/5 รายวิชา **เทคโนโลยี (วิทยาการคำนวณ 1) ว31101**  
ภาคเรียนที่ 1 ปีการศึกษา 2569  
ครูผู้สอน **นายศิวัสว์ โตนอก**

## จุดประสงค์

ใช้เป็นส่วนหนึ่งของแผนการจัดการเรียนรู้แบบ Active Learning 5E ร่วมกับ Collaborative Learning เพื่อให้ผู้เรียนเข้าใจสถาปัตยกรรม

`Webcam → Browser/AI → Prediction → HTTP → ESP32 → LED`

## ลำดับกิจกรรมในเกม

1. กรอกชื่อ เลขที่ และกลุ่ม 1–8
2. ประเมินก่อนเรียน 5 ข้อ
3. เกมเรียนรู้ 10 ด่าน
4. หน้าภารกิจปฏิบัติจริงแบบ Collaborative
   - AI Station
   - ESP32 Station
   - Integration Station
   - Challenge Debugging
5. ประเมินหลังเรียน 5 ข้อ
6. แสดงคะแนนก่อน–หลัง พัฒนาการ คะแนนเกม และจำนวนครั้งที่พยายาม
7. ดาวน์โหลดผลเป็น CSV ได้

## การควบคุม AR

- MediaPipe Hands ตรวจจับมือ
- ปลายนิ้วชี้เป็น Cursor
- จีบนิ้วโป้งกับนิ้วชี้เพื่อหยิบ
- กางนิ้วเพื่อปล่อย
- แสดง Hand Skeleton
- ใช้ Mouse/Touch แทนได้ และไม่ควรนำชนิดการควบคุมมาใช้ตัดสินคะแนนวิชาการ

## การประเมิน

ดูเกณฑ์ฉบับเต็มที่ `ASSESSMENT.md`

หลักฐานหลักประกอบด้วยผลเกม, Pre/Post, AI Station, ESP32 Station, Integration, System Flow Diagram และ Challenge Debugging

## GitHub Pages

ตั้งค่า `Settings → Pages → Deploy from a branch → main → /(root)`

เว็บไซต์:

`https://arty2525.github.io/AI-Hand-Quest/`
