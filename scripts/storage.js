chrome.storage.local.get('syncStorage', (data) => {
  keys = ['id', 'studyId', 'problemId'];

  if(!data  || !data.syncStorage){
    keys.forEach((key) => {
        chrome.storage.sync.get(key, (data) => {
          chrome.storage.local.set({ [key]: data[key] });
        });
      });
      chrome.storage.local.set({ isSync: true }, (data) => {
        // if (debug)
        console.log('podofarm Synced to local values');
      });
    } else {
      // console.log('Upload Completed. Local Storage status:', data);
      console.log('podofarm Storage ready to upload');
    }
  });


async function getObjectFromLocalStorage(key) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get(key, function(value) {
          resolve(value[key]);
        
        console.log("getObjectFromStorage 시도 중 ");
        console.log(value[key]);

        });
      } catch (ex) {
        reject(ex);
      }
    });
  }


  async function getId() {
    return await getObjectFromLocalStorage('id');
  }
  
  async function getStudyId() {
    return await getObjectFromLocalStorage('studyId');
  }
  
  async function getProblemId() {
    return await getObjectFromLocalStorage('problemId');
  }

