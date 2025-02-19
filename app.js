var visible = true;
var imageTimer;
var typeWriterTimer;

// turns the divs into links to the other pages on the website
function pageTransitions(){
    const homeBtn = document.querySelector('.home-btn');
    const aboutBtn = document.querySelector('.about-btn');
    const educationBtn = document.querySelector('.education-btn');
    const experiencesBtn = document.querySelector('.experiences-btn');
    const portfolioBtn = document.querySelector('.portfolio-btn');

    homeBtn.addEventListener('click', () =>{
        window.open('index.html', '_self');
    });

    aboutBtn.addEventListener('click', () =>{
        window.open('about.html', '_self');
    });

    educationBtn.addEventListener('click', () =>{
        window.open('education.html', '_self');
    });

    experiencesBtn.addEventListener('click', () =>{
        window.open('experiences.html', '_self');
    });

    portfolioBtn.addEventListener('click', () =>{
        window.open('portfolio.html', '_self');
    });

    //toggle theme
    const themeBtn = document.querySelector('.theme-btn');
    themeBtn.addEventListener('click', () =>{
        var theme = localStorage.getItem('theme');
        let element = document.body;
        element.classList.toggle('light-mode');
        if(theme == 'dark-mode'){
            localStorage.setItem('theme','light-mode');
        }
        else{
            localStorage.setItem('theme','dark-mode');
        }
    });
}

// runs when the page is loaded
function pageLoad(){
    checkTheme();
    var colourFound = false;
    var txt = document.getElementsByClassName('typewriter')[0].textContent; // gets the text inside the HTML for the typewriter effect
    window.setInterval('cursor()',400); // used to make the underscore cursor blink
    document.getElementsByClassName('typewriter')[0].innerHTML = '';
    typeWriterTimer = setTimeout(function(){
        typeWriter(txt, colourFound);
    },900); // waits for the transition to happen before starting the typewriter effect

    // helps make the animation look smoother if the certs and online courses for the about page load in after the transition animation
    if ( document.URL.includes("about") ) {
        getGithubStats();
        imageTimer = setInterval('imageLoad()', 550);
    }
    if ( document.title == "Home" ) {
        showSlides();
    }
    hoverEffectForControls();
}

// send request to netlify lambda function to retreive stats from github for my account (DeanLogan) 
// See netlify/functions/github-stats.js for the code used in the lambda function.
async function getGithubStats() {
    try {
        fetch('/.netlify/functions/github-stats')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.lastYearContributions != "undefined" && data.lastMonthContributions != "undefined") {
                document.getElementById('githubYearStat').innerText = data.lastYearContributions;
                document.getElementById('githubMonthStat').innerText = data.lastMonthContributions;
            }
        })
        .catch(error => console.error('Error:', error));
    } 
    catch {
        console.log("netlify function is down")
    }
}

// makes the certs and online courses appear once the page has loaded in
function imageLoad(){
    clearInterval(imageTimer);

    for(i=0;i<document.getElementsByClassName('hover-imgs').length;i++){
        document.getElementsByClassName('hover-imgs')[i].style.opacity = 1;
    }
    document.getElementsByClassName('tech-used-container')[0].height = 'auto';
}

// checks what theme is in the local storage and updates the webpage accordingly 
function checkTheme(){
    var theme = localStorage.getItem('theme');
    if(theme == 'light-mode'){
        let element = document.body;
        element.classList.toggle('light-mode');
    }
}

// this is responsible for the typewriter effect for the titles of each page
function typeWriter(txt, colourFound) {
    var i = 0;
    var timer = setInterval(function(){
        // uses the character ? to find where the colour should be swaped in the title (from primary to secondary colour and vise-versa)
        if(txt.charAt(i) == '?'){
            document.getElementsByClassName('typewriter')[0].innerHTML += '<span class="colour"></span>';
            if(!colourFound){
                colourFound = true;
            }
            else{
                colourFound = false;
            }
        }
        else{
            if(!colourFound){
                document.getElementsByClassName('typewriter')[0].innerHTML += txt.charAt(i);
            }
            else{
                document.getElementsByClassName('colour')[0].innerHTML += txt.charAt(i);
            }
        }
        i++;
        if(i > txt.length){
            clearInterval(timer);
        }
    }, 80);
}

// makes the curosr blink
function cursor() {
    if (visible === true) {
        document.getElementById('cursorId').className = 'hidden';
        visible = false;
    } 
    else {
        document.getElementById('cursorId').className = 'cursor';
        visible = true;
    }
}

// slideshow for the index/home page
let slideIndex = 0;

// showSlides();
function showSlides() {
    let i;
    const slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlides, 6000); // Change image every 2 seconds (adjust as needed)
}

function placeHoverDivsBesideControls(){
    var controls = document.querySelector('.controls').getBoundingClientRect();
    document.querySelector('.controls-hover').style.left = (controls.left-125) + 'px';
}

function hoverEffectForControls(){
    placeHoverDivsBesideControls();
    // Get all the child elements of the 'controls' div
    var controls = document.querySelector('.controls').children;

    for (var i = 0; i < controls.length; i++) {
        // Add a 'mouseover' event listener to each child element
        controls[i].addEventListener('mouseover', function() {
            var currentClass = this.className.split(' ')[1];
            var associatedDiv = document.querySelector('.' + currentClass + '-div'); // Get the div associated with the current child element
            
            // Hide all other divs
            var allDivs = document.querySelectorAll('.hover-effect');
            for (var j = 0; j < allDivs.length; j++) {
                allDivs[j].style.opacity = '0';
                allDivs[j].style.zIndex = '2';
            }
            
            // Display the associated div
            if (associatedDiv) {
                associatedDiv.style.animation = "makeAppear 0.5s forwards";
                // Store the interval ID
                this.intervalId = setInterval(placeHoverDivsBesideControls, 50);
            }
            document.querySelector('.controls-hover').style.zIndex = '10'
        });
        
        // Add a 'mouseout' event listener to each child element
        controls[i].addEventListener('mouseout', function() {
            document.querySelector('.controls-hover').style.zIndex = '-10'
            var currentClass = this.className.split(' ')[1];
            var associatedDiv = document.querySelector('.' + currentClass + '-div'); // Get the div associated with the current child element
            
            // Hide the associated div
            if (associatedDiv) {
                associatedDiv.style.animation = "makeDisappear 0.5s forwards";
            }
            
            // Clear the interval
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        });
    }
}

window.onload = pageLoad();
pageTransitions();
