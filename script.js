'use strict';

// -----------------------------------
// [1] 초기 폴더 및 파일 목록 정의
// -----------------------------------
let folderFiles = {
  "Phonics": ["Phonics_1~10.mp3", "Phonics_11~20.mp3", "Phonics_21~30.mp3", "Phonics_31~40.mp3"],
  "Rookie & Rising Star": ["Rookie_1~20.mp3", "Rookie_21~40.mp3", "Rising Star 3_244~263.mp3", "Rising Star 4_928~947.mp3"],
  "All-Star & MVP": ["All-Star 5_1~30.mp3", "All-Star 5_31~60.mp3", "MVP 7_1280~1309.mp3", "MVP 7_1310~1339.mp3"],
  "중고등 Level 1~2": ["중고등 Level 1_1~30.mp3", "중고등 Level 1_31~60.mp3", "중고등 Level 2_539~568.mp3", "중고등 Level 2_569~598.mp3"],
  "중고등 Level 3~4": ["중고등 Level 3_1~30.mp3", "중고등 Level 3_31~60.mp3", "중고등 Level 4_613~642.mp3", "중고등 Level 4_643~672.mp3"],
  "중고등 Level 5~6": ["중고등 Level 5_1~30.mp3", "중고등 Level 5_31~60.mp3", "중고등 Level 6_817~846.mp3", "중고등 Level 6_847~876.mp3"],
  "중고등 Level 7~9": ["중고등 Level 7_1~30.mp3", "중고등 Level 7_31~60.mp3", "중고등 Level 8_825~854.mp3", "중고등 Level 9_1476~1505.mp3"]
};

const defaultFolder = "Phonics"; // 첫 화면에서 기본 폴더 설정

async function loadFolderFiles() {
  try {
    const response = await fetch('folderFiles.json');
    if (!response.ok) throw new Error('JSON 파일을 불러오는 데 실패했습니다.');
    folderFiles = await response.json(); // JSON 파일 로드 후 덮어쓰기
    console.log("[DEBUG] Loaded folderFiles:", folderFiles);
  } catch (error) {
    console.error("폴더 파일 JSON 로드 오류, 기본 데이터 사용:", error);
  }
  changeFolder(); // 파일 목록 갱신
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

  let currentFolder = defaultFolder;
  let audioFiles = folderFiles[defaultFolder] || [];
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
    }
  };

  const changeFolder = () => {
    currentFolder = folderSelect.value;
    audioFiles = folderFiles[currentFolder] || [];
    currentIndex = 0;
    updatePlaylistView();
    playlistContainer.scrollTop = 0;
  };

  const initEventListeners = () => {
    folderSelect.addEventListener("change", changeFolder);
  };

  const init = async () => {
    initEventListeners();
    updatePlaylistView(); // 초기 폴더 Phonics 파일 표시
    await loadFolderFiles(); // JSON 데이터 로드 후 갱신
  };

  init();
});
