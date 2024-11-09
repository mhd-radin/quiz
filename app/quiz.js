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

function startQuiz(qesData, userName, subject, division, rollnum, userId) {
  resetAnswersStyle();
  clientData.userName = userName;
  clientData.userId = userId;
  clientData.subject = subject;
  clientData.division = division;
  clientData.rollnum = rollnum;

  var useResultData = (typeof clientData.resultData != 'undefined' ? clientData.resultData.results : [])

  clientData.resultData = new QuizResultData(clientData.userName, clientData.division, clientData.subject, clientData.rollnum, clientData.userId, useResultData);
  if (typeof clientData.resultData != 'undefined') {
    clientData.resultData.calcValues()
    updateProperties(clientData.subject, clientData.resultData.corrects, clientData.resultData.wrongs, clientData.resultData.points);
  } else {
    updateProperties(clientData.subject, 0, 0, 0);
  }
  clientData.qesData = qesData;
  updateQuestionInfo(clientData.totalQes, clientData.askedQestions.length)

  nextQuestion(qesData);
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
  setTimeout(function() {
    resetAnswersStyle();
    nextQuestion(clientData.qesData);
  }, 2300)
}

function isQuestionEnded() {
  return (clientData.totalQes <= clientData.resultData.results.length || clientData.qesData.length === clientData.askedQestions.length);
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
  console.log(submitAnswerIndex);

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
    prepareNewQuestion();
  }
}

function updateProperties(subject, corrects, wrongs, points = 0) {
  document.getElementById('corrects').innerHTML = corrects;
  document.getElementById('wrongs').innerHTML = wrongs;
  document.getElementById('subject').innerHTML = subject;
  document.getElementById('points').innerHTML = parseInt(points).toFixed() + 'p';
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
  var timer = setInterval(function() {
    time += 1;
    rt.elapsed = time;
    rt.update(time);
    rt.stop = function() {
      timerElem.style.animation = 'none'
      clearInterval(timer);
    }
    timerElem.innerHTML = (sec - time) + "s"
    if (time >= sec) {
      rt.timeup();
      timerElem.style.animation = 'none'
      clearInterval(timer);
    }

    if ((time + 10) >= sec) {
      rt.alerts();
      rt.alerted += 1;
      timerElem.style.animation = 'alert 0.5s infinite'
    }
  }, 1000)

  return rt;
}