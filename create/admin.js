var table = document.getElementById('table');
var topic = document.getElementById('topic');
var addBtn = document.getElementById('addBtn');


function createSessionHtml(title, sector) {
  return new TagString(`
<div class="topic-session" id="${title}">
  <div class="topic-title">
    ${title}
  </div>
  <div class="topic-body">
  </div>
</div>`)
}

function createItemHtml(id, qesTitle, qesClues = [], rightAnswerIndex, sector = '') {
  var clueString = '';
  qesClues.forEach(function(str, index) {
    clueString += '<li ' + (index == rightAnswerIndex ? 'class="success"' : '') + '>' + str + '</li>';
  })
  return new TagString(`
<div class="qes" id=${id}>
  <div class="title">${qesTitle} <span class="sector">${sector ? ('( For '+sector+' ) ') : ''}</span></div>
  <ul>
    ${clueString}
  </ul>
  <div class="buttons">
    <button class="ui icon button negative"> Delete </button>
    <button class="ui icon button positive"> Edit </button>
  </div>
</div>
`);
}

function addToTable(html) {
  table.innerHTML += html;
}

function addToSession(sessionId, content) {
  document.getElementById(sessionId).querySelector('.topic-body').innerHTML += content;
}

function clearBody() {
  table.innerHTML = '';
}


bushido.realtime.onSet('quiz', function(snapshot) {
  var data = snapshot.val();
  clearBody();
  if (snapshot.exists()) {
    var subjects = Object.keys(data);

    document.getElementById('optBox').innerHTML = '';
    subjects.forEach(function(subject) {
      document.getElementById('optBox').innerHTML += `<div class="item" data-value="${subject}">${subject}</div>`


      var session = createSessionHtml(subject);
      var subjectElem = session.parseElement()[0];
      table.appendChild(subjectElem)

      var questions = Object.keys(data[subject]);
      
      questions.sort((a, b)=>{
        var qesA = data[subject][a];
        var qesB = data[subject][b];
        
        if (qesA.date && qesB.date){
          var dateComparison = (new Date(qesB.date) - new Date(qesA.date));
          if (dateComparison !== 0) return dateComparison; // If dates differ, use date order
          return qesA.question.localeCompare(qesB.question);
        }
      })
      
      questions.forEach(function(qesId, qesIndex) {
        var qes = data[subject][qesId];
        var item = createItemHtml(qesId, ((qesIndex + 1) + '. ' + qes.question), getObjectValues(qes.clues), qes.rightAnswerIndex, qes.sector);
        var itElem = item.parseElement()[0];

        subjectElem.querySelector('.topic-body').appendChild(itElem)

        itElem.querySelector('button.negative').addEventListener('click', function() {
          bushido.realtime.set('quiz/' + subject + '/' + qesId, null);
        })

        itElem.querySelector('button.positive').addEventListener('click', function() {
          editQes(subject, qesId, qes);
        })
      })
    })
  } else {
    table.innerHTML = '<h1>No Data Found!</h1>'
  }
}).catch(alert);

function getDataFromInp() {
  var topicValue = topic.value;
  var qes = document.getElementById('qes').value;
  var time = document.getElementById('time').value;
  var sector = document.getElementById('sector').value;
  var optA = document.getElementById('optA').value;
  var optB = document.getElementById('optB').value;
  var optC = document.getElementById('optC').value;
  var optD = document.getElementById('optD').value;
  var correct = parseInt(document.getElementById('correct').value);

  if (!qes) {
    return null;
  } else if (!correct) {
    return null;
  } else if (!sector) {
    alert('Class name required. if class name selector is blank, go to manage and add classes to fix it!')
    return null;
  } else if (!time) {
    return null;
  } else if (!optA) {
    return null;
  } else if (!optB) {
    return null;
  } else {
    var data = {
      question: qes,
      clues: [optA, optB],
      rightAnswerIndex: (correct - 1),
      time: time,
      date: new Date().toString(),
      sector,
      id: ('QES_' + Math.floor(Math.random() * 99999))
    }

    if (optC) {
      data.clues.push(optC)
    }
    if (optD) {
      data.clues.push(optD)
    }

    return data;
  }
}

function editQes(subject, qesId, presentData) {
  document.getElementById('qes').value = presentData.question;
  document.getElementById('time').value = presentData.time;
  document.getElementById('sector').value = presentData.sector;
  document.getElementById('optA').value = presentData.clues[0];
  document.getElementById('optB').value = presentData.clues[1];
  if (presentData.clues[2]) document.getElementById('optC').value = presentData.clues[2];
  if (presentData.clues[3]) document.getElementById('optD').value = presentData.clues[3];
  document.getElementById('correct').value = (presentData.rightAnswerIndex + 1);

  $('.ui.modal').modal({
    onApprove: function() {
      var data = getDataFromInp();
      if (data) {
        data.id = presentData.id;
        data.date = presentData.date;

        bushido.realtime.set('quiz/' + subject + '/' + data.id, data).then(function() {
          // done
        })


        $('.ui.modal').modal('hide');
        return false;
      } else {
        alert('Form filled incorrectly');
      }
    }
  }).modal('show')
}

addBtn.onclick = function() {
  var topicValue = topic.value;
  $('.ui.modal').modal({
    onApprove: function() {
      var data = getDataFromInp();
      if (data && topicValue) {

        bushido.realtime.set('quiz/' + topicValue + '/' + data.id, data).then(function() {
          // done
          window.location.href = '#'+data.id;
        })

        $('.ui.modal').modal('hide');
        return false;
      } else {
        alert('Form filled incorrectly');
      }
    }
  }).modal('show')
}


bushido.realtime.get('quizSectors').then(function(snapshot) {
  var data = snapshot.val();
  Object.keys(data).forEach(function(sub) {
    document.getElementById('sector').innerHTML += '<option value="'+sub+'">'+sub+'</option>'
  })
})

function clearAllData() {
  bushido.realtime.set('quiz', null);
  bushido.realtime.set('quizLeader', null);
  bushido.realtime.set('quizResults', null)
  bushido.realtime.set('quizSectors', null)
}

function clearQuestionData() {
  bushido.realtime.set('quiz', null);
}

function clearUsersData() {
  bushido.realtime.set('quiz', null);
  bushido.realtime.set('quizLeader', null);
  bushido.realtime.set('quizResults', null)
}

function addFromJSON(topic, dataInArray = []) {
  bushido.realtime.set('quiz/' + topic, dataInArray)
}


$('#customDropdown').dropdown({
  allowAdditions: true,
  fullTextSearch: false
});

document.getElementById('topic').onchange = function() {
  window.location.href = '#' + document.getElementById('topic').value;
}

// const Qestions = [
//   {
//     question: "Which animal’s fingerprints are almost identical to humans?",
//     clues: ["Gorilla", "Koala", "Elephant", "Chimpanzee"],
//     rightAnswerIndex: 1,
//     time: 60
//   },
//   {
//     question: "How many legs does a lobster have?",
//     clues: ["6", "8", "10", "12"],
//     rightAnswerIndex: 2,
//     time: 60
//   },
//   {
//     question: "Which animal never sleeps?",
//     clues: ["Jellyfish", "Shark", "Dolphin", "Bullfrog"],
//     rightAnswerIndex: 3,
//     time: 60
//   },
//   {
//     question: "What is the only known venomous primate?",
//     clues: ["Chimpanzee", "Slow Loris", "Baboon", "Gibbon"],
//     rightAnswerIndex: 1,
//     time: 60
//   },
//   {
//     question: "Which animal has blue blood?",
//     clues: ["Horse", "Octopus", "Human", "Dog"],
//     rightAnswerIndex: 1,
//     time: 60
//   },
//   {
//     question: "How many hearts does a hagfish have?",
//     clues: ["1", "2", "3", "4"],
//     rightAnswerIndex: 3,
//     time: 60
//   },
//   {
//     question: "Which bird is known to mimic almost any sound, including chainsaws?",
//     clues: ["Mockingbird", "Parrot", "Lyrebird", "Crow"],
//     rightAnswerIndex: 2,
//     time: 60
//   }
// ];

// addFromJSON('Wild Animals', Qestions)