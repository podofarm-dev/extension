// Set to true to enable console log
const debug = false;

/* 
  문제 제출 맞음 여부를 확인하는 함수
  2초마다 문제를 파싱하여 확인
*/
let loader;

const currentUrl = window.location.href;

// 프로그래머스 연습 문제 주소임을 확인하고, 맞다면 로더를 실행
if (currentUrl.includes('/learn/courses/30') && currentUrl.includes('lessons')) startLoader();

function startLoader() {
  loader = setInterval(async () => {

    const enable = await checkEnable();

    if(!enable) stopLoader();
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

  //todo
  //여기 작업이 이미 푼 문제인지 아닌지에 따라서 모달창 주고 서버에 옮기는 작업
  const problemId = await getProblemId();

  if (isNotEmpty(PodoData) && !problemId.includes(PodoData.problemId)) {
    await uploadOneSolveProblemOnPodo(PodoData);
    stopLoader();
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