function doGet(e) {
  const calendarId = "YOUR_CALENDAR_ID";
  const cal = CalendarApp.getCalendarById(calendarId);

  const date = new Date(e.parameter.date); // YYYY-MM-DD
  const start = new Date(date);
  const end = new Date(date);
  end.setHours(23, 59, 59);

  // 既存イベントを取得
  const events = cal.getEvents(start, end);

  // 完全自由だが、ここでは10:00〜18:00の1時間刻み枠を例示
  const timeSlots = [];
  for (let h = 10; h < 18; h++) {
    timeSlots.push(`${("0"+h).slice(-2)}:00`);
  }

  // 予約済み枠を除外
  const available = timeSlots.filter(slot => {
    const hour = parseInt(slot.split(":")[0], 10);
    const slotStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour);
    const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000);

    return !events.some(ev => 
      (ev.getStartTime() < slotEnd && slotStart < ev.getEndTime())
    );
  });

  return ContentService.createTextOutput(JSON.stringify(available))
    .setMimeType(ContentService.MimeType.JSON);
}
