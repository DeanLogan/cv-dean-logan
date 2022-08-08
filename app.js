var visible = true;
var myTimer;
var myTimerTypeWriter;

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

function pageLoad(){
    checkTheme();
    var colourFound = false;
    var txt = document.getElementsByClassName('typewriter')[0].textContent;
    window.setInterval('cursor()',400);
    document.getElementsByClassName('typewriter')[0].innerHTML = '';
    myTimerTypeWriter = setTimeout(function(){
        typeWriter(txt, colourFound);
    },900);
    //helps make the animation look smoother if the images load in later on
    if ( document.URL.includes("about") ) {
        myTimer = setInterval('imageLoad()', 550);
    }
}

function imageLoad(){
    clearInterval(myTimer);
    document.getElementsByClassName('tech-used-container')[0].style.opacity = 1;
    document.getElementsByClassName('hover-imgs')[0].style.opacity = 1;
    document.getElementsByClassName('hover-imgs')[1].style.opacity = 1;
    
}

function checkTheme(){
    var theme = localStorage.getItem('theme');
    if(theme == 'light-mode'){
        let element = document.body;
        element.classList.toggle('light-mode');
    }
}

function typeWriter(txt, colourFound) {
    var i = 0;
    var timer = setInterval(function(){
        if(txt.charAt(i) == '?'){
            document.getElementsByClassName('typewriter')[0].innerHTML += '<span class="colour"></span>';
            if(!colourFound){
                colourFound = true;
            }
            else{
                colourFound = false;
            }
            console.log('colour found');
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

function cursor() {
    console.log('cursor');
    if (visible === true) {
        document.getElementById('cursorId').className = 'cursor-hidden';
        visible = false;
    } 
    else {
        document.getElementById('cursorId').className = 'cursor';
        visible = true;
    }
}


window.onload = pageLoad();
pageTransitions();
