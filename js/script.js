const circle = document.querySelector('.progress-ring__circle-line');
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;
let offset;
circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

function setProgress (percent) {
	offset = localStorage.getItem('percent') ? circumference - localStorage.getItem('percent') / 100 * circumference : circumference - percent / 100 * circumference;
	circle.style.strokeDashoffset = offset;
	localStorage.setItem('percent', percent);
}
;

// UP/DOWN Buttons settings
const settingsPage = document.querySelector('.page__settings');
const startBtn = document.querySelector(".start");
const pauseBtn = document.querySelector('.pause');
const restartBtn = document.querySelector('.restart');
const bell = document.querySelector('audio');
const timer = document.getElementById('timer');
const focusTimeInput = document.querySelector("#focusTime");
const shortBreakInput = document.querySelector("#shortBreak");
const longBreakInput = document.querySelector("#longBreak");
const submitForm = document.querySelector('form');
const buttonControl = document.querySelectorAll('.control__block');
const root = document.documentElement;
const fontItem = document.querySelectorAll('.fonts__item');
const fontBlock = document.querySelector('.setting__fonts')
const colorItem = document.querySelectorAll('.color__item');
const colorBlock = document.querySelector('.setting__color');
const colorIcons = document.querySelectorAll('.color-icon');
const circleBody = document.querySelector('.progress-ring__circle');
const mediaQuery = window.matchMedia('(max-width: 450px)')

let seconds, timeout, totalsecs, paused, perc;

const changeValueDown = (event) => {
    let $input = event.target.closest('.block-control__input').querySelector('.block-control__input-form');
    let val = parseInt($input.value);
    let min = parseInt($input.min);
    let step = parseInt($input.step);

    let temp = val - step;

    function ValueDown() {
        if (temp >= min) {
            $input.value = temp
        }   else {
            $input.value = min;
        }
    }
    ValueDown()
}

const changeValueUp = (event) => {
    let $input = event.target.closest('.block-control__input').querySelector('.block-control__input-form');
    let val = parseInt($input.value);
    let max = parseInt($input.max);
    let step = parseInt($input.step);

    let temp = val + step;

    function ValueUp() {
        if (temp <= max) {
            $input.value = temp
        }   else {
            $input.value = max;
        }
    }
    ValueUp()
}

const downButton = document.querySelectorAll('.down');
downButton.forEach(button => {
    button.addEventListener('click', changeValueDown);
})

const upButton = document.querySelectorAll('.up');
upButton.forEach(button => {
    button.addEventListener('click', changeValueUp);
})

// ===========================


// SUBMIT FORM 
    submitForm.addEventListener('submit', function(e) {
        e.preventDefault();
        localStorage.setItem('items', JSON.stringify(TIMER));
        saveInputVal()
        TIMER = makeUser(`${focusTimeInput.value}`, `${shortBreakInput.value}`, `${longBreakInput.value}`)
        innerClock()
        setTimer()
    });

//INPUT VALUE



//




document.addEventListener('click', timeSection);

function timeSection(event) {
    if(event.target.closest('.settings__close')) {
        settingsPage.classList.remove('_active');
    } if (event.target.closest('.timer__icon')) {
        settingsPage.classList.toggle('_active');
    } else if (event.target.closest('.settings__apply-btn')) {
        settingsPage.classList.remove('_active');
        //
    clickOnActive()
    changeClasses();
    document.title = 'Pomodoro timer'
    //
    saveSelectedFont();
    saveSelectedColor()
    saveSelectedTab()
    clearTimeout(timeout);
    localStorage.removeItem('percent')
    setProgress(0);
    getNewData();
    }
};


//======================

// CHANGE TEXT INNER 


//TIMER ===============

const modeButtons = document.querySelector('[class=control]');
modeButtons.addEventListener('click', changeMode);

function changeInputVal() {
if(localStorage.getItem('focusVal')){
    focusTimeInput.value = JSON.parse(localStorage.getItem('focusVal'));
    shortBreakInput.value = JSON.parse(localStorage.getItem('shortVal'));
    longBreakInput.value = JSON.parse(localStorage.getItem('longVal'));
}
}
changeInputVal()

var TIMER = JSON.parse(localStorage.getItem('items')) ? JSON.parse(localStorage.getItem('items')) : makeUser(`${focusTimeInput.value}`, `${shortBreakInput.value}`, `${longBreakInput.value}`)


function makeUser (POMODORO, SHORTBREAK, LONGBREAK) {
    return {
        POMODORO,
        SHORTBREAK,
        LONGBREAK,
    };
}

function changeMode(e) {
    changeButtonText()
    localStorage.removeItem('count_timer')
    changeClasses()
    clickOnActive()
    document.title = 'Pomodoro timer'
    clearTimeoutFunc()
    saveSelectedTab()
    let mode = e.target.dataset.mode;
    timer.dataset.mode = mode;
    setProgress(0);
    setTimer()
    innerClock();
}

function innerClock() {
    
    if (localStorage.getItem('count_timer')){
        timer.innerHTML = ('0' + Math.floor(localStorage.getItem('count_timer') / 60)).slice(-2) + ':' + ('0' + (localStorage.getItem('count_timer') % 60)).slice(-2);
    } else if (localStorage.getItem('modeTab')){
        if(JSON.parse(localStorage.getItem('modeTab')) === 'pomodoro'){
            if(TIMER.POMODORO < 10) {
                timer.innerHTML = `0${TIMER.POMODORO}:00`
            } else {
                timer.innerHTML = `${TIMER.POMODORO}:00`
            }
        } else if (JSON.parse(localStorage.getItem('modeTab')) === 'short') {
            timer.innerHTML = `0${TIMER.SHORTBREAK}:00`
        } else if(JSON.parse(localStorage.getItem('modeTab')) === 'long') {
            if(TIMER.LONGBREAK < 10) {
                timer.innerHTML = `0${TIMER.LONGBREAK}:00`
            } else {
                timer.innerHTML = `${TIMER.LONGBREAK}:00`
            }
        }
    } else {
    if(timer.dataset.mode === 'pomodoro') {
        if(TIMER.POMODORO < 10) {
            timer.innerHTML = `0${TIMER.POMODORO}:00`
        } else {
            timer.innerHTML = `${TIMER.POMODORO}:00`
        }
    } else if (timer.dataset.mode === 'short') {
            timer.innerHTML = `0${TIMER.SHORTBREAK}:00`
    } else {
        if(TIMER.LONGBREAK < 10) {
            timer.innerHTML = `0${TIMER.LONGBREAK}:00`
        } else {
            timer.innerHTML = `${TIMER.LONGBREAK}:00`
        }
    } 
}
}
    
    if(localStorage.getItem('timer-inner')){
        timer.innerHTML = localStorage.getItem('timer-inner');
    } else 
    {
        localStorage.setItem('timer-inner', timer.innerHTML)
        innerClock();
    }

   // CHANGE TABS
   let storedTab = localStorage.getItem('selectedTab') || '[]'
   let tabIndex = JSON.parse(storedTab)
   for(const index of tabIndex) {
       buttonControl[index].classList.add('_active');
   }
       buttonControl.forEach(function(item){
           item.addEventListener('click', function() {
               buttonControl.forEach(function(item) {
                   item.classList.remove('_active');
               })
               item.classList.add('_active');
               const tabIndex = []
           for (let i = 0; i < buttonControl.length; i++) {
               if(buttonControl[i].classList.contains('_active')){
                   tabIndex.push(i);
               }
           }
           })
       })
   //
//Change Font-Family 
let stored = localStorage.getItem('selected') || '[]'
let indexes = JSON.parse(stored)
for(const index of indexes) {
    fontItem[index].classList.add('_active');
}
    fontItem.forEach(function(item) {
        item.addEventListener('click', function() {
            fontItem.forEach(function(item) {
                item.classList.remove('_active');
            })
            item.classList.add('_active')
            const indexes = [];
            for(let i = 0; i < fontItem.length; i++){
            if(fontItem[i].classList.contains('_active')){indexes.push(i);}
        }
        })
    })

    //Change Font-Color

let storedColor = localStorage.getItem('selectedColor') || '[]'
let indexesColor = JSON.parse(storedColor)
for(const index of indexesColor) {
    colorIcons[index].classList.add('_icon-check-btn');
}

colorItem.forEach(function(item) {
    item.addEventListener('click', function() {
        colorIcons.forEach(element => {
            element.addEventListener('click', function() {
                colorIcons.forEach(function(item) {
                    item.classList.remove('_icon-check-btn')
                })
                element.classList.add('_icon-check-btn')
                const indexesColor = [];
                for(let i = 0; i < colorIcons.length; i++){
                if(colorIcons[i].classList.contains('_icon-check-btn')){indexesColor.push(i);}
            }
            })
        });
    })
});
    
    
    getNewData()

    function setTimer() {
        if(timer.dataset.mode === 'pomodoro') {
            count_timer = TIMER.POMODORO * 60;
            totalsecs = TIMER.POMODORO * 60;
        } else if (timer.dataset.mode === 'short') {
            count_timer = TIMER.SHORTBREAK * 60;
            totalsecs = TIMER.SHORTBREAK * 60;
        } else if (timer.dataset.mode === 'long') {
            count_timer = TIMER.LONGBREAK * 60;
            totalsecs = TIMER.LONGBREAK * 60;
        }
    }

    function chooseTime() {
        if(localStorage.getItem('count_timer')){
            count_timer = localStorage.getItem('count_timer');
            totalsecs = localStorage.getItem('totalsecs')
        } else {
            setTimer()
        }
    }
    chooseTime()

    function countDownTimer(){
        var timeRemaining = ('0' + Math.floor(count_timer / 60)).slice(-2) + ':' + ('0' + (count_timer % 60)).slice(-2);
        timer.innerHTML = timeRemaining;
        document.title = `${timeRemaining} - ${timer.dataset.mode === 'pomodoro' ? 'Work' : 'Break'}`;
        if(count_timer <= 0) {
            localStorage.clear('count_timer');
            bell.play();
            count_timer = 0;
            pauseBtn.classList.remove('_active');
            restartBtn.classList.add('_active');
        } else {
            count_timer = count_timer - 1;
            perc = Math.ceil(((totalsecs -  count_timer) / totalsecs) * 100);

            if(mediaQuery.matches){
            setProgress(perc * 0.77);
            } else {
            setProgress(perc);
            }
            
            timeRemaining = ('0' + Math.floor(count_timer / 60)).slice(-2) + ':' + ('0' + (count_timer % 60)).slice(-2);
            localStorage.setItem('count_timer', count_timer);
            localStorage.setItem('totalsecs', totalsecs);
            timeoutFunc()
        }
        if (startBtn.classList.contains('_active')) {
            startBtn.classList.remove('_active');
            pauseBtn.classList.add("_active");
        }
    }
    
    function timeoutFunc() {
        timeout = setTimeout(countDownTimer, 1000);
        paused = false;
        
    }

    function clearTimeoutFunc() {
        clearTimeout(timeout);
    }


function clickOnActive() {
    for(i=0; i<buttonControl.length;i++){
        if(buttonControl[i].classList.contains('_active')){
            buttonControl[i].click();
        }
    }
}

function changeClasses() {
    if(!startBtn.classList.contains('_active')) {
        const allButtons = document.querySelectorAll('.button');
        for (const allbutton of allButtons) {
            allbutton.classList.remove('_active');
        }
        startBtn.classList.add('_active');
    }
}

function pomodoroPause() {
    if (paused === undefined) {
       return;
    } 
    if (paused) {
        paused = false;
        timeoutFunc()
        pauseBtn.textContent = 'PAUSE'
    }   else {
        clearTimeoutFunc();
        pauseBtn.textContent = 'start';
        paused = true;
    }
}

function pomodoroRestart() {
    paused = false;
    clearTimeoutFunc();
    setProgress(0);
    localStorage.clear()
    clickOnActive()
    if (restartBtn.classList.contains('_active')) {
        restartBtn.classList.remove('_active');
        startBtn.classList.add("_active");
    }
}

startBtn.addEventListener('click', () => {
    timeoutFunc()
});

pauseBtn.addEventListener('click', () => {
    pomodoroPause();
});
restartBtn.addEventListener('click', () => {
    pomodoroRestart();
});
 
    function saveSelectedTab() {
        const tabIndex = []
        for (let i = 0; i < buttonControl.length; i++) {
            if(buttonControl[i].classList.contains('_active')){
                tabIndex.push(i);
               var modeTab = buttonControl[i].dataset.mode ;
            }
        }
        localStorage.setItem('selectedTab', JSON.stringify(tabIndex));
        localStorage.setItem('modeTab', JSON.stringify(modeTab))
    }

    function saveInputVal() {
        localStorage.setItem('focusVal', focusTimeInput.value)
        localStorage.setItem('shortVal', shortBreakInput.value)
        localStorage.setItem('longVal', longBreakInput.value)
        }
    
    function saveSelectedFont() {
        const indexes = [];
        for(let i = 0; i < fontItem.length; i++){
          if(fontItem[i].classList.contains('_active')){
            indexes.push(i);
          }
        }
        localStorage.setItem('selected', JSON.stringify(indexes));
      }

    fontBlock.addEventListener('click', function (event) {
        if (event.target.closest('[data-family=KumbhSans]')){

            localStorage.setItem('fontFamily', JSON.stringify('KumbhSans'))
        } else if (event.target.closest('[data-family=RobotoSlab]')){ 
        localStorage.setItem('fontFamily', JSON.stringify('RobotoSlab'))
        } else if (event.target.closest('[data-family=SpaceMono]')){
            localStorage.setItem('fontFamily', JSON.stringify('SpaceMono'))
        }
    });

function saveSelectedColor() {
    const indexesColor = [];
    for(let i = 0; i < colorIcons.length; i++){
      if(colorIcons[i].classList.contains('_icon-check-btn')){
        indexesColor.push(i);
      }
    }
    localStorage.setItem('selectedColor', JSON.stringify(indexesColor));
  }


colorBlock.addEventListener('click', function (event) {
    if (event.target.closest('[data-color=pink]')){
        localStorage.setItem('fontColor', JSON.stringify('#F87070'))
    } else if (event.target.closest('[data-color=blue]')){ 
    localStorage.setItem('fontColor', JSON.stringify('#70F3F8'))
    } else if (event.target.closest('[data-color=purple]')){
        localStorage.setItem('fontColor', JSON.stringify('#D881F8'))
    }
})

function getNewData() {
    //SAVE INPUT VAL 
    saveInputVal() 
    //SAVE FONT-COLOR IN LOCALSTORAGE
    if (localStorage.getItem('fontColor') === null) 
    {localStorage.setItem('fontColor', JSON.stringify('#F87070'))} else 
    {const dataColor = JSON.parse(localStorage.getItem('fontColor'));
    root.style.setProperty('--mainColor', `${dataColor}`)}

    //SAVE FONT-FAMILY IN LOCALSTORAGE
    if (localStorage.getItem('fontFamily') === null){
        localStorage.setItem('fontFamily', JSON.stringify('KumbhSans'))
    } else {
        const dataFont = JSON.parse(localStorage.getItem('fontFamily'));
        document.body.style.fontFamily = dataFont;
    }
    //SAVE FONTS
    if (localStorage.getItem('selectedTab') === null) {
        buttonControl[0].click();
    };
    if (localStorage.getItem('selected') === null) {
        fontItem[0].click();
    };
    if (localStorage.getItem('selectedColor') === null) {
        colorItem[0].click();
        colorIcons[0].click();
    };
    JSON.parse(localStorage.getItem('items'));
}


function handleTabletChange() {
	if (mediaQuery.matches) {
	  	circleBody.setAttribute('r', '130');
		circleBody.setAttribute('cx', '145');
		circleBody.setAttribute('cy', '145');

		setProgress(perc * 0.77);

		circle.setAttribute('r', '115');
		circle.setAttribute('cx', '145');
		circle.setAttribute('cy', '145');
	} else {
        circleBody.setAttribute('r', '170');
		circleBody.setAttribute('cx', '190');
		circleBody.setAttribute('cy', '190');
		
		setProgress(perc);

		circle.setAttribute('r', '150');
		circle.setAttribute('cx', '190');
		circle.setAttribute('cy', '190');
    }
  }
  window.addEventListener('resize', handleTabletChange, true);
  handleTabletChange()

  function changeButtonText(){
    if(count_timer < setTimer) {
        timeoutFunc()
        startBtn.textContent = 'PAUSE'
    } else 
    {
        clickOnActive()
        startBtn.textContent = 'START'
    }}
    changeButtonText()

  if (count_timer === setTimer) {
    clickOnActive();
    }