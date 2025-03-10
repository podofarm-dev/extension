// Set to true to enable console log
const debug = false;

/* 
  문제 제출 맞음 여부를 확인하는 함수
  2초마다 문제를 파싱하여 확인
*/
let loader;

const currentUrl = window.location.href;


//채점하기 눌렀을 때 임시로 보낼 데이터 캐시에 저장, 실패인 경우 캐시 삭제
document.addEventListener("click", async function (event) {
  if (event.target.classList.contains("btn") && event.target.classList.contains("btn-primary")) {
    console.log("버튼 클릭 감지됨!");

    try {
      const enable = await checkEnable(); // 
      if (!enable) return; // enable이 false면 실행하지 않음

      cacheSetting();
    } catch (error) {
      console.error("checkEnable() 실행 중 오류 발생:", error);
    }
  }
});


async function cacheSetting() {
  console.log("버튼 클릭 후 실행됨");

  // Chrome Storage에서 'id' 가져오기 (비동기 처리)
  const id = await getObjectFromLocalStorage('id');
  const problemId = document.querySelector('div.main > div.lesson-content').getAttribute('data-lesson-id');
  console.log("id, problemId" + id + problemId);
  /*// API 요청
  fetch("http://test.podofarm.xyz/code/cacheData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        memberId: id,
        problemId: problemId
      })
    })
    .then(response => response.json())
    .then(data => console.log("API 응답:", data))
    .catch(error => console.error("API 요청 실패:", error));
};
*/

// 프로그래머스 연습 문제 주소임을 확인하고, 맞다면 로더를 실행
if (currentUrl.includes('/learn/courses/30') && currentUrl.includes('lessons')) startLoader();

function startLoader() {
  loader = setInterval(async () => {
    const enable = await checkEnable();
    console.log(enable + "enbale 값");
    if (!enable) stopLoader();
    else if (getSolvedResult().includes('정답')) {
      console.log('정답이 나왔습니다. Podofarm으로 업로드를 시작합니다.');
      stopLoader();
      
      try {
        const PodoData = await parseData();
        await beginUpload(PodoData);
        
      } catch (error) {
        console.log(error);
        //다른 에러가 발생 할 시 추가로 작업을 시도할지 결정할 것.
      }
    }
  }, 2000);
}

function stopLoader() {
  clearInterval(loader);
}

function getSolvedResult() {
  const result = document.querySelector('div.modal-header > h4');
  if (result) return result.innerText;
  return '';
}

/* 파싱 직후 실행되는 함수 */
async function beginUpload(PodoData) {

  const problemId = await getProblemId();

  if (isNotEmpty(PodoData) && !problemId.includes(PodoData.problemId)) {
    await uploadOneSolveProblemOnPodo(PodoData);
    stopLoader();
    showConfirmModal(
      '이미 푼 문제로 Podofarm에 업로드 되었습니다! 다시 업로드 할까요?',
      async () => {
        await uploadOneSolveProblemOnPodo(PodoData);
        stopLoader();
      }
    );
  }
}

async function versionUpdate() {
  log('start versionUpdate');
  const stats = await updateLocalStorageStats();
  // update version.
  stats.version = getVersion();
  await saveStats(stats);
  log('stats updated.', stats);
}