// Shared Audio Player for all pages
const PLAYLIST = ['01..mp3', '02.mp3', '03.mp3', '04.mp3', '05+.mp3', '06.mp3', '07.mp3', '08.mp3', '09.mp3'];

let isPlaying = false;
let rotateTimer = null;
let currentSongIndex = 0;
let audioPlayer;
let playPauseBtn;
let volumeControl;

// Initialize audio player
function initAudioPlayer() {
    // Create audio element if it doesn't exist
    audioPlayer = document.getElementById('audio-player');
    if (!audioPlayer) {
        audioPlayer = document.createElement('audio');
        audioPlayer.id = 'audio-player';
        audioPlayer.style.display = 'none';
        document.body.appendChild(audioPlayer);
    }

    // Create audio controls if they don't exist
    let audioControls = document.getElementById('audio-controls');
    if (!audioControls) {
        audioControls = document.createElement('div');
        audioControls.id = 'audio-controls';
        audioControls.className = 'audio-controls';
        audioControls.innerHTML = `
            <button id="play-pause"><i class="play-icon">▶️</i></button>
            <input type="range" id="volume" min="0" max="1" step="0.1" value="0.5">
        `;
        document.body.appendChild(audioControls);

        // Add styles for audio controls
        addAudioControlsStyles();
    }

    playPauseBtn = document.getElementById('play-pause');
    volumeControl = document.getElementById('volume');

    // Set initial volume
    audioPlayer.volume = volumeControl.value;

    // Start playing first random song
    playNextRandomSong();

    // Event listeners
    playPauseBtn.addEventListener('click', togglePlayPause);
    volumeControl.addEventListener('input', changeVolume);
    audioPlayer.addEventListener('ended', playNextRandomSong);

    console.log('Audio player initialized on:', window.location.pathname);
}

// Get random song that's different from current one
function getRandomSong() {
    let randomIndex = Math.floor(Math.random() * PLAYLIST.length);
    while (PLAYLIST.length > 1 && randomIndex === currentSongIndex) {
        randomIndex = Math.floor(Math.random() * PLAYLIST.length);
    }
    currentSongIndex = randomIndex;
    return PLAYLIST[randomIndex];
}

// Play next random song with 18 second timing
function playNextRandomSong() {
    if (!audioPlayer) return;
    
    const nextSong = getRandomSong();
    audioPlayer.src = nextSong;
    audioPlayer.play().catch(err => console.log('Auto-play blocked:', err));
    isPlaying = true;
    if (playPauseBtn) playPauseBtn.innerHTML = '<i class="play-icon">⏸️</i>';
    
    // Schedule next song change after 18 seconds
    if (rotateTimer) clearTimeout(rotateTimer);
    rotateTimer = setTimeout(playNextRandomSong, 18000);
}

// Toggle play/pause
function togglePlayPause(e) {
    e.stopPropagation();
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

// Play song
function playSong() {
    if (!audioPlayer) return;
    audioPlayer.play().catch(err => console.log('Auto-play blocked:', err));
    isPlaying = true;
    if (playPauseBtn) playPauseBtn.innerHTML = '<i class="play-icon">⏸️</i>';
}

// Pause song
function pauseSong() {
    if (!audioPlayer) return;
    audioPlayer.pause();
    isPlaying = false;
    if (playPauseBtn) playPauseBtn.innerHTML = '<i class="play-icon">▶️</i>';
}

// Change volume
function changeVolume(e) {
    e.stopPropagation();
    if (audioPlayer) audioPlayer.volume = volumeControl.value;
}

// Add audio controls styles dynamically
function addAudioControlsStyles() {
    // Check if styles already exist
    if (document.getElementById('audio-controls-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'audio-controls-styles';
    style.textContent = `
        .audio-controls {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: rgba(255, 255, 255, 0.7);
            padding: 10px 15px;
            border-radius: 50px;
            display: flex;
            align-items: center;
            z-index: 100;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            gap: 10px;
        }

        .audio-controls button {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #FF1493;
            transition: all 0.3s ease;
            padding: 0;
        }

        .audio-controls button:hover {
            transform: scale(1.2);
            color: #8A2BE2;
        }

        .audio-controls input {
            width: 100px;
            cursor: pointer;
        }

        @media (max-width: 768px) {
            .audio-controls {
                bottom: 10px;
                right: 10px;
                padding: 8px 12px;
            }
            
            .audio-controls input {
                width: 80px;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAudioPlayer);
} else {
    // DOM is already loaded
    initAudioPlayer();
}

// Also initialize on window load to be safe
window.addEventListener('load', () => {
    // Reinitialize in case it wasn't done yet
    if (!audioPlayer) {
        initAudioPlayer();
    }
});

