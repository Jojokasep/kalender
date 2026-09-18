const monthYearEl = document.getElementById('monthYear');
const daysGridEl = document.getElementById('daysGrid');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const noteInput = document.getElementById('note-input');
const savedNotesEl = document.getElementById('saved-notes');

let currentDate = new Date();
let selectedDateKey = formatDateKey(new Date());

const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

function formatDateKey(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function loadNotesForSelectedDate() {
  const notes = localStorage.getItem(`note_${selectedDateKey}`);
  savedNotesEl.textContent = notes ? notes : 'Tidak ada catatan untuk tanggal ini.';
  noteInput.value = notes ? notes : '';
}

noteInput.addEventListener('input', () => {
  localStorage.setItem(`note_${selectedDateKey}`, noteInput.value);
  loadNotesForSelectedDate();
});

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthYearEl.textContent = `${monthNames[month]} ${year}`;

  daysGridEl.innerHTML = '';

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  for (let i = 0; i < firstDayIndex; i++) {
    const emptyDiv = document.createElement('div');
    emptyDiv.classList.add('day', 'empty');
    daysGridEl.appendChild(emptyDiv);
  }

  for (let day = 1; day <= totalDaysInMonth; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day');
    dayDiv.textContent = day;

    const currentLoopDate = new Date(year, month, day);
    const loopKey = formatDateKey(currentLoopDate);

    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      dayDiv.classList.add('today');
    }

    dayDiv.addEventListener('click', () => {
      selectedDateKey = loopKey;
      loadNotesForSelectedDate();
    });

    daysGridEl.appendChild(dayDiv);
  }

  loadNotesForSelectedDate();
}

prevBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW terdaftar:', reg.scope))
      .catch(err => console.error('SW gagal:', err));
  });
}

renderCalendar();
