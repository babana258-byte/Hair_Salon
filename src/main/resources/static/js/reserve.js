var modal = document.getElementById('id01');
window.onclick = function (event) { if (event.target == modal) modal.style.display = "none"; }

let currentDate = new Date();
let selectedDate = null;
const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  document.getElementById('currentMonthName').textContent = `${year} 年 ${monthNames[month]}`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const calDays = document.getElementById('calDays');
  calDays.innerHTML = '';

  for (let i = firstDay - 1; i >= 0; i--) {
    const day = document.createElement('div');
    day.className = 'cal-day other-month';
    day.textContent = daysInPrev - i;
    calDays.appendChild(day);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const day = document.createElement('div');
    day.className = 'cal-day';
    day.textContent = d;
    const thisDate = new Date(year, month, d);
    const isPast = thisDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (isPast || thisDate.getDay() === 0) day.classList.add('disabled');
    if (today.getFullYear() === year && today.getMonth() === month && today.getDate() === d) day.classList.add('today');
    if (selectedDate && selectedDate.getFullYear() === year && selectedDate.getMonth() === month && selectedDate.getDate() === d) day.classList.add('selected');
    day.addEventListener('click', function () {
      if (day.classList.contains('disabled')) return;
      selectedDate = new Date(year, month, d);
      document.getElementById('selectedDateDisplay').textContent = `已選擇：${year} 年 ${month + 1} 月 ${d} 日`;
      renderCalendar();
    });
    calDays.appendChild(day);
  }

  const totalCells = calDays.children.length;
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let i = 1; i <= remaining; i++) {
    const day = document.createElement('div');
    day.className = 'cal-day other-month';
    day.textContent = i;
    calDays.appendChild(day);
  }
}

document.getElementById('prevMonth').addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); });
document.getElementById('nextMonth').addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); });
renderCalendar();

document.getElementById('reserveForm').addEventListener('submit', function (e) {
  e.preventDefault();
  if (!selectedDate) { alert('請先選擇預約日期！'); return; }
  // TODO: 串接後端 API
  document.getElementById('successMsg').style.display = 'block';
  setTimeout(() => {
    document.getElementById('successMsg').style.display = 'none';
    this.reset(); selectedDate = null;
    document.getElementById('selectedDateDisplay').textContent = '請選擇預約日期';
    renderCalendar();
  }, 4000);
});
