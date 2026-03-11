function s() {
  alert(`預約成功!我們已收到您的預約~`)
}

// 1. 獲取所有需要的 HTML 元素
const prevButton = document.getElementById('prevMonth');
const nextButton = document.getElementById('nextMonth');
const monthNameElement = document.getElementById('currentMonthName');
const calDaysElement = document.querySelector('.cal-days'); // 日期容器

// 2. 定義月份列表和起始月份 (我們將使用 JavaScript Date 物件來管理年份)
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// 初始化日期為當前時間 (您可以設定為任何您想要的起始月份)
let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth(); // 0 (January) 到 11 (December)

// 獲取今天的日期 (用於比較)
const today = new Date();
const todayYear = today.getFullYear();
const todayMonth = today.getMonth();
const todayDate = today.getDate();

// 3. 處理月份切換的函數
function updateCalendar(year, monthIndex) {
  monthNameElement.textContent = monthNames[monthIndex];

  const firstDayOfMonth = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();

  calDaysElement.innerHTML = '';

  // 判斷當前顯示的月份是否就是今天所在的月份
  const isCurrentMonth = (year === todayYear && monthIndex === todayMonth);

  // 1. 填補上個月的灰色日期 (過去的日期一律禁用)
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    // 過去的月份和日期，設為禁用
    calDaysElement.innerHTML += `<button class="btn cal-btn text-body-secondary" disabled type="button">${day}</button>`;
  }

  // 2. 填入當月的主要日期
  for (let day = 1; day <= daysInMonth; day++) {
    let classes = ['btn', 'cal-btn'];
    let attributes = '';

    // A. 判斷是否為今天
    if (isCurrentMonth && day === todayDate) {
      classes.push('cal-today'); // 加入 today 標記 class
    }

    // B. 判斷是否為已過去的日期
    if (isCurrentMonth && day < todayDate) {
      classes.push('text-body-secondary'); // 設為灰色文字
      attributes += ' disabled'; // 設為不能點擊
    }

    // 如果顯示的月份是在今天之前（例如：現在是 2025/12，但顯示 2025/11），整個月份都應該禁用
    if (year < todayYear || (year === todayYear && monthIndex < todayMonth)) {
      classes.push('text-body-secondary');
      attributes += ' disabled';
    }

    calDaysElement.innerHTML += `<button class="${classes.join(' ')}" type="button"${attributes}>${day}</button>`;
  }

  // 3. 填補下個月的灰色日期 (未來的日期可以點擊，但我們設為 disabled 是為了視覺統一)
  const totalCells = firstDayOfMonth + daysInMonth;
  const remainingCells = 42 - totalCells;

  for (let day = 1; day <= remainingCells; day++) {
    // 未來的月份和日期，設為禁用 (通常日曆組件不讓點擊下個月的日期)
    calDaysElement.innerHTML += `<button class="btn cal-btn text-body-secondary" disabled type="button">${day}</button>`;
  }
}
// 4. 定義切換月份的點擊事件
prevButton.addEventListener('click', function () {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11; // 循環到去年十二月
    currentYear--;
  }
  updateCalendar(currentYear, currentMonth);
});

nextButton.addEventListener('click', function () {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0; // 循環到明年一月
    currentYear++;
  }
  updateCalendar(currentYear, currentMonth);
});

// 5. 初始化日曆
// 第一次載入時，使用您 HTML 中原本的日期資料來初始化（或直接用當前月份）
// 如果您想讓它完全動態，可以將 HTML 中的日期按鈕清空，然後調用：
updateCalendar(currentYear, currentMonth);