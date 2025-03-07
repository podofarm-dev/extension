document.addEventListener("DOMContentLoaded", function () {
    const idInput = document.getElementById("idInput");
    const studyIdInput = document.getElementById("studyIdInput");
    const connectButton = document.getElementById("connectButton");
    const connectSuccessButton = document.getElementById("connectSuccessButton");
    const cancelLink = document.getElementById("cancelLink");
    const toggleSwitch = document.getElementById("toggleSwitch");
    const extensionContent = document.querySelector(".extension-container-area-content");
    const syncButton = document.querySelector(".extension-container-button-sync");

    initializeUI();

    connectButton.addEventListener("click", function () {
        const id = idInput.value.trim();
        const studyId = studyIdInput.value.trim();

        if (!id || !studyId) {
            alert("아이디와 스터디 코드를 모두 입력해주세요.");
            return;
        }

        //sendDataToServer('http://test.podofarm.xyz/code/receive-sync', id, studyId);
        sendDataToServer('http://localhost:8080/code/receive-sync', id, studyId);
    });

    cancelLink.addEventListener("click", function () {
        resetUI();
        chrome.storage.local.remove(["id", "studyId", "problemId", "isConnected", "pfEnable"], function () {
            console.log("연동 취소 완료");
        });
    });

    idInput.addEventListener("input", function () {
        if (this.value.length > 6) this.value = this.value.slice(0, 6);
    });

    studyIdInput.addEventListener("input", function () {
        if (this.value.length > 5) this.value = this.value.slice(0, 5);
    });

    toggleSwitch.addEventListener("change", function () {
        chrome.storage.local.set({ 'pfEnable': this.checked }, function () {
            console.log(`토글 상태 저장됨: ${toggleSwitch.checked ? "ON" : "OFF"}`);
        });

        if (this.checked) {
            syncButton.classList.add("toggled");
        } else {
            syncButton.classList.remove("toggled");
        }
    });

    function initializeUI() {
        chrome.storage.local.get(['id', 'studyId', 'isConnected', 'pfEnable'], function (data) {
            if (data.isConnected && data.id && data.studyId) {
                handleSuccessUI(data.id, data.studyId);
                toggleSwitch.checked = data.pfEnable ?? true;

                if (toggleSwitch.checked) {
                    syncButton.classList.add("toggled");
                } else {
                    syncButton.classList.remove("toggled");
                }
            } else {
                resetUI();
            }
        });
    }

    function sendDataToServer(url, id, studyId) {
        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, studyId })
        })
        .then(response => response.text())
        .then(data => {
            console.log(`${url} 서버로부터 받은 응답:`, data);
    
            if (data === "success") { 
                chrome.storage.local.set({ id, studyId, isConnected: true, problemId: [] });
    
                fetchDataFromServer("http://localhost:8080/code/fetchDataFromServer", id);
    
                chrome.storage.local.set({ pfEnable: true }, function () {
                    toggleSwitch.checked = true;
                    syncButton.classList.add("toggled");
                    console.log("연동 시 토글 상태 ON으로 설정");
                });
    
                handleSuccessUI(id, studyId);
            } else {
                alert(`ID와 스터디 아이디를 확인해주세요.`);
            }
        })
        .catch(error => {
            console.error(`Error on ${url}:`, error);
            alert(`[${url}] 연동 중 오류가 발생했습니다.`);
        });
    }
    
    async function fetchDataFromServer(url, id) {
        try {
            const requestUrl = `${url}?id=${id}`;
    
            const response = await fetch(requestUrl);
    
            if (!response.ok) {
                alert("오류가 발생했습니다.");
                resetUI();
                throw new Error(`서버 응답 실패: ${response.status}`);
            }
    
            const data = await response.json();
    
            const problemIdList = Array.isArray(data.problemIdList) ? data.problemIdList : [];
    
            chrome.storage.local.set({ problemId: problemIdList }, function () {
                console.log("저장된 problemIdList:", problemIdList);
            });
    
        } catch (error) {
            console.error("Id list error:", error);
            alert("서버에서 문제 ID 리스트를 받아오는 중 오류가 발생했습니다.");
            resetUI();
        }
    }
    

    function handleSuccessUI(id, studyId) {
        connectButton.style.display = "none";
        connectSuccessButton.style.display = "flex";
        cancelLink.style.display = "block";

        idInput.readOnly = true;
        studyIdInput.readOnly = true;
        idInput.value = id;
        studyIdInput.value = studyId;

        extensionContent.classList.add("connected");
    }

    function resetUI() {
        connectButton.style.display = "flex";
        connectSuccessButton.style.display = "none";
        cancelLink.style.display = "none";

        idInput.readOnly = false;
        studyIdInput.readOnly = false;
        idInput.value = '';
        studyIdInput.value = '';

        extensionContent.classList.remove("connected");
        toggleSwitch.checked = false;
        syncButton.classList.remove("toggled");
        chrome.storage.local.set({ pfEnable: false });
    }
});