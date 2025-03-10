

async function uploadOneSolveProblemOnPodo(PodoData) {
  const id = await getId();
  const studyId = await getStudyId();
  
  if (isNull(id) || isNull(studyId)) {
    console.error('id, studyId Null', id, studyId);

    //todo 
    //모달창 생성 아이디와 비밀번호가 연동되지 않았다.
    return;
  }

  // 전역 변수에서 `elapsedTime` 가져오기 (타이머에서 저장됨)
  const timeSpent = window.elapsedTimeForUpload || "00:00:00"; // 기본값 00:00:00

  return uploadToMultipleServers(id, studyId, PodoData.problemTitle, PodoData.code, PodoData.readme, PodoData.fileName, PodoData.message, PodoData.resultDay, PodoData.problemId, PodoData.level, PodoData.resultMessage, timeSpent);
}

async function uploadToMultipleServers(id, studyId, Title, sourceText, readmeText, filename, commitMessage, resultDay, problemId, level, resultMessage, timeSpent) {
  const data = {
    id: id,
    Title : Title,
    studyId: studyId,
    sourceText: sourceText,
    readmeText: readmeText,
    filename: filename,
    commitMessage: commitMessage,
    resultDay: resultDay,
    problemId: problemId,
    level: level,
    resultMessage : resultMessage,
    timeSpent: timeSpent 
  };

  try {
    console.log("업로드 데이터:", data);

    const servers = [
      //warning 바꿀 것 api
      //'https://test.podofarm.xyz/code/upload'
      'http://localhost:8080/code/upload'
    ];

    const uploadPromises = servers.map(async (url) => {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        

        //1. Local Storage에서 ProblemId 확인 만약 푼 문제라면, 이미 푼 문제입니다. 내용을 업데이트할까요 묻기
        //2. 푼 문제가 아니라면 


        const responseData = await response.text();
        console.log(`${url} 서버로부터 받은 응답:`, responseData);

        if (!response.ok) {
          throw new Error(`Error from ${url}: ${responseData}`);
        }

        return responseData;
      } catch (error) {
        console.error(`${url} 서버 업로드 중 오류 발생:`, error);
        throw error;
      }
    });

    const results = await Promise.all(uploadPromises);
    console.log("모든 서버 업로드 완료:", results);

  } catch (error) {
    console.error('Error uploading to multiple servers:', error);
  }
}