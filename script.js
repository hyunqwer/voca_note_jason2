'use strict';

// -----------------------------------
// [1] JSON 데이터 로드
// -----------------------------------
let folderFiles = {};

async function loadFolderFiles() {
  try {
    const response = await fetch('folderFiles.json');
    if (!response.ok) throw new Error('JSON 파일을 불러오는 데 실패했습니다.');
    folderFiles = await response.json();
    console.log("[DEBUG] Loaded folderFiles:", folderFiles);
    changeFolder(); // 데이터를 로드한 후 폴더 목록 업데이트
  } catch (error) {
    console.error("폴더 파일 JSON 로드 오류:", error);
  }
}

// -----------------------------------
// [2] 플레이어 동작부
// -----------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const baseFolderPath = "https://app.yoons.com/mobile/beflwords/vocanote/";
  const folderSelect = document.getElementById("folderSelect");
  const audioPlayer = document.getElementById("audioPlayer");
  const currentTrackLabel = document.getElementById("currentTrack");
  const audioList = document.getElementById("audioList");
  const playlistContainer = document.querySelector(".playlist");

  let currentFolder = folderSelect.value;
  let audioFiles = [];
  let currentIndex = 0;

  const updatePlaylistView = () => {
    audioList.innerHTML = "";
    audioFiles.forEach((file, i) => {
      const li = document.createElement("li");
      li.textContent = file;
      li.addEventListener("click", () => playTrack(i));
      if (i === currentIndex) {
        li.classList.add("active");
      }
      audioList.appendChild(li);
    });
  };

  const playTrack = (index) => {
    if (index >= 0 && index < audioFiles.length) {
      currentIndex = index;
      const fileName = audioFiles[currentIndex];
      audioPlayer.src = `${baseFolderPath}${currentFolder}/${fileName}`;
      currentTrackLabel.textContent = `현재 재생 중: ${fileName}`;
      updatePlaylistView();
      audioPlayer.play();

      // 재생 목록 스크롤 위치 조정
      const liElement = audioList.children[currentIndex];
      if (liElement) {
        const liRect = liElement.getBoundingClientRect();
        const containerRect = playlistContainer.getBoundingClientRect();
        const liOffsetFromContainerTop = liRect.top - containerRect.top;
        const liHeight = liElement.offsetHeight;
        const desiredScrollTop = playlistContainer.scrollTop + (liOffsetFromContainerTop - 2 * liHeight);
        playlistContainer.scrollTo({
          top: Math.max(desiredScrollTop, 0),
          behavior: 'smooth'
        });
      }
    }
  };

  const playNextTrack = () => {
    if (currentIndex + 1 < audioFiles.length) {
      playTrack(currentIndex + 1);
    }
  };

  // 폴더 선택 시, 해당 폴더의 첫 번째 파일이 목록에 표시되도록 변경
  const changeFolder = () => {
    currentFolder = folderSelect.value;
    audioFiles = folderFiles[currentFolder] || [];
    currentIndex = 0; // 새 폴더에서는 항상 첫 번째 파일을 기준으로 함

    updatePlaylistView();
    playlistContainer.scrollTop = 0; // 목록 스크롤을 최상단으로 초기화

    if (audioFiles.length > 0) {
      const fileName = audioFiles[0];
      currentTrackLabel.textContent = `현재 재생 중: ${fileName}`;
      audioPlayer.src = `${baseFolderPath}${currentFolder}/${fileName}`;
    } else {
      currentTrackLabel.textContent = "현재 재생 중: 없음";
      audioPlayer.src = "";
    }
  };

  const initEventListeners = () => {
    audioPlayer.addEventListener("ended", playNextTrack);
    folderSelect.addEventListener("change", changeFolder);
  };

  const init = async () => {
    initEventListeners();
    await loadFolderFiles(); // JSON 데이터 로드 후 초기 폴더 설정
  };

  init();
});
