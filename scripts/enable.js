/* 
    비활성화시 작동되지 않게 함
    가독성을 위해 따로 파일 분리함
*/


async function checkEnable() {
  try {
    const enable = await new Promise((resolve) => {
      chrome.storage.local.get(["pfEnable"], function (data) {
        resolve(data.pfEnable !== undefined ? data.pfEnable : true);
      });
    });
    if (!enable) writeEnableMsgOnLog();
    return enable;

  } catch (error) {
    console.error("checkEnable() 실행 중 오류 발생:", error);
    return false;
  }
}

function writeEnableMsgOnLog() {
  const errMsg = 'Podofarm 확장을 활성화하고 시도해주세요';
  console.log(errMsg);
}
