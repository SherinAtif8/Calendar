# 📅 Executive Meeting Calendar System

**نظام كاليندر الاجتماعات التنفيذية**

A comprehensive Google Sheets-based meeting calendar system designed for executive-level scheduling, featuring automated cancellation archiving, multiple views (daily/weekly/monthly), and a real-time dashboard.

---

## 🌟 Features

| Feature | Description |
|---------|-------------|
| **Monthly Template** | Recurring daily structure: EHA Pulse → Internal → External → One-to-One → Correspondence → Daily Recap |
| **Meeting Management** | Add meetings with title, type, attendees, and status |
| **Auto-Archive** | Cancelled meetings automatically move to Cancellation Archive |
| **Multiple Views** | Daily, Weekly, and Monthly views using QUERY formulas |
| **Dashboard** | Real-time statistics: total, scheduled, completed, cancelled, moved |
| **Conditional Formatting** | Color-coded by status (Green=Completed, Red=Cancelled, Yellow=Moved) |
| **Auto-ID Generation** | Automatic ID generation for new meetings |
| **Multi-Month Support** | Create templates for any month using Google Apps Script |

---

## 📁 Repository Structure

```
executive-meeting-calendar/
├── README.md                          # This file
├── LICENSE                            # MIT License
├── src/
│   ├── apps_script_code.gs            # Google Apps Script automation code
│   ├── view_formulas.txt              # QUERY formulas for all views
│   └── data_validation_setup.txt      # Data validation & conditional formatting guide
├── docs/
│   ├── setup_guide.md                 # Complete setup guide (10 steps)
│   ├── user_manual.md                 # Daily usage manual
│   └── architecture.md                # System architecture documentation
└── assets/
    ├── system_architecture.png        # System architecture diagram
    └── screenshots/                   # UI screenshots (to be added)
```

---

## 🚀 Quick Start

### Step 1: Create Google Sheet
- Go to [sheets.new](https://sheets.new)
- Name it: `Executive Meeting Calendar - 2026`

### Step 2: Create 7 Sheets
1. `قاعدة البيانات` (Database)
2. `محفظة الإلغاء` (Cancellation Archive)
3. `عرض يومي` (Daily View)
4. `عرض أسبوعي` (Weekly View)
5. `عرض شهري` (Monthly View)
6. `لوحة التحكم` (Dashboard)
7. `قالب يونيو 2026` (June Template)

### Step 3: Setup Database Headers
In `قاعدة البيانات` sheet, row 1:

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ID | التاريخ | اليوم (ع) | اليوم (E) | من الساعة | للساعة | المدة | نوع الاجتماع | اسم الاجتماع | الحضور | الحالة | ملاحظات | تاريخ الإلغاء | سبب الإلغاء | تم بواسطة |

### Step 4: Install Google Apps Script
1. Open **Extensions → Apps Script**
2. Delete default code
3. Copy content from `src/apps_script_code.gs`
4. Save and name project: `MeetingCalendarScripts`
5. Click **Run → Review Permissions → Allow**

### Step 5: Add Trigger
1. In Apps Script, click **⏰ Triggers**
2. **Add Trigger**
3. Choose function: `onEdit`
4. Choose event source: `From spreadsheet`
5. Choose event type: `On edit`

### Step 6: Import June 2026 Template
In Apps Script, run: `importMonthlyTemplate()`

### Step 7: Setup Views
Copy formulas from `src/view_formulas.txt` into respective sheets.

### Step 8: Setup Data Validation
- Column H (Meeting Type): List of 20 meeting types
- Column K (Status): Scheduled, Completed, Cancelled, Moved, Postponed

### Step 9: Setup Conditional Formatting
- Status = "Completed" → Green (#c8e6c9)
- Status = "Cancelled" → Red (#ffcdd2)
- Status = "Moved" → Yellow (#fff9c4)
- Meeting = "Steering Committee" → Indigo (#e8eaf6)
- Meeting = "EHA Pulse" → Light Blue (#e3f2fd)

### Step 10: Start Using!

---

## 📊 Meeting Types

| Type | Description |
|------|-------------|
| EHA Pulse | Daily morning pulse check |
| Internal Meeting | Internal team meetings |
| External Meeting | External stakeholder meetings |
| One-to-One Meeting | Individual meetings |
| Steering Committee | Strategic steering committee |
| Clinical Meeting | Clinical operations review |
| RCM/BCM Meeting | Revenue/ Business Continuity |
| Supply Chain Review | Supply chain operations |
| Digital Transformation | Digital initiatives |
| Hospital Meeting | Hospital operations |
| Operational Meeting | General operations |
| HR Meeting | Human resources |
| Maintenance Review | Facility maintenance |
| Patient Satisfaction | Patient feedback review |
| Mortality Review | Clinical mortality review |
| Hospitality/HK/Food | Housekeeping & Food services |
| Project Review | Project status review |
| KPI Review | Key performance indicators |
| Correspondence | Email & communication time |
| Daily Recap | End-of-day summary |

---

## 🔄 Daily Workflow

```
1. ADD MEETING → Add new row in Database
2. SET DETAILS → Date, Time, Type, Title, Attendees
3. STATUS → Default: Scheduled or Completed
4. CANCEL → Change to Cancelled → Auto-moves to Archive
```

---

## 🎨 Color Coding

| Status | Color | Hex |
|--------|-------|-----|
| Scheduled | Default | None |
| Completed | Green | #c8e6c9 |
| Cancelled | Red | #ffcdd2 |
| Moved | Yellow | #fff9c4 |

| Meeting Type | Color | Hex |
|-------------|-------|-----|
| Steering Committee | Indigo | #e8eaf6 |
| EHA Pulse | Light Blue | #e3f2fd |

---

## 📖 Documentation

- [Setup Guide](docs/setup_guide.md) - Complete 10-step setup
- [User Manual](docs/user_manual.md) - Daily usage instructions
- [Architecture](docs/architecture.md) - System design & flow

---

## 🤝 Contributing

This system is designed for **HIO (Health Insurance Organization)** executive scheduling.

For modifications or new features:
1. Fork this repository
2. Create a feature branch
3. Submit a pull request

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file

---

## 👥 Credits

- **System Design**: Executive Assistant Team
- **Technical Implementation**: Google Sheets + Apps Script
- **Organization**: HIO - الهيئة العامة للرعاية الصحية

---

## 📞 Support

For issues or questions:
- Open an issue in this repository
- Contact the system administrator

---

<p align="center">
  <strong>Made with ❤️ for HIO Executive Team</strong>
</p>
