# دليل الإعداد الكامل - Complete Setup Guide

## 📌 الخطوة 1: إنشاء Google Sheet جديد

1. افتحي Google Sheets: [https://sheets.new](https://sheets.new)
2. اسمي الملف: `Executive Meeting Calendar - 2026`
3. احذفي الـ Sheet الافتراضي `Sheet1`

---

## 📌 الخطوة 2: إنشاء الـ Sheets المطلوبة

أنشئي 7 Sheets بالأسماء التالية (بالترتيب):

1. `قاعدة البيانات`
2. `محفظة الإلغاء`
3. `عرض يومي`
4. `عرض أسبوعي`
5. `عرض شهري`
6. `لوحة التحكم`
7. `قالب يونيو 2026`

---

## 📌 الخطوة 3: إعداد قاعدة البيانات الرئيسية

في Sheet `قاعدة البيانات`، ضعي في الصف الأول (Row 1) العناوين التالية:

| العمود | العنوان | الوصف |
|--------|---------|-------|
| A | ID | رقم تسلسلي تلقائي |
| B | التاريخ | Date (YYYY-MM-DD) |
| C | اليوم (ع) | Day name in Arabic |
| D | اليوم (E) | Day name in English |
| E | من الساعة | Start time |
| F | للساعة | End time |
| G | المدة | Duration |
| H | نوع الاجتماع | Meeting Type |
| I | اسم الاجتماع | Meeting Title |
| J | الحضور | Attendees |
| K | الحالة | Status |
| L | ملاحظات | Notes |
| M | تاريخ الإلغاء | Cancellation Date |
| N | سبب الإلغاء | Cancellation Reason |
| O | تم بواسطة | Cancelled By |

---

## 📌 الخطوة 4: إعداد محفظة الإلغاء

في Sheet `محفظة الإلغاء`، ضعي نفس العناوين + عمود إضافي:

| العمود | العنوان |
|--------|---------|
| A-O | نفس قاعدة البيانات |
| P | تاريخ النقل للمحفظة | Archive Date |

---

## 📌 الخطوة 5: إضافة Google Apps Script

1. من القائمة: **Extensions → Apps Script**
2. احذفي الكود الافتراضي
3. انسخي الكود من `src/apps_script_code.gs`
4. احفظي (Ctrl+S) وسمي المشروع: `MeetingCalendarScripts`
5. اضغطي **Run → Review Permissions → Allow**

---

## 📌 الخطوة 6: إضافة الـ Formulas للـ Views

انسخي الـ Formulas من `src/view_formulas.txt` لكل Sheet:

### عرض يومي (Daily View)
- **B1**: ادخلي التاريخ (مثلاً: 01/06/2026)
- **A4**: `=IFERROR(QUERY('قاعدة البيانات'!$A:$O, "SELECT E, H, I, J, K, L WHERE B = date '"&TEXT(B1,"yyyy-MM-dd")&"' ORDER BY E", 0), "لا توجد اجتماعات لهذا اليوم")`

### عرض أسبوعي (Weekly View)
- **B1**: ادخلي تاريخ الأحد
- **A4**: `=IFERROR(QUERY('قاعدة البيانات'!$A:$O, "SELECT C, B, E, H, I, K WHERE B >= date '"&TEXT(B1,"yyyy-MM-dd")&"' AND B <= date '"&TEXT(B1+6,"yyyy-MM-dd")&"' ORDER BY B, E", 0), "لا توجد اجتماعات هذا الأسبوع")`

### عرض شهري (Monthly View)
- **B1**: السنة (مثلاً: 2026)
- **C1**: الشهر رقم (مثلاً: 6)
- **A4**: `=IFERROR(QUERY('قاعدة البيانات'!$A:$O, "SELECT C, B, E, H, I, K, G WHERE B >= date '"&TEXT(DATE(B1,C1,1),"yyyy-MM-dd")&"' AND B <= date '"&TEXT(EOMONTH(DATE(B1,C1,1),0),"yyyy-MM-dd")&"' ORDER BY B, E", 0), "لا توجد اجتماعات هذا الشهر")`

---

## 📌 الخطوة 7: إعداد Data Validation (القوائم المنسدلة)

في Sheet `قاعدة البيانات`:

### العمود H (نوع الاجتماع):
```
Data → Data Validation → List of items:
EHA Pulse, Internal Meeting, External Meeting, One-to-One Meeting,
Project Review, KPI Review, Correspondence, Daily Recap,
Steering Committee, Clinical Meeting, RCM/BCM Meeting,
Supply Chain Review, Digital Transformation, Hospital Meeting,
Operational Meeting, HR Meeting, Maintenance Review,
Patient Satisfaction Review, Mortality Review, Hospitality/HK/Food
```

### العمود K (الحالة):
```
Data → Data Validation → List of items:
Scheduled, Completed, Cancelled, Moved, Postponed
```

---

## 📌 الخطوة 8: إعداد Conditional Formatting (التنسيق الشرطي)

في Sheet `قاعدة البيانات`:

### الحالة (العمود K):
- **Completed** → خلفية `#c8e6c9` (أخضر)
- **Cancelled** → خلفية `#ffcdd2` (أحمر) + خط أحمر
- **Moved** → خلفية `#fff9c4` (أصفر)

### نوع الاجتماع (العمود I):
- **Steering Committee** → خلفية `#e8eaf6` (Indigo)
- **EHA Pulse** → خلفية `#e3f2fd` (أزرق فاتح)

---

## 📌 الخطوة 9: إدخال بيانات يونيو 2026

في Apps Script، شغلي: `importMonthlyTemplate()`

هذا الـ Script هيعبي قاعدة البيانات بـ 102 اجتماع (17 يوم عمل × 6 فترات يومياً)

---

## 📌 الخطوة 10: إنشاء Triggers (التشغيل التلقائي)

في Apps Script:
1. انقري على ساعة ⏰ (Triggers) على اليسار
2. **Add Trigger**
3. Choose function: `onEdit`
4. Choose event source: `From spreadsheet`
5. Choose event type: `On edit`
6. Save

---

## ✅ تم! النظام جاهز للاستخدام

<p align="center">
  <strong>🎉 Congratulations! Your Executive Meeting Calendar is ready!</strong>
</p>
