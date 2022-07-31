function pageTransitions(){
   const homeBtn = document.querySelector('.home-btn');
   const aboutBtn = document.querySelector('.about-btn');
   const educationBtn = document.querySelector('.education-btn');
   const experiencesBtn = document.querySelector('.experiences-btn');
   const portfolioBtn = document.querySelector('.portfolio-btn');
   var myTimer;

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


window.onload = pageLoad();
pageTransitions();
