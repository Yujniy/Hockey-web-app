let team1Name = '';
let team2Name = '';
let wakeLock = null;
let gameTimer;
let gameTime;
let periodTime;
let breakTime;
let isPaused = false;

const team1ScoreElement = document.getElementById('team1Score');
const team2ScoreElement = document.getElementById('team2Score');
const team1PlusButton = document.querySelector('.team-name-container:nth-child(1) .square');
const team2PlusButton = document.querySelector('.team-name-container:nth-child(3) .square');
const periodCountSlider = document.getElementById('periodCountSlider');
const periodCountValue = document.getElementById('periodCountValue');
const periodStartAudio = new Audio('hockey-organ-charge_gkvzp3eo.mp3');
const periodEndAudio = new Audio('whistle-blow-referee_mjw3v34u.mp3');


team1ScoreElement.addEventListener('click', toggleTeam1ScoreButton);
team2ScoreElement.addEventListener('click', toggleTeam2ScoreButton);


function toggleTeam1ScoreButton() {
  const icon = team1PlusButton.querySelector('i');

  if (icon.classList.contains('fi-rr-plus-small')) {
    icon.classList.remove('fi-rr-plus-small');
    icon.classList.add('fi-rr-minus-small');
    team1PlusButton.removeEventListener('click', incrementTeam1Score);
    team1PlusButton.addEventListener('click', decrementTeam1Score);
  } else {
    icon.classList.remove('fi-rr-minus-small');
    icon.classList.add('fi-rr-plus-small');
    team1PlusButton.removeEventListener('click', decrementTeam1Score);
    team1PlusButton.addEventListener('click', incrementTeam1Score);
  }
}

function toggleTeam2ScoreButton() {
  const icon = team2PlusButton.querySelector('i');

  if (icon.classList.contains('fi-rr-plus-small')) {
    icon.classList.remove('fi-rr-plus-small');
    icon.classList.add('fi-rr-minus-small');
    team2PlusButton.removeEventListener('click', incrementTeam2Score);
    team2PlusButton.addEventListener('click', decrementTeam2Score);
  } else {
    icon.classList.remove('fi-rr-minus-small');
    icon.classList.add('fi-rr-plus-small');
    team2PlusButton.removeEventListener('click', decrementTeam2Score);
    team2PlusButton.addEventListener('click', incrementTeam2Score);
  }
}


function decrementTeam1Score() {
  if (team1Score > 0) {
    team1Score--;
    updateScore();
  }
}

function decrementTeam2Score() {
  if (team2Score > 0) {
    team2Score--;
    updateScore();
  }
}


periodCountSlider.addEventListener('input', function() {
  periodCountValue.textContent = this.value;
});

let totalPeriods = 3; // Переменная для хранения выбранного количества периодов


let team1Score = 0;
let team2Score = 0;
let team1Color;
let team2Color;



const startMatchButton = document.querySelector('.button');
const newContent = document.getElementById('newContent');
const nextButton = document.getElementById('nextButton');
const timeContent = document.getElementById('timeContent');
const startTimerButton = document.getElementById('startButton');
const appContent = document.getElementById('appContent');
const gameTimeElement = document.getElementById('gameTime');
const periodTextElement = document.querySelector('.period-text');
const stopButton = document.getElementById('stopButton');

gameTimeElement.addEventListener('dblclick', endGame);


async function requestWakeLock() {
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    console.log('Wake Lock is active');
  } catch (err) {
    console.error(`${err.name}, ${err.message}`);
  }
}

async function releaseWakeLock() {
  if (wakeLock !== null && wakeLock.released) {
    await wakeLock.release();
    wakeLock = null;
    console.log('Wake Lock is released');
  }
}

document.addEventListener('visibilitychange', async () => {
  if (wakeLock !== null && document.visibilityState === 'visible') {
    await requestWakeLock();
  } else if (wakeLock !== null && document.visibilityState === 'hidden') {
    await releaseWakeLock();
  }
});

requestWakeLock();

function setThemeParams(theme) {
  document.documentElement.style.setProperty('--text-color', theme.text_color || '#ffffff');
  document.documentElement.style.setProperty('--button-color', theme.button_color || '#007bff');
  document.documentElement.style.setProperty('--button-text-color', theme.button_text_color || '#ffffff');
}

if (window.Telegram && Telegram.WebApp) {
  Telegram.WebApp.onEvent('themeChanged', setThemeParams);
  setThemeParams(Telegram.WebApp.themeParams);
} else {
  setThemeParams({});
}

startMatchButton.addEventListener('click', function() {
  const elements = document.querySelectorAll('h1, .sticker, .button');
  elements.forEach(function(element) {
    element.classList.add('animate__animated', 'animate__fadeOut');

    element.addEventListener('animationend', function() {
      element.style.display = 'none';

      if (Array.from(elements).every(el => el.style.display === 'none')) {
        showNewContent();
      }
    });
  });
});

function showNewContent() {
  const newContent = document.getElementById('newContent');
  newContent.style.display = 'flex';

  const newElements = newContent.querySelectorAll('.animate__animated');
  newElements.forEach(element => {
    element.classList.add('animate__fadeIn');
  });
}

const teamNameInputs = document.querySelectorAll('.team-name');
teamNameInputs.forEach(input => {
  const characterCount = input.nextElementSibling;
  input.addEventListener('input', function() {
    const remainingCharacters = 20 - this.value.length;
    characterCount.textContent = remainingCharacters;
    checkInputs();
  });
});

function checkInputs() {
  const nextButton = document.getElementById('nextButton');
  const allInputsFilled = Array.from(teamNameInputs).every(input => input.value.trim() !== '');
  
  if (allInputsFilled) {
    nextButton.style.display = 'block';
    nextButton.classList.add('animate__animated', 'animate__fadeIn');
  } else {
    nextButton.style.display = 'none';
    nextButton.classList.remove('animate__animated', 'animate__fadeIn');
  }
}

function pauseTimer() {
  clearInterval(gameTimer);
  isPaused = true;
}

function resumeTimer() {
  if (isPaused) {
    startTimer();
    isPaused = false;
  }
}

function endGame() {
  clearInterval(gameTimer);
  
  if (team1Score === team2Score) {
    showDrawScreen();
  } else {
    const winnerTeam = team1Score > team2Score ? 1 : 2;
    showWinnerScreen(winnerTeam);
  }
}

function showDrawScreen() {
  const appContent = document.getElementById('appContent');
  const appElements = appContent.querySelectorAll('.animate__animated');
  
  appElements.forEach(element => {
    element.classList.remove('animate__fadeIn');
    element.classList.add('animate__fadeOut');
    
    element.addEventListener('animationend', function() {
      appContent.innerHTML = '';
      appContent.style.display = 'flex';
      appContent.style.flexDirection = 'column';
      appContent.style.justifyContent = 'center';
      appContent.style.alignItems = 'center';
      
      appContent.style.backgroundColor = 'gray';
      appContent.classList.add('draw-screen');
      
      const drawText = document.createElement('h2');
      drawText.textContent = `Ничья команд ${team1Name} и ${team2Name}!`;
      drawText.classList.add('draw-text');
      
      const scoreText = document.createElement('p');
      scoreText.textContent = `${team1Name}: ${team1Score} X ${team2Score} :${team2Name}`;
      scoreText.classList.add('score-text');
      
      const exitButton = document.createElement('button');
      exitButton.textContent = 'Выйти';
      exitButton.classList.add('exit-button');
      exitButton.addEventListener('click', resetGame);
      
      appContent.appendChild(drawText);
      appContent.appendChild(scoreText);
      appContent.appendChild(exitButton);
    });
  });
}


nextButton.addEventListener('click', function() {
  team1Name = teamNameInputs[0].value.trim();
  team2Name = teamNameInputs[1].value.trim();
  
  const newContent = document.getElementById('newContent');
  const newElements = newContent.querySelectorAll('.animate__animated');
  
  let animationCount = 0;
  
  newElements.forEach(element => {
    element.classList.remove('animate__fadeIn');
    element.classList.add('animate__fadeOut');
    
    element.addEventListener('animationend', function() {
      animationCount++;
      
      if (animationCount === newElements.length) {
        newContent.style.display = 'none';
        
        // Показываем экран с выбором времени периода и перерыва
        const timeContent = document.getElementById('timeContent');
        timeContent.style.display = 'flex';
        
        const timeElements = timeContent.querySelectorAll('.animate__animated');
        timeElements.forEach(element => {
          element.classList.add('animate__fadeIn');
        });
      }
    });
  });
});

stopButton.addEventListener('click', () => {
  if (isPaused) {
    resumeTimer();
    stopButton.textContent = 'Остановить матч';
  } else {
    pauseTimer();
    stopButton.textContent = 'Возобновить матч';
  }
});


const periodSlider = document.getElementById('periodSlider');
const periodValue = document.getElementById('periodValue');
const breakSlider = document.getElementById('breakSlider');
const breakValue = document.getElementById('breakValue');

periodSlider.addEventListener('input', function() {
  periodValue.textContent = this.value;
});

breakSlider.addEventListener('input', function() {
  breakValue.textContent = this.value;
});

let currentPeriod = 1;
let isBreak = false;
let isOvertime = false;

function startTimer() {
  if (!isBreak) {
    periodStartAudio.play();
  }
  gameTimer = setInterval(updateTimer, 1000);
}


function showWinnerScreen(winnerTeam) {
  const appContent = document.getElementById('appContent');
  const appElements = appContent.querySelectorAll('.animate__animated');
  
  appElements.forEach(element => {
    element.classList.remove('animate__fadeIn');
    element.classList.add('animate__fadeOut');
    
    element.addEventListener('animationend', function() {
      appContent.innerHTML = '';
      appContent.style.display = 'flex';
      appContent.style.flexDirection = 'column';
      appContent.style.justifyContent = 'center';
      appContent.style.alignItems = 'center';
      
      const winnerColor = winnerTeam === 1 ? team1Color : team2Color; // Используем цвет победившей команды
      appContent.style.backgroundColor = winnerColor;
      appContent.classList.add('winner-screen');

      
      const winnerText = document.createElement('h2');
      winnerText.textContent = `Команда ${winnerTeam === 1 ? team1Name : team2Name} победила!`;
      winnerText.classList.add('winner-text');
      
      const scoreText = document.createElement('p');
      scoreText.textContent = `${team1Name}: ${team1Score} X ${team2Score} :${team2Name}`;
      scoreText.classList.add('score-text');
      
      appContent.appendChild(winnerText);
      appContent.appendChild(scoreText);

      const exitButton = document.createElement('button');
      exitButton.textContent = 'Выйти';
      exitButton.classList.add('exit-button');
      exitButton.addEventListener('click', resetGame);
      
      appContent.appendChild(exitButton);
    
      
      // Ждем, пока текст полностью появится на экране
      setTimeout(() => {
        // Запускаем конфетти после появления текста
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6, x: 0 }, // Левый край
          angle: 60,
          startVelocity: 50,
          gravity: 1.2,
          drift: 1,
          scalar: 0.8,
          zIndex: 2000,
          disableForReducedMotion: true
        });
        
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6, x: 1 }, // Правый край
          angle: 120,
          startVelocity: 50,
          gravity: 1.2,
          drift: -1,
          scalar: 0.8,
          zIndex: 2000,
          disableForReducedMotion: true
        });
      }, 2000); // Задержка в 2 секунды перед запуском конфетти
    });
  });
}

function resetGame() {
  // Сбрасываем счет и переменные
  team1Score = 0;
  team2Score = 0;
  currentPeriod = 1;
  isBreak = false;
  isOvertime = false;

  // Очищаем содержимое appContent
  appContent.innerHTML = '';
  appContent.style.display = 'none';

  // Показываем начальный экран
  const elements = document.querySelectorAll('h1, .sticker, .button');
  elements.forEach(function(element) {
    element.style.display = 'block';
    element.classList.remove('animate__fadeOut');
    element.classList.add('animate__fadeIn');
  });
}


function disableScoreButtons() {
  team1PlusButton.removeEventListener('click', incrementTeam1Score);
  team1PlusButton.removeEventListener('click', decrementTeam1Score);
  team2PlusButton.removeEventListener('click', incrementTeam2Score);
  team2PlusButton.removeEventListener('click', decrementTeam2Score);
  team1ScoreElement.removeEventListener('click', toggleTeam1ScoreButton);
  team2ScoreElement.removeEventListener('click', toggleTeam2ScoreButton);
}

function enableScoreButtons() {
  team1PlusButton.addEventListener('click', incrementTeam1Score);
  team2PlusButton.addEventListener('click', incrementTeam2Score);
  team1ScoreElement.addEventListener('click', toggleTeam1ScoreButton);
  team2ScoreElement.addEventListener('click', toggleTeam2ScoreButton);
}


function incrementTeam1Score() {
  team1Score++;
  updateScore();
}

function incrementTeam2Score() {
  team2Score++;
  updateScore();
}

function updateScore() {
  team1ScoreElement.textContent = team1Score;
  team2ScoreElement.textContent = team2Score;
}


function disableScoreButtons() {
  team1PlusButton.removeEventListener('click', incrementTeam1Score);
  team2PlusButton.removeEventListener('click', incrementTeam2Score);
}

function enableScoreButtons() {
  team1PlusButton.addEventListener('click', incrementTeam1Score);
  team2PlusButton.addEventListener('click', incrementTeam2Score);
}

function updateTimer() {
  if (!isPaused) {
    const minutes = Math.floor(gameTime / 60);
    const seconds = gameTime % 60;
    gameTimeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (gameTime === 0) {
      clearInterval(gameTimer);
      
      if (!isBreak) {
        periodEndAudio.play();
      }
      
      if (isBreak) {
        // Перерыв закончился
        isBreak = false;
        enableScoreButtons(); // Включаем кнопки добавления голов
        
        if (isOvertime) {
          // Начинаем овертайм
          periodTextElement.textContent = 'Овертайм';
          gameTime = periodTime * 60;
          startTimer();
        } else {
          // Начинаем следующий период
          currentPeriod++;
          
          if (currentPeriod <= totalPeriods) {
            periodTextElement.textContent = `${currentPeriod} период`;
            gameTime = periodTime * 60;
            startTimer();
          } else {
            // Матч закончился, определяем победителя
            const winnerTeam = team1Score > team2Score ? 1 : 2;
            showWinnerScreen(winnerTeam);
          }
        }
      } else {
        // Период закончился
        if (currentPeriod === totalPeriods) {
          // Последний период закончился, проверяем счет
          if (team1Score === team2Score) {
            // Счет одинаковый, начинаем овертайм
            isOvertime = true;
            periodTextElement.textContent = 'Перерыв перед овертаймом';
            gameTime = breakTime * 60;
            isBreak = true;
            disableScoreButtons(); // Отключаем кнопки добавления голов
            startTimer();
          } else {
            // Матч закончился, определяем победителя
            const winnerTeam = team1Score > team2Score ? 1 : 2;
            showWinnerScreen(winnerTeam);
          }
        } else {
          // Обычный перерыв между периодами
          periodTextElement.textContent = 'Перерыв';
          gameTime = breakTime * 60;
          isBreak = true;
          disableScoreButtons(); // Отключаем кнопки добавления голов
          startTimer();
        }
      }
    } else {
      gameTime--;
    }
  }
}


startTimerButton.addEventListener('click', () => {
  periodTime = parseInt(periodSlider.value);
  breakTime = parseInt(breakSlider.value);
  totalPeriods = parseInt(periodCountSlider.value);
  
  // Случайным образом определяем цвет команд
  const colors = ['red', 'blue'];
  const randomIndex = Math.floor(Math.random() * colors.length);
  team1Color = colors[randomIndex];
  team2Color = colors[1 - randomIndex];
  
  const timeContent = document.getElementById('timeContent');
  const timeElements = timeContent.querySelectorAll('.animate__animated');
  
  let animationCount = 0;
  
  timeElements.forEach(element => {
    element.classList.remove('animate__fadeIn');
    element.classList.add('animate__fadeOut');
    
    element.addEventListener('animationend', function() {
      animationCount++;
      
      if (animationCount === timeElements.length) {
        timeContent.style.display = 'none';
        
        // Показываем экран с матчем
        appContent.style.display = 'flex';
        
        // Устанавливаем начальное значение таймера
        gameTime = periodTime * 60;
        updateTimer();
        
        setTimeout(() => {
          startTimer();
        }, 1000); // Задержка в 1 секунду перед запуском таймера
        
        const team1NameDisplay = document.getElementById('team1NameDisplay');
        team1NameDisplay.textContent = team1Name;
        team1NameDisplay.style.color = team1Color; // Устанавливаем цвет команды 1
        
        const team2NameDisplay = document.getElementById('team2NameDisplay');
        team2NameDisplay.textContent = team2Name;
        team2NameDisplay.style.color = team2Color; // Устанавливаем цвет команды 2
        
        const appElements = appContent.querySelectorAll('.animate__animated');
        appElements.forEach(element => {
          element.classList.add('animate__fadeIn');
        });
        
        // Обновляем текст периода
        periodTextElement.textContent = `${currentPeriod} период`;
        
        // Добавляем обработчики событий для кнопок добавления голов
        team1PlusButton.addEventListener('click', incrementTeam1Score);
        team2PlusButton.addEventListener('click', incrementTeam2Score);
      }
      function disableScoreButtons() {
        team1PlusButton.removeEventListener('click', incrementTeam1Score);
        team1PlusButton.removeEventListener('click', decrementTeam1Score);
        team2PlusButton.removeEventListener('click', incrementTeam2Score);
        team2PlusButton.removeEventListener('click', decrementTeam2Score);
        team1ScoreElement.removeEventListener('click', toggleTeam1ScoreButton);
        team2ScoreElement.removeEventListener('click', toggleTeam2ScoreButton);
      }
      
      function enableScoreButtons() {
        team1PlusButton.addEventListener('click', incrementTeam1Score);
        team2PlusButton.addEventListener('click', incrementTeam2Score);
        team1ScoreElement.addEventListener('click', toggleTeam1ScoreButton);
        team2ScoreElement.addEventListener('click', toggleTeam2ScoreButton);
      }
    });
  });
});