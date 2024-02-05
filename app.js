var visible = true;
var myTimer;
var myTimerTypeWriter;

//turns the divs into links to the other pages on the website
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

//runs when the page is loaded
function pageLoad(){
    checkTheme();
    hoverEffectForControls();
    var colourFound = false;
    var txt = document.getElementsByClassName('typewriter')[0].textContent; //gets the text inside the HTML for the typewriter effect
    window.setInterval('cursor()',400); //used to make the underscore cursor blink
    document.getElementsByClassName('typewriter')[0].innerHTML = '';
    myTimerTypeWriter = setTimeout(function(){
        typeWriter(txt, colourFound);
    },900); //waits for the transition to happen before starting the typewriter effect

    //helps make the animation look smoother if the certs and online courses for the about page load in after the transition animation
    if ( document.URL.includes("about") ) {
        myTimer = setInterval('imageLoad()', 550);
        getGithubStats();
    }
    if ( document.title == "Home" ) {
        showSlides();
    }
}

async function getGithubStats() {
    try {
        fetch('/.netlify/functions/github-stats')
        .then(response => response.json())
        .then(data => {
            document.getElementById('githubYearStat').innerText = data.lastYearContributions;
            document.getElementById('githubMonthStat').innerText = data.lastMonthContributions;
        })
        .catch(error => console.error('Error:', error));
    } 
    catch {
        console.log("netlify functin is down")
    }
}

//makes the certs and online courses appear once the page has loaded in
function imageLoad(){
    clearInterval(myTimer);
    document.getElementsByClassName('tech-used-container')[0].style.opacity = 1;

    for(i=0;i<document.getElementsByClassName('hover-imgs').length;i++){
        document.getElementsByClassName('hover-imgs')[i].style.opacity = 1;
    }
}

//checks what theme is in the local storage and updates the webpage accordingly 
function checkTheme(){
    var theme = localStorage.getItem('theme');
    if(theme == 'light-mode'){
        let element = document.body;
        element.classList.toggle('light-mode');
    }
}

//this is responsible for the typewriter effect for the titles of each page
function typeWriter(txt, colourFound) {
    var i = 0;
    var timer = setInterval(function(){
        //uses the character ? to find where the colour should be swaped in the title (from primary to secondary colour and vise-versa)
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
    }, 120);
}

//makes the curosr blink
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
//showSlides();

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
    // Get all the child elements of the 'controls' div
    var controls = document.querySelector('.controls').children;

    for (var i = 0; i < controls.length; i++) {
        // Add a 'mouseenter' event listener to each child element
        controls[i].addEventListener('mouseenter', function() {
            var currentClass = this.className.split(' ')[1];
            var associatedDiv = document.querySelector('.' + currentClass + '-div'); // Get the div associated with the current child element
            
            // Hide all other divs
            var allDivs = document.querySelectorAll('.hover-effect');
            for (var j = 0; j < allDivs.length; j++) {
                allDivs[j].style.opacity = '0';
            }
            
            // Display the associated div
            if (associatedDiv) {
                associatedDiv.style.animation = "makeAppear 0.5s forwards";
                placeHoverDivsBesideControls();
            }
        });

        // Add a 'mouseleave' event listener to each child element
        controls[i].addEventListener('mouseleave', function() {
            var currentClass = this.className.split(' ')[1];
            var associatedDiv = document.querySelector('.' + currentClass + '-div'); // Get the div associated with the current child element
            
            // Hide the associated div
            if (associatedDiv) {
                //associatedDiv.style.opacity = '0';
                associatedDiv.style.animation = "makeDisappear 0.5s forwards";
            }
        });
    }
}

window.onload = pageLoad();
pageTransitions();
