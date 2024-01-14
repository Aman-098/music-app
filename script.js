let songs;
function secondsToMMSS(seconds) {
    if (isNaN(seconds) || seconds < 0) {
      return "00/00";
    }
  
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
  
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
  
    return `${formattedMinutes}:${formattedSeconds}`;
}

let currentSong=new Audio;

async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();

    // console.log(response);

    // Use DOMParser to create a virtual DOM
    let parser = new DOMParser();
    let doc = parser.parseFromString(response, "text/html");

    let as = doc.getElementsByTagName("a");

    let songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }

    return songs;
}

const playMusic=(track, pause=false)=>{
    // let audio = new Audio("/songs/" + track)
    currentSong.src="/songs/" + track

    if(!pause){
        currentSong.play();
        play.src="pause.svg";

    }
    document.querySelector(".songinfo").innerHTML= track
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"
}

async function main() {

    
    //get the list of all songs
    songs = await getSongs();
    playMusic(songs[0], true)

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>

                                                <img class="invert" src="music.svg" alt="" srcset="">
                                                <div class="info">
                                                    <div>${song.replaceAll("%20", " ")}</div>
                                                    <div>Aman</div>
                                                </div>
                                                <div class="playnow">
                                                    <span>Play Now</span>
                                                    <img class="invert" src="play.svg" alt="" srcset="">

                                                </div>
                                            </li>`;
    }

    // attach an eventlistener to each song 

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {

        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })

    //attach an event listener to play,next and previous

    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src="pause.svg"
            
        }

        else{
            currentSong.pause()
            play.src="play.svg"
        }
    })


    //listen for time update

    currentSong.addEventListener("timeupdate",()=>{
        console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songtime").innerHTML=`${secondsToMMSS(currentSong.currentTime)}/${secondsToMMSS(currentSong.duration)}`
        document.querySelector('.circle').style.left=(currentSong.currentTime/currentSong.duration)*100 + "%";

    })

    //add an event listenr to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100; 
    document.querySelector(".circle").style.left= percent + "%"
    currentSong.currentTime= ((currentSong.duration)* percent ) / 100


    })


    //Add an eventlistenr for hamburger

    document.getElementById("hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })


    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%"
    })

    // add an event listener to previous and next

    previous.addEventListener("click",()=>{
        console.log("previous clicked")
        let index=songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        
        console.log(songs, index)
        if((index-1)>= 0 ){
            playMusic(songs[index-1])

        }
    })

    
    next.addEventListener("click",()=>{
        console.log("next ;icked")
        currentSong.pause()

        let index=songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        
        console.log(songs, index)
        if((index+1) < songs.length){
            playMusic(songs[index+1])

        }
        
    })
}

main();
