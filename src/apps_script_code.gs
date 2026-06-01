
/**
 * ═══════════════════════════════════════════════════════════════
 * 📅 نظام كاليندر الاجتماعات التنفيذية
 * Executive Meeting Calendar System
 * Google Apps Script
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * ─────────────────────────────────────────────────────────────
 * 🔄 onEdit - التشغيل التلقائي عند أي تعديل
 * ─────────────────────────────────────────────────────────────
 */
function onEdit(e) {
  if (!e) {
    // For manual testing
    Logger.log("This function runs automatically on edit. For testing, use testOnEdit()");
    return;
  }

  var sheet = e.source.getActiveSheet();
  var sheetName = sheet.getName();
  var range = e.range;
  var row = range.getRow();
  var col = range.getColumn();

  // Only process "قاعدة البيانات" sheet
  if (sheetName !== "قاعدة البيانات") return;

  // Check if Status column (K) was changed
  if (col === 11) { // Column K
    var status = e.value;
    var oldStatus = e.oldValue;

    if (status === "Cancelled" && oldStatus !== "Cancelled") {
      moveToArchive(sheet, row);
    }
  }

  // Auto-generate ID for new rows
  if (col === 2 && row > 1) { // Column B (Date) edited
    autoGenerateID(sheet, row);
  }
}

/**
 * ─────────────────────────────────────────────────────────────
 * 📤 moveToArchive - نقل الاجتماع الملغى إلى المحفظة
 * ─────────────────────────────────────────────────────────────
 */
function moveToArchive(sourceSheet, row) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var archiveSheet = ss.getSheetByName("محفظة الإلغاء");

  if (!archiveSheet) {
    Logger.log("Archive sheet not found!");
    return;
  }

  // Get the data from source row (columns A-O = 15 columns)
  var sourceRange = sourceSheet.getRange(row, 1, 1, 15);
  var data = sourceRange.getValues()[0];

  // Add timestamp for when it was moved to archive
  var timestamp = new Date();
  data.push(timestamp); // Column P

  // Append to archive sheet
  archiveSheet.appendRow(data);

  // Add formatting to the new row in archive
  var lastRow = archiveSheet.getLastRow();
  archiveSheet.getRange(lastRow, 1, 1, 16).setBackground("#fce4ec"); // Light pink
  archiveSheet.getRange(lastRow, 11).setFontColor("#c62828"); // Red text for status

  // Delete from source sheet
  sourceSheet.deleteRow(row);

  // Show notification
  SpreadsheetApp.getActive().toast(
    "✅ تم نقل الاجتماع إلى محفظة الإلغاء",
    "إلغاء الاجتماع",
    5
  );
}

/**
 * ─────────────────────────────────────────────────────────────
 * 🔢 autoGenerateID - توليد ID تلقائي
 * ─────────────────────────────────────────────────────────────
 */
function autoGenerateID(sheet, row) {
  var idCell = sheet.getRange(row, 1); // Column A

  if (!idCell.getValue()) {
    var lastID = 0;
    var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();

    for (var i = 0; i < data.length; i++) {
      if (data[i][0] && !isNaN(data[i][0])) {
        lastID = Math.max(lastID, parseInt(data[i][0]));
      }
    }

    idCell.setValue(lastID + 1);
  }
}

/**
 * ─────────────────────────────────────────────────────────────
 * 📥 importMonthlyTemplate - استيراد قالب شهر
 * ─────────────────────────────────────────────────────────────
 */
function importMonthlyTemplate() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dbSheet = ss.getSheetByName("قاعدة البيانات");

  if (!dbSheet) {
    Logger.log("Database sheet not found!");
    return;
  }

  // Template data for June 2026
  var templateData = [
    // Week 1
    ["", "2026-06-01", "الأثنين", "Monday", "09:30 AM", "10:00 AM", "30 min", "EHA Pulse", "EHA Pulse", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-01", "الأثنين", "Monday", "10:00 AM", "12:00 PM", "120 min", "Internal Meeting", "PHCS Meeting", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-01", "الأثنين", "Monday", "12:00 PM", "03:00 PM", "180 min", "External Meeting", "External Meetings / Free Slot", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-01", "الأثنين", "Monday", "03:00 PM", "04:30 PM", "90 min", "One-to-One Meeting", "One-to-One Meetings", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-01", "الأثنين", "Monday", "04:30 PM", "05:30 PM", "60 min", "Correspondence", "Correspondence", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-01", "الأثنين", "Monday", "05:30 PM", "06:00 PM", "30 min", "Daily Recap", "Daily Recap & Follow-up", "", "Scheduled", "", "", "", ""],

    ["", "2026-06-02", "الثلاثاء", "Tuesday", "09:30 AM", "10:00 AM", "30 min", "EHA Pulse", "EHA Pulse", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-02", "الثلاثاء", "Tuesday", "10:00 AM", "12:00 PM", "120 min", "Internal Meeting", "Steering Committee", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-02", "الثلاثاء", "Tuesday", "12:00 PM", "03:00 PM", "180 min", "External Meeting", "External Meetings / Free Slot", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-02", "الثلاثاء", "Tuesday", "03:00 PM", "04:30 PM", "90 min", "One-to-One Meeting", "One-to-One Meetings", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-02", "الثلاثاء", "Tuesday", "04:30 PM", "05:30 PM", "60 min", "Correspondence", "Correspondence", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-02", "الثلاثاء", "Tuesday", "05:30 PM", "06:00 PM", "30 min", "Daily Recap", "Daily Recap & Follow-up", "", "Scheduled", "", "", "", ""],

    ["", "2026-06-03", "الأربعاء", "Wednesday", "09:30 AM", "10:00 AM", "30 min", "EHA Pulse", "EHA Pulse", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-03", "الأربعاء", "Wednesday", "10:00 AM", "12:00 PM", "120 min", "Internal Meeting", "Clinical Meeting", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-03", "الأربعاء", "Wednesday", "12:00 PM", "03:00 PM", "180 min", "External Meeting", "External Meetings / Free Slot", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-03", "الأربعاء", "Wednesday", "01:00 PM", "03:00 PM", "120 min", "Project Review", "Projects Review", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-03", "الأربعاء", "Wednesday", "03:00 PM", "04:30 PM", "90 min", "One-to-One Meeting", "One-to-One Meetings", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-03", "الأربعاء", "Wednesday", "04:30 PM", "05:30 PM", "60 min", "Correspondence", "Correspondence", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-03", "الأربعاء", "Wednesday", "05:30 PM", "06:00 PM", "30 min", "Daily Recap", "Daily Recap & Follow-up", "", "Scheduled", "", "", "", ""],

    ["", "2026-06-04", "الخميس", "Thursday", "09:30 AM", "10:00 AM", "30 min", "EHA Pulse", "EHA Pulse", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-04", "الخميس", "Thursday", "10:00 AM", "12:00 PM", "120 min", "Internal Meeting", "RCM / BCM Meeting", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-04", "الخميس", "Thursday", "12:00 PM", "03:00 PM", "180 min", "External Meeting", "External Meetings / Free Slot", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-04", "الخميس", "Thursday", "03:00 PM", "04:30 PM", "90 min", "One-to-One Meeting", "One-to-One Meetings", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-04", "الخميس", "Thursday", "04:30 PM", "05:30 PM", "60 min", "Correspondence", "Correspondence", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-04", "الخميس", "Thursday", "05:30 PM", "06:00 PM", "30 min", "Daily Recap", "Daily Recap & Follow-up", "", "Scheduled", "", "", "", ""],

    // Week 2
    ["", "2026-06-07", "الأحد", "Sunday", "09:30 AM", "10:00 AM", "30 min", "EHA Pulse", "EHA Pulse", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-07", "الأحد", "Sunday", "10:00 AM", "12:00 PM", "120 min", "Internal Meeting", "Supply Chain Review", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-07", "الأحد", "Sunday", "12:00 PM", "03:00 PM", "180 min", "External Meeting", "External Meetings / Free Slot", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-07", "الأحد", "Sunday", "03:00 PM", "04:30 PM", "90 min", "One-to-One Meeting", "One-to-One Meetings", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-07", "الأحد", "Sunday", "04:30 PM", "05:30 PM", "60 min", "Correspondence", "Correspondence", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-07", "الأحد", "Sunday", "05:30 PM", "06:00 PM", "30 min", "Daily Recap", "Daily Recap & Follow-up", "", "Scheduled", "", "", "", ""],

    ["", "2026-06-08", "الأثنين", "Monday", "09:30 AM", "10:00 AM", "30 min", "EHA Pulse", "EHA Pulse", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-08", "الأثنين", "Monday", "10:00 AM", "12:00 PM", "120 min", "Internal Meeting", "Internal Meetings", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-08", "الأثنين", "Monday", "12:00 PM", "03:00 PM", "180 min", "External Meeting", "External Meetings / Free Slot", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-08", "الأثنين", "Monday", "03:00 PM", "04:30 PM", "90 min", "One-to-One Meeting", "One-to-One Meetings", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-08", "الأثنين", "Monday", "04:30 PM", "05:30 PM", "60 min", "Correspondence", "Correspondence", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-08", "الأثنين", "Monday", "05:30 PM", "06:00 PM", "30 min", "Daily Recap", "Daily Recap & Follow-up", "", "Scheduled", "", "", "", ""],

    ["", "2026-06-09", "الثلاثاء", "Tuesday", "09:30 AM", "10:00 AM", "30 min", "EHA Pulse", "EHA Pulse", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-09", "الثلاثاء", "Tuesday", "10:00 AM", "12:00 PM", "120 min", "Internal Meeting", "Steering Committee", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-09", "الثلاثاء", "Tuesday", "12:00 PM", "03:00 PM", "180 min", "External Meeting", "External Meetings / Free Slot", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-09", "الثلاثاء", "Tuesday", "03:00 PM", "04:30 PM", "90 min", "One-to-One Meeting", "One-to-One Meetings", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-09", "الثلاثاء", "Tuesday", "04:30 PM", "05:30 PM", "60 min", "Correspondence", "Correspondence", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-09", "الثلاثاء", "Tuesday", "05:30 PM", "06:00 PM", "30 min", "Daily Recap", "Daily Recap & Follow-up", "", "Scheduled", "", "", "", ""],

    ["", "2026-06-10", "الأربعاء", "Wednesday", "09:30 AM", "10:00 AM", "30 min", "EHA Pulse", "EHA Pulse", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-10", "الأربعاء", "Wednesday", "10:00 AM", "12:00 PM", "120 min", "Internal Meeting", "Internal Meetings", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-10", "الأربعاء", "Wednesday", "12:00 PM", "03:00 PM", "180 min", "External Meeting", "External Meetings / Free Slot", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-10", "الأربعاء", "Wednesday", "01:00 PM", "03:00 PM", "120 min", "KPI Review", "KPI Review", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-10", "الأربعاء", "Wednesday", "03:00 PM", "04:30 PM", "90 min", "One-to-One Meeting", "One-to-One Meetings", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-10", "الأربعاء", "Wednesday", "04:30 PM", "05:30 PM", "60 min", "Correspondence", "Correspondence", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-10", "الأربعاء", "Wednesday", "05:30 PM", "06:00 PM", "30 min", "Daily Recap", "Daily Recap & Follow-up", "", "Scheduled", "", "", "", ""],

    ["", "2026-06-11", "الخميس", "Thursday", "09:30 AM", "10:00 AM", "30 min", "EHA Pulse", "EHA Pulse", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-11", "الخميس", "Thursday", "10:00 AM", "12:00 PM", "120 min", "Internal Meeting", "Internal Meetings", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-11", "الخميس", "Thursday", "12:00 PM", "03:00 PM", "180 min", "External Meeting", "External Meetings / Free Slot", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-11", "الخميس", "Thursday", "03:00 PM", "04:30 PM", "90 min", "One-to-One Meeting", "One-to-One Meetings", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-11", "الخميس", "Thursday", "04:30 PM", "05:30 PM", "60 min", "Correspondence", "Correspondence", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-11", "الخميس", "Thursday", "05:30 PM", "06:00 PM", "30 min", "Daily Recap", "Daily Recap & Follow-up", "", "Scheduled", "", "", "", ""],

    // Week 3
    ["", "2026-06-14", "الأحد", "Sunday", "09:30 AM", "10:00 AM", "30 min", "EHA Pulse", "EHA Pulse", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-14", "الأحد", "Sunday", "10:00 AM", "12:00 PM", "120 min", "Internal Meeting", "Digital Transformation", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-14", "الأحد", "Sunday", "12:00 PM", "03:00 PM", "180 min", "External Meeting", "External Meetings / Free Slot", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-14", "الأحد", "Sunday", "03:00 PM", "04:30 PM", "90 min", "One-to-One Meeting", "One-to-One Meetings", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-14", "الأحد", "Sunday", "04:30 PM", "05:30 PM", "60 min", "Correspondence", "Correspondence", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-14", "الأحد", "Sunday", "05:30 PM", "06:00 PM", "30 min", "Daily Recap", "Daily Recap & Follow-up", "", "Scheduled", "", "", "", ""],

    ["", "2026-06-15", "الأثنين", "Monday", "09:30 AM", "10:00 AM", "30 min", "EHA Pulse", "EHA Pulse", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-15", "الأثنين", "Monday", "10:00 AM", "12:00 PM", "120 min", "Internal Meeting", "Hospital Meeting", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-15", "الأثنين", "Monday", "12:00 PM", "03:00 PM", "180 min", "External Meeting", "External Meetings / Free Slot", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-15", "الأثنين", "Monday", "03:00 PM", "04:30 PM", "90 min", "One-to-One Meeting", "One-to-One Meetings", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-15", "الأثنين", "Monday", "04:30 PM", "05:30 PM", "60 min", "Correspondence", "Correspondence", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-15", "الأثنين", "Monday", "05:30 PM", "06:00 PM", "30 min", "Daily Recap", "Daily Recap & Follow-up", "", "Scheduled", "", "", "", ""],

    ["", "2026-06-16", "الثلاثاء", "Tuesday", "09:30 AM", "10:00 AM", "30 min", "EHA Pulse", "EHA Pulse", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-16", "الثلاثاء", "Tuesday", "10:00 AM", "12:00 PM", "120 min", "Internal Meeting", "Steering Committee", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-16", "الثلاثاء", "Tuesday", "12:00 PM", "03:00 PM", "180 min", "External Meeting", "External Meetings / Free Slot", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-16", "الثلاثاء", "Tuesday", "03:00 PM", "04:30 PM", "90 min", "One-to-One Meeting", "One-to-One Meetings", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-16", "الثلاثاء", "Tuesday", "04:30 PM", "05:30 PM", "60 min", "Correspondence", "Correspondence", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-16", "الثلاثاء", "Tuesday", "05:30 PM", "06:00 PM", "30 min", "Daily Recap", "Daily Recap & Follow-up", "", "Scheduled", "", "", "", ""],

    ["", "2026-06-17", "الأربعاء", "Wednesday", "09:30 AM", "10:00 AM", "30 min", "EHA Pulse", "EHA Pulse", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-17", "الأربعاء", "Wednesday", "10:00 AM", "12:00 PM", "120 min", "Internal Meeting", "Operational Meeting", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-17", "الأربعاء", "Wednesday", "01:00 PM", "03:00 PM", "120 min", "External Meeting", "Hospitality / HK / Food", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-17", "الأربعاء", "Wednesday", "03:00 PM", "04:30 PM", "90 min", "One-to-One Meeting", "One-to-One Meetings", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-17", "الأربعاء", "Wednesday", "04:30 PM", "05:30 PM", "60 min", "Correspondence", "Correspondence", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-17", "الأربعاء", "Wednesday", "05:30 PM", "06:00 PM", "30 min", "Daily Recap", "Daily Recap & Follow-up", "", "Scheduled", "", "", "", ""],

    ["", "2026-06-18", "الخميس", "Thursday", "09:30 AM", "10:00 AM", "30 min", "EHA Pulse", "EHA Pulse", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-18", "الخميس", "Thursday", "10:00 AM", "12:00 PM", "120 min", "Internal Meeting", "HR Meeting", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-18", "الخميس", "Thursday", "12:00 PM", "03:00 PM", "180 min", "External Meeting", "External Meetings / Free Slot", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-18", "الخميس", "Thursday", "03:00 PM", "04:30 PM", "90 min", "One-to-One Meeting", "One-to-One Meetings", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-18", "الخميس", "Thursday", "04:30 PM", "05:30 PM", "60 min", "Correspondence", "Correspondence", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-18", "الخميس", "Thursday", "05:30 PM", "06:00 PM", "30 min", "Daily Recap", "Daily Recap & Follow-up", "", "Scheduled", "", "", "", ""],

    // Week 4
    ["", "2026-06-21", "الأحد", "Sunday", "09:30 AM", "10:00 AM", "30 min", "EHA Pulse", "EHA Pulse", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-21", "الأحد", "Sunday", "10:00 AM", "12:00 PM", "120 min", "Internal Meeting", "Maintenance Review", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-21", "الأحد", "Sunday", "12:00 PM", "03:00 PM", "180 min", "External Meeting", "External Meetings / Free Slot", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-21", "الأحد", "Sunday", "03:00 PM", "04:30 PM", "90 min", "One-to-One Meeting", "One-to-One Meetings", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-21", "الأحد", "Sunday", "04:30 PM", "05:30 PM", "60 min", "Correspondence", "Correspondence", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-21", "الأحد", "Sunday", "05:30 PM", "06:00 PM", "30 min", "Daily Recap", "Daily Recap & Follow-up", "", "Scheduled", "", "", "", ""],

    ["", "2026-06-22", "الأثنين", "Monday", "09:30 AM", "10:00 AM", "30 min", "EHA Pulse", "EHA Pulse", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-22", "الأثنين", "Monday", "10:00 AM", "12:00 PM", "120 min", "Internal Meeting", "Internal Meetings", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-22", "الأثنين", "Monday", "12:00 PM", "03:00 PM", "180 min", "External Meeting", "External Meetings / Free Slot", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-22", "الأثنين", "Monday", "03:00 PM", "04:30 PM", "90 min", "One-to-One Meeting", "One-to-One Meetings", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-22", "الأثنين", "Monday", "04:30 PM", "05:30 PM", "60 min", "Correspondence", "Correspondence", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-22", "الأثنين", "Monday", "05:30 PM", "06:00 PM", "30 min", "Daily Recap", "Daily Recap & Follow-up", "", "Scheduled", "", "", "", ""],

    ["", "2026-06-23", "الثلاثاء", "Tuesday", "09:30 AM", "10:00 AM", "30 min", "EHA Pulse", "EHA Pulse", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-23", "الثلاثاء", "Tuesday", "10:00 AM", "12:00 PM", "120 min", "Internal Meeting", "Steering Committee", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-23", "الثلاثاء", "Tuesday", "12:00 PM", "03:00 PM", "180 min", "External Meeting", "External Meetings / Free Slot", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-23", "الثلاثاء", "Tuesday", "03:00 PM", "04:30 PM", "90 min", "One-to-One Meeting", "One-to-One Meetings", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-23", "الثلاثاء", "Tuesday", "04:30 PM", "05:30 PM", "60 min", "Correspondence", "Correspondence", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-23", "الثلاثاء", "Tuesday", "05:30 PM", "06:00 PM", "30 min", "Daily Recap", "Daily Recap & Follow-up", "", "Scheduled", "", "", "", ""],

    ["", "2026-06-24", "الأربعاء", "Wednesday", "09:30 AM", "10:00 AM", "30 min", "EHA Pulse", "EHA Pulse", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-24", "الأربعاء", "Wednesday", "10:00 AM", "12:00 PM", "120 min", "Internal Meeting", "Internal Meetings", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-24", "الأربعاء", "Wednesday", "12:00 PM", "03:00 PM", "180 min", "External Meeting", "External Meetings / Free Slot", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-24", "الأربعاء", "Wednesday", "01:00 PM", "03:00 PM", "120 min", "Patient Satisfaction Review", "Patient Satisfaction Review", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-24", "الأربعاء", "Wednesday", "03:00 PM", "04:30 PM", "90 min", "One-to-One Meeting", "One-to-One Meetings", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-24", "الأربعاء", "Wednesday", "04:30 PM", "05:30 PM", "60 min", "Correspondence", "Correspondence", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-24", "الأربعاء", "Wednesday", "05:30 PM", "06:00 PM", "30 min", "Daily Recap", "Daily Recap & Follow-up", "", "Scheduled", "", "", "", ""],

    ["", "2026-06-25", "الخميس", "Thursday", "09:30 AM", "10:00 AM", "30 min", "EHA Pulse", "EHA Pulse", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-25", "الخميس", "Thursday", "10:00 AM", "12:00 PM", "120 min", "Internal Meeting", "Internal Meetings", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-25", "الخميس", "Thursday", "12:00 PM", "03:00 PM", "180 min", "External Meeting", "External Meetings / Free Slot", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-25", "الخميس", "Thursday", "03:00 PM", "04:30 PM", "90 min", "One-to-One Meeting", "One-to-One Meetings", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-25", "الخميس", "Thursday", "04:30 PM", "05:30 PM", "60 min", "Correspondence", "Correspondence", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-25", "الخميس", "Thursday", "05:30 PM", "06:00 PM", "30 min", "Daily Recap", "Daily Recap & Follow-up", "", "Scheduled", "", "", "", ""],

    // Week 5
    ["", "2026-06-28", "الأحد", "Sunday", "09:30 AM", "10:00 AM", "30 min", "EHA Pulse", "EHA Pulse", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-28", "الأحد", "Sunday", "10:00 AM", "12:00 PM", "120 min", "Internal Meeting", "Mortality Review", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-28", "الأحد", "Sunday", "12:00 PM", "03:00 PM", "180 min", "External Meeting", "External Meetings / Free Slot", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-28", "الأحد", "Sunday", "03:00 PM", "04:30 PM", "90 min", "One-to-One Meeting", "One-to-One Meetings", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-28", "الأحد", "Sunday", "04:30 PM", "05:30 PM", "60 min", "Correspondence", "Correspondence", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-28", "الأحد", "Sunday", "05:30 PM", "06:00 PM", "30 min", "Daily Recap", "Daily Recap & Follow-up", "", "Scheduled", "", "", "", ""],

    ["", "2026-06-29", "الأثنين", "Monday", "09:30 AM", "10:00 AM", "30 min", "EHA Pulse", "EHA Pulse", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-29", "الأثنين", "Monday", "10:00 AM", "12:00 PM", "120 min", "Internal Meeting", "Internal Meetings", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-29", "الأثنين", "Monday", "12:00 PM", "03:00 PM", "180 min", "External Meeting", "External Meetings / Free Slot", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-29", "الأثنين", "Monday", "03:00 PM", "04:30 PM", "90 min", "One-to-One Meeting", "One-to-One Meetings", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-29", "الأثنين", "Monday", "04:30 PM", "05:30 PM", "60 min", "Correspondence", "Correspondence", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-29", "الأثنين", "Monday", "05:30 PM", "06:00 PM", "30 min", "Daily Recap", "Daily Recap & Follow-up", "", "Scheduled", "", "", "", ""],

    ["", "2026-06-30", "الثلاثاء", "Tuesday", "09:30 AM", "10:00 AM", "30 min", "EHA Pulse", "EHA Pulse", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-30", "الثلاثاء", "Tuesday", "10:00 AM", "12:00 PM", "120 min", "Internal Meeting", "Steering Committee", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-30", "الثلاثاء", "Tuesday", "12:00 PM", "03:00 PM", "180 min", "External Meeting", "External Meetings / Free Slot", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-30", "الثلاثاء", "Tuesday", "03:00 PM", "04:30 PM", "90 min", "One-to-One Meeting", "One-to-One Meetings", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-30", "الثلاثاء", "Tuesday", "04:30 PM", "05:30 PM", "60 min", "Correspondence", "Correspondence", "", "Scheduled", "", "", "", ""],
    ["", "2026-06-30", "الثلاثاء", "Tuesday", "05:30 PM", "06:00 PM", "30 min", "Daily Recap", "Daily Recap & Follow-up", "", "Scheduled", "", "", "", ""]
  ];

  // Generate IDs
  var startID = 1;
  var dataRange = dbSheet.getRange(2, 1, dbSheet.getLastRow() - 1, 1).getValues();
  for (var i = 0; i < dataRange.length; i++) {
    if (dataRange[i][0] && !isNaN(dataRange[i][0])) {
      startID = Math.max(startID, parseInt(dataRange[i][0]) + 1);
    }
  }

  for (var i = 0; i < templateData.length; i++) {
    templateData[i][0] = startID + i;
  }

  // Append all data
  var startRow = dbSheet.getLastRow() + 1;
  dbSheet.getRange(startRow, 1, templateData.length, 15).setValues(templateData);

  // Apply conditional formatting
  applyConditionalFormatting(dbSheet);

  SpreadsheetApp.getActive().toast(
    "✅ تم استيراد " + templateData.length + " اجتماع لشهر يونيو 2026",
    "استيراد القالب",
    5
  );
}

/**
 * ─────────────────────────────────────────────────────────────
 * 🎨 applyConditionalFormatting - تطبيق التنسيق الشرطي
 * ─────────────────────────────────────────────────────────────
 */
function applyConditionalFormatting(sheet) {
  var lastRow = sheet.getLastRow();
  var range = sheet.getRange(2, 1, lastRow - 1, 15);

  // Clear existing rules
  var rules = sheet.getConditionalFormatRules();
  sheet.clearConditionalFormatRules();

  // Rule 1: Cancelled = Red background
  var rule1 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("Cancelled")
    .setBackground("#ffcdd2")
    .setFontColor("#b71c1c")
    .setRanges([sheet.getRange(2, 11, lastRow - 1, 1)])
    .build();

  // Rule 2: Completed = Green background
  var rule2 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("Completed")
    .setBackground("#c8e6c9")
    .setFontColor("#1b5e20")
    .setRanges([sheet.getRange(2, 11, lastRow - 1, 1)])
    .build();

  // Rule 3: Moved = Yellow background
  var rule3 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("Moved")
    .setBackground("#fff9c4")
    .setFontColor("#f57f17")
    .setRanges([sheet.getRange(2, 11, lastRow - 1, 1)])
    .build();

  // Rule 4: Steering Committee = Indigo
  var rule4 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains("Steering Committee")
    .setBackground("#e8eaf6")
    .setFontColor("#283593")
    .setRanges([sheet.getRange(2, 9, lastRow - 1, 1)])
    .build();

  // Rule 5: EHA Pulse = Light Blue
  var rule5 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains("EHA Pulse")
    .setBackground("#e3f2fd")
    .setFontColor("#1565c0")
    .setRanges([sheet.getRange(2, 9, lastRow - 1, 1)])
    .build();

  sheet.setConditionalFormatRules([rule1, rule2, rule3, rule4, rule5]);
}

/**
 * ─────────────────────────────────────────────────────────────
 * 📊 updateDashboard - تحديث لوحة التحكم
 * ─────────────────────────────────────────────────────────────
 */
function updateDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dbSheet = ss.getSheetByName("قاعدة البيانات");
  var archiveSheet = ss.getSheetByName("محفظة الإلغاء");
  var dashSheet = ss.getSheetByName("لوحة التحكم");

  if (!dashSheet) return;

  var dbData = dbSheet.getRange(2, 1, dbSheet.getLastRow() - 1, 11).getValues();
  var archiveData = archiveSheet ? archiveSheet.getRange(2, 1, archiveSheet.getLastRow() - 1, 11).getValues() : [];

  var totalMeetings = dbData.length + archiveData.length;
  var scheduled = 0, completed = 0, cancelled = 0, moved = 0;

  for (var i = 0; i < dbData.length; i++) {
    var status = dbData[i][10];
    if (status === "Scheduled") scheduled++;
    if (status === "Completed") completed++;
    if (status === "Moved") moved++;
  }

  cancelled = archiveData.length;

  // Update dashboard
  dashSheet.getRange("B2").setValue(totalMeetings);
  dashSheet.getRange("B3").setValue(scheduled);
  dashSheet.getRange("B4").setValue(completed);
  dashSheet.getRange("B5").setValue(cancelled);
  dashSheet.getRange("B6").setValue(moved);
}

/**
 * ─────────────────────────────────────────────────────────────
 * 🧪 testOnEdit - اختبار التشغيل التلقائي
 * ─────────────────────────────────────────────────────────────
 */
function testOnEdit() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dbSheet = ss.getSheetByName("قاعدة البيانات");

  // Simulate changing a row's status to Cancelled
  var lastRow = dbSheet.getLastRow();
  dbSheet.getRange(lastRow, 11).setValue("Cancelled");
  dbSheet.getRange(lastRow, 13).setValue(new Date());
  dbSheet.getRange(lastRow, 14).setValue("Test cancellation");
  dbSheet.getRange(lastRow, 15).setValue("System Test");

  // Manually trigger the archive function
  moveToArchive(dbSheet, lastRow);
}

/**
 * ─────────────────────────────────────────────────────────────
 * 🆕 createNewMonthTemplate - إنشاء قالب شهر جديد
 * ─────────────────────────────────────────────────────────────
 */
function createNewMonthTemplate(month, year) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var templateSheet = ss.getSheetByName("قالب يونيو 2026");

  var newSheetName = "قالب " + getArabicMonthName(month) + " " + year;
  var newSheet = ss.insertSheet(newSheetName);

  // Copy structure from template
  if (templateSheet) {
    templateSheet.copyTo(newSheet);
  }

  SpreadsheetApp.getActive().toast(
    "✅ تم إنشاء قالب جديد: " + newSheetName,
    "قالب شهر جديد",
    5
  );
}

function getArabicMonthName(month) {
  var months = ["", "يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيو",
                "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  return months[month] || "";
}
