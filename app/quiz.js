var clientData = {
  userName: '',
  subject: '',
  division: '',
  rollnum: '',
  userId: '',

  askedQestions: [],
  totalQes: 25,
  currentQesData: null,
  timer: null,
  resultData: null,
  qesData: null,
}



class QuizResultData {
  constructor(userName, division, subject, rollnum, id = '', results = []) {
    this.userName = userName;
    this.division = division;
    this.subject = subject;
    this.rollnum = rollnum;
    this.userId = id;
    this.results = results;
    //[
    // demo
    //       {
    //         question: 'How many seconds in one minute?',
    //         elapsedTime: 30,
    //         totalTime: 60,
    //         isCorrect: true,
    //         submittedAnswerIndex: 3,
    //         clues: ['59.9', '0.60', '58', '60'],
    //         rightAnswerIndex: 3,
    //         alerts: 0,
    // }

    //];
    this.points = null;
    this.corrects = null;
    this.wrongs = null;
  }

  addValue(question, elapsed, totalTime, isCorrect, submittedAnswerIndex, clues, rightAnswerIndex, alerts) {
    const value = {
      question: question,
      elapsedTime: elapsed,
      totalTime: totalTime,
      isCorrect: isCorrect,
      submittedAnswerIndex: submittedAnswerIndex,
      clues: clues,
      rightAnswerIndex: rightAnswerIndex,
      alerts: alerts
    };

    this.results.push(value)
  }

  calcValues() {
    var self = this;
    this.points = 0;
    this.corrects = 0;
    this.wrongs = 0;

    this.results.map(function(item) {
      if (item.isCorrect) {
        self.corrects += 1;
        var timeSegement = (20 / item.totalTime) * item.elapsedTime;
        // Total Points: 50
        // Time: 20,
        // Corrected: 25,
        // 0 Alerts: 5

        var timePoints = (20 - timeSegement);
        var alertsPoints = (item.alerts > 0 ? 0 : 5);
        self.points += (25 + timePoints + alertsPoints);
      } else {
        self.wrongs += 1;
        self.points -= 10;
      }
    })

  }

  get length() {
    return this.results.length;
  }
}

function saveLocalData() {
  localStorage.setItem('clientData', JSON.stringify(clientData));
  localStorage.setItem('results', JSON.stringify(clientData.resultData));
}

function showQuiz() {
  document.getElementById('review').style.display = 'none'
  document.getElementById('quiz').style.display = 'block'
  if (window.innerWidth > 650) {
    document.getElementById('quiz').style.display = 'flex'
  }
}

function showReview() {
  document.getElementById('review').style.display = 'block'
  document.getElementById('quiz').style.display = 'none'
  if (window.innerWidth > 650) {
    document.getElementById('review').style.display = 'flex'
  }
}

function hideLoader() {
  document.querySelector('.loader').style.display = 'none'
}

function editReview(username, division, points, totalQes, corrects, wrongs) {
  var info = document.getElementById('review-name');
  var pointsTag = document.getElementById('review-points');
  var correctsTag = document.getElementById('chart-corrects')
  var wrongsTag = document.getElementById('chart-wrongs')

  var quotes = [
"Attempt is the first step towards success!",
"Every attempt is a step closer to victory!",
"You tried, and that's what matters!",
"Don't worry about failure, worry about not trying!",
"Attempted, not failed. There's a difference!",
"Don't be afraid to try again. Every attempt gets you closer!",
    ]

  var randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById('quote').innerHTML = '<strong>"' + randomQuote + '"</strong';
  document.getElementById('message').innerHTML = 'Click trophy button to see your rank in "' + (clientData.subject) + '" quiz!'

  info.innerHTML = "Your Result: " + username + " - " + division;
  pointsTag.innerHTML = parseFloat(points).toFixed(2);
  var correctPercentage = 100 / (totalQes / corrects);
  correctsTag.style.setProperty('--progress', correctPercentage);
  correctsTag.querySelector('.percentage').innerHTML = correctPercentage.toFixed(1) + '% <br> <div class="sm">' + corrects + ' Correct</div>';

  var wrongsPercentage = 100 / (totalQes / wrongs);
  wrongsTag.style.setProperty('--progress', wrongsPercentage);
  wrongsTag.querySelector('.percentage').innerHTML = wrongsPercentage.toFixed(1) + '% <br> <div class="sm">' + wrongs + ' Wrong</div>';
}

function startQuiz(qesData, userName, subject, division, rollnum, userId) {
  resetAnswersStyle();
  clientData.userName = userName;
  clientData.userId = userId;
  clientData.subject = subject;
  clientData.division = division;
  clientData.rollnum = rollnum;


  if (clientData.totalQes >= qesData.length) {
    clientData.totalQes = qesData.length;
  }

  var useResultData = ((typeof clientData.resultData != 'undefined' && clientData.resultData) ? clientData.resultData.results : [])

  clientData.resultData = new QuizResultData(clientData.userName, clientData.division, clientData.subject, clientData.rollnum, clientData.userId, useResultData);
  if (typeof clientData.resultData != 'undefined' && clientData.resultData) {
    clientData.resultData.calcValues()
    updateProperties(clientData.subject, clientData.resultData.corrects, clientData.resultData.wrongs, clientData.resultData.points);
  } else {
    updateProperties(clientData.subject, 0, 0, 0);
  }
  clientData.qesData = qesData;
  updateQuestionInfo(clientData.totalQes, clientData.askedQestions.length)
  
  nextQuestion(qesData);
}

function getValueBy(array, key, value) {
  return array.filter(obj => obj[key] === value);
}

function nextQuestion(qesData) {
  resetAnswersStyle()
  var shuffleQes = shuffleArray(qesData);
  var uniqeArr = getUniqueArray(shuffleQes, clientData.askedQestions, 'question');


  var qes = uniqeArr[Math.floor(Math.random() * uniqeArr.length)];
  qes = shuffleCluesAndAdjustAnswer(qes);

  saveLocalData();
  clientData.askedQestions.push(qes);
  clientData.currentQesData = qes;
  updateQuestion(qes.question, qes.clues);
  updateQuestionInfo(clientData.totalQes, clientData.askedQestions.length);
  var timer = (clientData.timer = startCountdown(qes.time));

  timer.timeup = function() {
    document.querySelectorAll('.clue-box').forEach(function(el, index) {
      el.onclick = function() {};
    })

    clientData.resultData.addValue(qes.question, qes.time, qes.time, false, (-1), qes.clues, qes.rightAnswerIndex, timer.alerted);
    clientData.resultData.calcValues();

    if (isQuestionEnded()) {
      handleEndQuiz();
    } else {
      prepareNewQuestion();
    }
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
[array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

function getUniqueArray(arr1, arr2, key) {
  return arr1.filter(obj1 =>
    !arr2.some(obj2 => obj2[key] === obj1[key])
  );
}

function shuffleCluesAndAdjustAnswer(question) {
  const clues = question.clues;
  const originalAnswer = clues[question.rightAnswerIndex];
  const originalCluesWithIndices = clues.map((clue, index) => ({ clue, index }));

  // Fisher-Yates Shuffle on the mapped array
  for (let i = originalCluesWithIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
        [originalCluesWithIndices[i], originalCluesWithIndices[j]] = [originalCluesWithIndices[j], originalCluesWithIndices[i]];
  }

  // Extract clues and find the new index of the original answer
  question.clues = originalCluesWithIndices.map(item => item.clue);
  question.rightAnswerIndex = originalCluesWithIndices.findIndex(item => item.clue === originalAnswer);

  return question;
}


function prepareNewQuestion() {
  clientData.timer.stop();
  nextBtn.onclick = function() {}
  setTimeout(function() {
    resetAnswersStyle();
    nextQuestion(clientData.qesData);
  }, 1650)
}

function isQuestionEnded() {
  return (
    clientData.totalQes <= clientData.resultData.results.length ||
    clientData.qesData.length === clientData.askedQestions.length);
}


function handleWrongAnswer(sai) {
  document.querySelectorAll('.clue-box').forEach(function(el, index) {
    if (sai == index) {
      el.classList.add('wrong');
    } else {
      el.classList.add('outline-red')
    }

    if (clientData.currentQesData.rightAnswerIndex === index) {
      el.classList.remove('outline-red')
      el.classList.add('success')
    }
  })
}

function handleCorrectAnswer(sai) {
  document.querySelectorAll('.clue-box').forEach(function(el, index) {
    if (sai == index) {
      el.classList.add('success')
    } else {
      el.classList.add('outline-red')
    }

    if (clientData.currentQesData.rightAnswerIndex === index) {
      el.classList.remove('outline-red')
      el.classList.add('success')
    }
  })

}

function handleEndQuiz() {
  clientData.timer.stop();
  clientData.end = true;
  var resultData = clientData.resultData;
  saveLocalData();
  bushido.realtime.set('quizResults/' + clientData.userId + '/' + clientData.subject, clientData.resultData);
  var leaderData = {
    wrongs: resultData.wrongs,
    corrects: resultData.corrects,
    points: resultData.points,
    userId: clientData.userId,
    userName: clientData.userName,
    division: clientData.division,
    rollnum: clientData.rollnum,
  }
  bushido.realtime.get('quizLeader/' + clientData.subject + '/' + clientData.userId).then(function(snapshot) {
    var data = snapshot.val();
    if ((!snapshot.exists()) || data.points < leaderData.points) {
      bushido.realtime.set('quizLeader/' + clientData.subject + '/' + clientData.userId, leaderData);
    }
  });
  editReview(
    resultData.userName,
    resultData.division,
    resultData.points,
    resultData.results.length,
    resultData.corrects,
    resultData.wrongs)

  document.querySelector('.body').style.display = 'none'
  document.querySelector('.end-session').style.display = 'block'

  setTimeout(function() {
    var count = 200;
    var defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    function fireAll() {

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    }
    fireAll();
    setTimeout(function() {
      fireAll()
    }, 1300)
  }, 600)
}


function handleAnswerClick(e, el) {
  clientData.timer.stop();
  var elapsed = clientData.timer.elapsed;
  var totalSec = clientData.timer.totalTime;
  var alerts = clientData.timer.alerted;
  var qes = clientData.currentQesData;
  var isCorrect;

  var submitAnswerIndex = parseInt(el.dataset.index);
  if (typeof submitAnswerIndex == 'undefined') {
    var dic = {
      'A': 0,
      'B': 1,
      'C': 2,
      'D': 3
    }

    //submitAnswerIndex = dic[e.target.id];
  }

  if (qes.rightAnswerIndex === submitAnswerIndex) {
    isCorrect = true;
    handleCorrectAnswer(submitAnswerIndex)
  } else {
    isCorrect = false;
    handleWrongAnswer(submitAnswerIndex)
  }

  document.querySelectorAll('.clue-box').forEach(function(el, index) {
    el.onclick = function() {};
  })

  clientData.resultData.addValue(qes.question, elapsed, totalSec, isCorrect, submitAnswerIndex, qes.clues, qes.rightAnswerIndex, alerts);
  clientData.resultData.calcValues();
  updateProperties(clientData.resultData.subject, clientData.resultData.corrects, clientData.resultData.wrongs, clientData.resultData.points);
  if (isQuestionEnded()) {
    setTimeout(function() {
      handleEndQuiz();
    }, 2300);
  } else {
    nextBtn.onclick = function() {
      prepareNewQuestion();
    }
  }
}

function updateProperties(subject, corrects, wrongs, points = 0) {
  document.getElementById('corrects').innerHTML = corrects;
  document.getElementById('wrongs').innerHTML = wrongs;
  document.getElementById('subject').innerHTML = subject;
  document.getElementById('points').innerHTML = parseFloat(points).toFixed() + 'p';
}

function resetAnswersStyle() {
  document.querySelectorAll('.clue-box').forEach(function(elem) {
    elem.className = 'clue-box';
  })
}

function updateQuestionInfo(totalQes, completedQes) {
  document.getElementById('qesInfo').innerHTML = `Question ${totalQes}<span class="sub-info">/${completedQes}`;
  useProgressBar(totalQes, completedQes);
}

function updateQuestion(question, clues = []) {
  document.getElementById('question').innerHTML = question;
  var cluesElem = document.getElementById('clues');
  cluesElem.innerHTML = ''
  clues.forEach(function(msg, index) {
    var symbol = ['A', 'B', 'C', 'D'][index];
    cluesElem.innerHTML += `
  <div class="clue-box" data-index="${index}" id="${symbol}">
    <div class="clue-symbol">${symbol}</div>
    <div class="clue-text">${msg}</div>
  </div>`
  })

  cluesElem.querySelectorAll('.clue-box').forEach(function(el) {
    el.onclick = function(e) { handleAnswerClick(e, el) };
  })
}

function useProgressBar(max, progress) {
  document.querySelector('progress').value = progress;
  document.querySelector('progress').max = max;
}

function startCountdown(sec) {
  var timerElem = document.getElementById("timer");
  timerElem.style.animation = 'timer 1s infinite'
  var rt = {
    // events to call
    update() {

    },
    timeup() {

    },
    alerts() {

    },
    stop() {

    },
    alerted: 0,
    elapsed: 0,
    totalTime: sec,
  }
  var time = 0;
  let timerStop = setInterval(function() {
    time += 1;
    rt.elapsed = time;
    rt.update(time);
    rt.stop = function() {
      timerElem.style.animation = 'none'
      clearInterval(timerStop);
    }
    timerElem.innerHTML = (sec - time) + "s"
    if (time >= sec) {
      rt.timeup();
      timerElem.style.animation = 'none'
      clearInterval(timerStop);
    }

    if ((time + (sec / 4)) >= sec) {
      rt.alerts();
      rt.alerted += 1;
      timerElem.style.animation = 'alert 0.5s infinite'
    }
  }, 1000)

  return rt;
}

var retryBtn = document.getElementById('retryBtn')
var leaderBtn = document.getElementById('leaderBtn')
var reviewBtn = document.getElementById('reviewBtn')
var nextBtn = document.getElementById('nextQes')

retryBtn.onclick = function() {
  localStorage.removeItem('clientData')
  localStorage.removeItem('results')
  location.href = '../'
}

leaderBtn.onclick = function() {
  location.href = 'leader'
}

reviewBtn.onclick = function() {
  location.href = 'review'
}