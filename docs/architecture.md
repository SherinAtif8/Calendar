# توثيق المعمارية - Architecture Documentation

## 🏗️ نظرة عامة على النظام

```
┌─────────────────────────────────────────────────────────────┐
│                    Google Sheets Platform                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐         ┌──────────────┐                │
│  │   Database   │◄───────►│   Archive    │                │
│  │قاعدة البيانات│  Auto   │محفظة الإلغاء │                │
│  └──────┬───────┘  Move   └──────────────┘                │
│         │                                                   │
│    ┌────┴────┬────────┬────────┐                           │
│    ▼         ▼        ▼        ▼                           │
│ ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐                       │
│ │Daily│  │Week │  │Month│  │Dash │                       │
│ │View │  │View │  │View │  │board│                       │
│ └─────┘  └─────┘  └─────┘  └─────┘                       │
│                                                             │
│  ┌─────────────────────────────────────┐                   │
│  │      Google Apps Script Engine      │                   │
│  │  onEdit() | moveToArchive() | etc.  │                   │
│  └─────────────────────────────────────┘                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

```
User Input
    │
    ▼
┌─────────────┐
│  onEdit()   │ ◄─── Triggered on any edit
│   Trigger   │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│  Status =   │ No  │  Other      │
│  Cancelled? ├────►│  Actions    │
└──────┬──────┘     └─────────────┘
       │ Yes
       ▼
┌─────────────┐
│moveToArchive│
│   Function  │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│  Copy Row   │────►│  Append to  │
│  from DB    │     │  Archive    │
└─────────────┘     └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Delete Row │
                    │  from DB    │
                    └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Toast     │
                    │ Notification│
                    └─────────────┘
```

---

## 🗄️ Database Schema

### Table: `قاعدة البيانات` (Database)

| Column | Name | Type | Auto | Description |
|--------|------|------|------|-------------|
| A | ID | Integer | Yes | Auto-generated sequential ID |
| B | التاريخ | Date | No | Meeting date (YYYY-MM-DD) |
| C | اليوم (ع) | String | No | Day name in Arabic |
| D | اليوم (E) | String | No | Day name in English |
| E | من الساعة | Time | No | Start time (HH:MM AM/PM) |
| F | للساعة | Time | No | End time (HH:MM AM/PM) |
| G | المدة | String | No | Duration (e.g., "30 min") |
| H | نوع الاجتماع | Enum | No | Meeting type (20 options) |
| I | اسم الاجتماع | String | No | Meeting title/name |
| J | الحضور | String | No | Attendees list |
| K | الحالة | Enum | No | Status (5 options) |
| L | ملاحظات | String | No | Additional notes |
| M | تاريخ الإلغاء | Date | No | Cancellation date |
| N | سبب الإلغاء | String | No | Cancellation reason |
| O | تم بواسطة | String | No | Cancelled by (person) |

### Table: `محفظة الإلغاء` (Archive)

Same schema as Database + Column P:

| Column | Name | Type | Description |
|--------|------|------|-------------|
| P | تاريخ النقل للمحفظة | Date | Timestamp when moved to archive |

---

## 🔧 Google Apps Script Functions

### Core Functions

| Function | Trigger | Description |
|----------|---------|-------------|
| `onEdit()` | Event (On edit) | Main trigger - detects status changes |
| `moveToArchive()` | Called by onEdit | Moves cancelled meetings to archive |
| `autoGenerateID()` | Called by onEdit | Generates sequential IDs for new rows |
| `importMonthlyTemplate()` | Manual | Imports June 2026 template data |
| `applyConditionalFormatting()` | Manual | Applies color coding rules |
| `updateDashboard()` | Manual | Updates dashboard statistics |
| `createNewMonthTemplate()` | Manual | Creates template for new month |
| `testOnEdit()` | Manual | Tests the onEdit functionality |

### Function Details

#### `onEdit(e)`
```javascript
// Triggered automatically when any cell is edited
// Checks if Status column (K) was changed to "Cancelled"
// If yes, calls moveToArchive()
```

#### `moveToArchive(sheet, row)`
```javascript
// 1. Gets data from source row (columns A-O)
// 2. Adds timestamp to column P
// 3. Appends to Archive sheet
// 4. Applies red formatting to new row
// 5. Deletes row from Database
// 6. Shows toast notification
```

#### `autoGenerateID(sheet, row)`
```javascript
// 1. Checks if ID cell is empty
// 2. Finds maximum existing ID
// 3. Sets new ID = max + 1
```

---

## 📐 View Architecture

### Daily View (`عرض يومي`)

```sql
QUERY(
  'قاعدة البيانات'!$A:$O,
  "SELECT E, H, I, J, K, L 
   WHERE B = date 'YYYY-MM-DD' 
   ORDER BY E",
  0
)
```

**Parameters:**
- Input: Cell B1 (date)
- Output: Time, Type, Title, Attendees, Status, Notes
- Sort: By time ascending

### Weekly View (`عرض أسبوعي`)

```sql
QUERY(
  'قاعدة البيانات'!$A:$O,
  "SELECT C, B, E, H, I, K 
   WHERE B >= date 'YYYY-MM-DD' 
     AND B <= date 'YYYY-MM-DD' 
   ORDER BY B, E",
  0
)
```

**Parameters:**
- Input: Cell B1 (Sunday date)
- Range: B1 to B1+6 days
- Output: Day, Date, Time, Type, Title, Status
- Sort: By date, then time

### Monthly View (`عرض شهري`)

```sql
QUERY(
  'قاعدة البيانات'!$A:$O,
  "SELECT C, B, E, H, I, K, G 
   WHERE B >= date 'YYYY-MM-01' 
     AND B <= date 'YYYY-MM-31' 
   ORDER BY B, E",
  0
)
```

**Parameters:**
- Input: Cell B1 (year), C1 (month number)
- Range: First day to last day of month
- Output: Day, Date, Time, Type, Title, Status, Duration

---

## 🎨 Conditional Formatting Rules

### Status-Based (Column K)

| Status | Background | Text | Font |
|--------|------------|------|------|
| Completed | #c8e6c9 | #1b5e20 | Normal |
| Cancelled | #ffcdd2 | #b71c1c | Bold |
| Moved | #fff9c4 | #f57f17 | Normal |

### Type-Based (Column I)

| Meeting Type | Background | Text |
|-------------|------------|------|
| Steering Committee | #e8eaf6 | #283593 |
| EHA Pulse | #e3f2fd | #1565c0 |

---

## 🔒 Data Validation Rules

### Column H (Meeting Type)

```
List of 20 items:
- EHA Pulse
- Internal Meeting
- External Meeting
- One-to-One Meeting
- Project Review
- KPI Review
- Correspondence
- Daily Recap
- Steering Committee
- Clinical Meeting
- RCM/BCM Meeting
- Supply Chain Review
- Digital Transformation
- Hospital Meeting
- Operational Meeting
- HR Meeting
- Maintenance Review
- Patient Satisfaction Review
- Mortality Review
- Hospitality/HK/Food
```

### Column K (Status)

```
List of 5 items:
- Scheduled
- Completed
- Cancelled
- Moved
- Postponed
```

---

## 📈 Dashboard Metrics

### Primary Metrics

| Metric | Formula | Description |
|--------|---------|-------------|
| Total Meetings | `COUNTA(DB) + COUNTA(Archive)` | All meetings ever created |
| Scheduled | `COUNTIF(K:K, "Scheduled")` | Pending meetings |
| Completed | `COUNTIF(K:K, "Completed")` | Done meetings |
| Cancelled | `COUNTA(Archive)` | Archived meetings |
| Moved | `COUNTIF(K:K, "Moved")` | Rescheduled meetings |

### Time-Based Metrics

| Metric | Formula | Description |
|--------|---------|-------------|
| Today's Meetings | `COUNTIF(B:B, TODAY())` | Count for current date |
| This Week | `COUNTIFS(B:B, ">="&start, B:B, "<="&end)` | Current week count |

### Type Distribution

| Type | Formula |
|------|---------|
| EHA Pulse | `COUNTIF(H:H, "EHA Pulse")` |
| Internal | `COUNTIF(H:H, "Internal Meeting")` |
| External | `COUNTIF(H:H, "External Meeting")` |
| One-to-One | `COUNTIF(H:H, "One-to-One Meeting")` |

---

## 🔄 Workflow States

```
                    ┌─────────────┐
                    │   START     │
                    │  (Add Row)  │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  SCHEDULED  │ ◄── Default state
                    │  (مجدولة)   │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
        ┌─────────┐  ┌─────────┐  ┌─────────┐
        │COMPLETED│  │ CANCELLED│  │  MOVED  │
        │(مكتملة) │  │ (ملغاة)  │  │(مؤجلة)  │
        └─────────┘  └────┬────┘  └─────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │   ARCHIVE   │
                   │  (محفظة)    │
                   └─────────────┘
```

---

## 🛡️ Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| "Archive sheet not found" | Sheet name mismatch | Check sheet name is exactly `محفظة الإلغاء` |
| "ID not generating" | Column A not empty | Clear cell A before entering date |
| "Trigger not working" | Permissions not granted | Re-run and authorize permissions |
| "Query returns empty" | Date format mismatch | Use YYYY-MM-DD format |

---

## 📞 Support & Maintenance

For technical issues or feature requests:
- Open an issue in the GitHub repository
- Contact: System Administrator

---

<p align="center">
  <strong>System Version 1.0 | June 2026</strong>
</p>
