// 오늘 날짜 가져오기
const today = new Date();

// 날짜 정보 분해
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const day = today.getDate();
const month = monthNames[today.getMonth()];
const weekday = today.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase(); // 요일 대문자 변환

// HTML 요소에 적용
document.getElementById('month').textContent = month;
document.getElementById('day').textContent = day;
document.getElementById('weekday').textContent = weekday;

/**
 * API에서 명언을 가져오는 함수
 */
async function fetchQuote() {
  try {
    const response = await fetch("https://korean-advice-open-api.vercel.app/api/advice");
    const data = await response.json();
    
    // 명언 추가
    const quoteElement = document.createElement("div");
    quoteElement.className = "quote";
    quoteElement.innerHTML = `<p>"${data.message}"</p><span>- ${data.author} -</span>`;
    
    // 요일 아래에 추가
    document.querySelector(".date-card").appendChild(quoteElement);
  } catch (error) {
    console.error("명언을 불러오는 중 오류 발생:", error);
  }
}

// 명언 가져오기 실행
fetchQuote();

/**
 * 달력 생성 함수
 * @param {number} year - 연도
 * @param {number} month - 월 (0부터 시작: 0 = 1월, 11 = 12월)
 * @returns {string} HTML 문자열
 */
function generateCalendar(year, month) {
  const firstDay = new Date(year, month, 1).getDay(); // 0: 일요일
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  let calendarHTML = '<table><thead><tr>';
  // 요일 헤더 (일 ~ 토)
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  for (let day of weekDays) {
    calendarHTML += `<th>${day}</th>`;
  }
  calendarHTML += '</tr></thead><tbody><tr>';
  
  // 1일 이전 공백 채우기
  for (let i = 0; i < firstDay; i++) {
    calendarHTML += '<td></td>';
  }
  
  // 해당 월의 날짜 채우기
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    let className = "";
    // 오늘 날짜 강조
    if (currentDate.toDateString() === today.toDateString()) {
      className = "today";
    }
    calendarHTML += `<td class="${className}">${day}</td>`;
    
    // 한 주가 끝나면 새로운 행 추가
    if ((day + firstDay) % 7 === 0 && day !== daysInMonth) {
      calendarHTML += '</tr><tr>';
    }
  }
  
  // 마지막 주의 빈 칸 채우기
  const remainingCells = (7 - ((daysInMonth + firstDay) % 7)) % 7;
  for (let i = 0; i < remainingCells; i++) {
    calendarHTML += '<td></td>';
  }
  
  calendarHTML += '</tr></tbody></table>';
  return calendarHTML;
}

// 달력 div에 생성된 달력 HTML 삽입
document.getElementById('calendar').innerHTML = generateCalendar(today.getFullYear(), today.getMonth());
