'use strict';

// JSON 파일을 불러오는 함수
async function loadFolderFiles() {
    try {
        const response = await fetch('folderFiles.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading folder files:', error);
        return {};
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const baseFolderPath = "https://app.yoons.com/mobile/beflwords/vocanote/";
    const folderSelect = document.getElementById("folderSelect");
    const audioPlayer = document.getElementById("audioPlayer");
    const currentTrackLabel = document.getElementById("currentTrack");
    const audioList = document.getElementById("audioList");
    const playlistContainer = document.querySelector(".playlist");

    let folderFiles = await loadFolderFiles();
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

    const changeFolder = () => {
        currentFolder = folderSelect.value;
        audioFiles = folderFiles[currentFolder] || [];
        currentIndex = 0;

        updatePlaylistView();
        playlistContainer.scrollTop = 0;

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

    const init = () => {
        initEventListeners();
        changeFolder();
    };

    init();
    console.log("[DEBUG] folderFiles", folderFiles);
});
