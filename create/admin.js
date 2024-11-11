var table = document.getElementById('table');
var topic = document.getElementById('topic');
var addBtn = document.getElementById('addBtn');


function createSessionHtml(title) {
  return new TagString(`
<div class="topic-session" id="${title}">
  <div class="topic-title">
    ${title}
  </div>
  <div class="topic-body">
  </div>
</div>`)
}

function createItemHtml(id, qesTitle, qesClues = [], rightAnswerIndex) {
  var clueString = '';
  qesClues.forEach(function(str, index) {
    clueString += '<li ' + (index == rightAnswerIndex ? 'class="success"' : '') + '>' + str + '</li>';
  })
  return new TagString(`
<div class="qes" id=${id}>
  <div class="title">${qesTitle}</div>
  <ul>
    ${clueString}
  </ul>
  <div class="buttons">
    <button class="ui icon button negative"> Delete </button>
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
  clearBody()
  if (snapshot.exists()) {
    var subjects = Object.keys(data);
    
    document.getElementById('optBox').innerHTML = '';
    subjects.forEach(function(subject) {
      document.getElementById('optBox').innerHTML += `<div class="item" data-value="${subject}">${subject}</div>`
      
      
      var session = createSessionHtml(subject);
      var subjectElem = session.parseElement()[0];
      table.appendChild(subjectElem)

      var questions = Object.keys(data[subject]);
      questions.forEach(function(qesId, qesIndex) {
        var qes = data[subject][qesId];
        var item = createItemHtml(qesId, ((qesIndex + 1) + '. ' + qes.question), getObjectValues(qes.clues), qes.rightAnswerIndex);
        var itElem = item.parseElement()[0];

        subjectElem.querySelector('.topic-body').appendChild(itElem)

        itElem.querySelector('button').addEventListener('click', function() {
          bushido.realtime.set('quiz/' + subject + '/' + qesId, null);
        })
      })
    })
  } else {
    table.innerHTML = '<h1>No Data Found!</h1>'
  }
}).catch(alert)

addBtn.onclick = function() {
  var topicValue = topic.value;
  $('.ui.modal').modal({
    onApprove: function() {
      var qes = document.getElementById('qes').value;
      var time = document.getElementById('time').value;
      var optA = document.getElementById('optA').value;
      var optB = document.getElementById('optB').value;
      var optC = document.getElementById('optC').value;
      var optD = document.getElementById('optD').value;
      var correct = parseInt(document.getElementById('correct').value);

      if (!topicValue) {

      } else if (!qes) {

      } else if (!correct) {

      } else if (!time) {

      } else if (!optA) {

      } else if (!optB) {

      } else {
        var data = {
          question: qes,
          clues: [optA, optB],
          rightAnswerIndex: (correct - 1),
          time: time,
          id: ('QES_' + Math.floor(Math.random() * 99999))
        }

        if (optC) {
          data.clues.push(optC)
        }
        if (optD) {
          data.clues.push(optD)
        }

        bushido.realtime.set('quiz/' + topicValue + '/' + data.id, data).then(function() {
          // done
        })

      }
      
      $('.ui.modal').modal('hide');
      return false;
    }
  }).modal('show')
}

function clearAllData() {
  bushido.realtime.set('quiz', null);
  bushido.realtime.set('quizLeader', null);
  bushido.realtime.set('quizResults', null)
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
  allowAdditions: true
});

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