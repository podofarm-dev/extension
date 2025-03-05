/**
 * 로딩 버튼 추가
 */

/**
 * 업로드 완료 아이콘 표시
 */
function getDateString(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function markUploadedCSS() {
  uploadState.uploading = false;
  const elem = document.getElementById('BaekjoonHub_progress_elem');
  elem.className = 'markuploaded';
}

/**
 * 업로드 실패 아이콘 표시
 */
function markUploadFailedCSS() {
  uploadState.uploading = false;
  const elem = document.getElementById('BaekjoonHub_progress_elem');
  elem.className = 'markuploadfailed';
}

/**
 * 총 실행시간이 10초를 초과한다면 실패로 간주합니다.
 */
function startUploadCountDown() {
  uploadState.uploading = true;
  uploadState.countdown = setTimeout(() => {
    if (uploadState.uploading === true) {
      markUploadFailedCSS();
    }
  }, 10000);
}

/* 타이머 기능 */
let timerInterval;
let startTime;
let elapsedTime = 0;

function startTimer() {
  if (timerInterval) return;

  startTime = new Date() - (elapsedTime * 1000);
  timerInterval = setInterval(updateTimerDisplay, 1000);

  document.getElementById('Podofarm_start_button').disabled = true;
  document.getElementById('Podofarm_stop_button').disabled = false;
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;

  elapsedTime = Math.floor((new Date() - startTime) / 1000);

  document.getElementById('Podofarm_start_button').disabled = false;
  document.getElementById('Podofarm_stop_button').disabled = true;
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  elapsedTime = 0;

  const timerElement = document.getElementById('Podofarm_timer');
  if (timerElement) timerElement.textContent = "00:00:00";

  document.getElementById('Podofarm_start_button').disabled = false;
  document.getElementById('Podofarm_stop_button').disabled = true;
}

function updateTimerDisplay() {
  elapsedTime = Math.floor((new Date() - startTime) / 1000);

  const formattedTime = formatTime(elapsedTime);

  const timerElement = document.getElementById('Podofarm_timer');
  if (timerElement) timerElement.textContent = formattedTime;
}

// 초 단위를 HH:MM:SS 형식으로 변환하는 함수
function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "00:00:00";

  const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${secs}`;
}

function addTimerUI() {
  let timerContainer = document.getElementById('Podofarm_timer_container');

  if (!timerContainer) {
    timerContainer = document.createElement('li');
    timerContainer.id = 'Podofarm_timer_container';
    timerContainer.style = 'display: flex; align-items: center; margin-left: 10px; gap: 10px;';

    // 타이머 표시
    const timerElement = document.createElement('span');
    timerElement.id = 'Podofarm_timer';
    timerElement.textContent = "00:00:00";
    timerElement.style = 'font-weight: bold; color: #ff5722; font-size: 16px;';

    // 버튼 스타일
    const buttonStyle = 'padding: 5px 10px; font-size: 12px; cursor: pointer; border: none; background-color: #ddd; border-radius: 5px;';

    // 재생 버튼
    const startButton = document.createElement('button');
    startButton.id = 'Podofarm_start_button';
    startButton.textContent = "START";
    startButton.style = buttonStyle;
    startButton.onclick = startTimer;

    // 멈춤 버튼
    const stopButton = document.createElement('button');
    stopButton.id = 'Podofarm_stop_button';
    stopButton.textContent = "STOP";
    stopButton.style = buttonStyle;
    stopButton.onclick = stopTimer;
    stopButton.disabled = true;

    // 초기화 버튼
    const resetButton = document.createElement('button');
    resetButton.id = 'Podofarm_reset_button';
    resetButton.textContent = "RESET";
    resetButton.style = buttonStyle;
    resetButton.onclick = resetTimer;

    // 요소 추가
    timerContainer.appendChild(timerElement);
    timerContainer.appendChild(startButton);
    timerContainer.appendChild(stopButton);
    timerContainer.appendChild(resetButton);

    // 네비게이션 바 내부에 추가
    const target = document.querySelector('.nav.nav-pills.editor-nav-pills.tap-form');
    if (target) target.appendChild(timerContainer);
  }
}

// '정답입니다' 감지 후 타이머 정지 및 서버 전송
function observeCorrectAnswer() {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1 && node.textContent.includes('정답입니다')) {
            stopTimer();

            console.log("정답 감지됨, 문제 업로드를 시작합니다.");

            // elapsedTime이 NaN이면 00:00:00으로 기본값 설정
            const safeTimeSpent = formatTime(elapsedTime);
            sendTimerData(safeTimeSpent);
          }
        });
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// `timeSpent`을 HH:MM:SS 형식으로 변환하여 업로드 함수에 전달
function sendTimerData(timeSpent) {
  if (!timeSpent || timeSpent === "NaN:NaN:NaN") {
    timeSpent = "00:00:00";
  }

  console.log("타이머 데이터 전송:", timeSpent);
  window.elapsedTimeForUpload = timeSpent;
}

// 스크립트 실행 시 UI 추가 및 정답 감지 기능 활성화
observeCorrectAnswer();
addTimerUI();
