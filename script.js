// TOTAL SLIDES
const numSlides = 16;

// Slides that should load YouTube if image missing
// MAKE SURE LINKS ARE EMBED LINKS (with /embed/)
const videoSlides = {
    4: "https://www.youtube.com/embed/QmRFtM08F4A?si=NtoyItrf5N2qbmKs"
};

// YOUTUBE PLAYER STORAGE
let ytPlayers = {};


// CREATE SLIDES
function createImageElements() {
    const container = document.getElementById("slidesContainer");

    for (let i = 1; i <= numSlides; i++) {
        const wrapper = document.createElement("div");
        wrapper.classList.add("slide");

        const img = document.createElement("img");
        img.src = `${i}.png`;
        img.alt = `Slide ${i}`;

        // If image missing → replace with YouTube iframe
        img.onerror = () => {
            if (videoSlides[i]) {
                const iframeId = "player_" + i;

                wrapper.innerHTML = `
                    <iframe class="yt-video"
                        data-player-id="${iframeId}"
                        src="${videoSlides[i]}?enablejsapi=1"
                        frameborder="0"
                        allow="autoplay; encrypted-media"
                        allowfullscreen>
                    </iframe>
                `;

                // Convert the new iframe into a YouTube player
                setTimeout(() => {
                    const iframe = wrapper.querySelector("iframe");
                    convertIframeToPlayer(iframe);
                }, 50);
            }
        };

        wrapper.appendChild(img);
        container.appendChild(wrapper);
    }
}


// Convert iframe → YouTube Player (NO AUTOPLAY)
function convertIframeToPlayer(iframe) {
    if (!iframe) return;

    const pid = iframe.dataset.playerId;

    ytPlayers[pid] = new YT.Player(iframe, {
        events: {
            'onReady': () => {
                // AUTOPLAY REMOVED → user must click play
            },
            'onStateChange': onPlayerStateChange
        }
    });
}


// Called by YouTube API when ready
function onYouTubeIframeAPIReady() {
    // Convert any iframes already present in the DOM
    const iframes = document.querySelectorAll(".yt-video");

    iframes.forEach((iframe, index) => {
        // Assign ID if missing
        if (!iframe.dataset.playerId) {
            iframe.dataset.playerId = "initial_" + index;
        }
        convertIframeToPlayer(iframe);
    });
}


// Detect when video ends → go to next slide
function onPlayerStateChange(event) {
    if (event.data === 0) {   // 0 = finished
        plusSlides(1);
    }
}


// Return player by iframe element
function getPlayerByIframe(iframe) {
    return Object.values(ytPlayers).find(p => p.getIframe() === iframe);
}


// Stop video when navigating to another slide
function stopCurrentVideo() {
    const slides = document.querySelectorAll("#slidesContainer .slide");
    const current = slides[slideIndex];
    const iframe = current.querySelector("iframe");

    if (iframe) {
        const player = getPlayerByIframe(iframe);
        if (player && typeof player.stopVideo === "function") {
            player.stopVideo();
        }
    }
}


// SLIDESHOW NAVIGATION
let slideIndex = 0;

function plusSlides(n) {
    stopCurrentVideo();
    showSlides(slideIndex += n);
}

function showSlides(n) {
    const slides = document.querySelectorAll("#slidesContainer .slide");

    if (n >= slides.length) slideIndex = 0;
    else if (n < 0) slideIndex = slides.length - 1;
    else slideIndex = n;

    slides.forEach(s => {
        s.style.display = "none";
        const img = s.querySelector("img");
        if (img) img.style.display = "none";
    });

    const current = slides[slideIndex];
    current.style.display = "block";

    const img = current.querySelector("img");
    if (img) img.style.display = "block";

    // No autoplay for video → removed player.playVideo()
    // User must click play
}


// INIT
document.addEventListener("DOMContentLoaded", () => {
    createImageElements();
    setTimeout(() => showSlides(slideIndex), 500);
});
