var table = document.getElementById('table');
var topic = document.getElementById('topic');
var addBtn = document.getElementById('addBtn');


function createSessionHtml(title) {
  return `
<div class="topic-session" id="${title}">
  <div class="topic-title">
    ${title}
  </div>
  <div class="topic-body">
  </div>
</div>`
}

function createItemHtml(id, qesTitle, qesClues = [], rightAnswerIndex) {
  var clueString = '';
  qesClues.forEach(function(str, index) {
    clueString += '<li ' + (index == rightAnswerIndex ? 'class="success"' : '') + '>' + str + '</li>';
  })
  return `
<div class="qes" id=${id}>
  <div class="title">${qesTitle}</div>
  <ul>
    ${clueString}
  </ul>
  <div class="buttons">
    <button class="ui icon button negative"> Delete </button>
  </div>
</div>
`
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
    subjects.forEach(function(subject) {
      var session = createSessionHtml(subject);
      addToTable(session);

      var questions = Object.keys(data[subject]);
      questions.forEach(function(qesId) {
        var qes = data[subject][qesId];
        var item = createItemHtml(qesId, qes.question, getObjectValues(qes.clues), qes.rightAnswerIndex);
        addToSession(subject, item);
        
        document.getElementById(qesId).querySelector('button.negative').addEventListener('click', function() {
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

      } else if (!correct){
        
      }else if (!time) {

      } else if (!optA) {

      } else if (!optB) {

      } else {
        var data = {
          question: qes,
          clues: [optA, optB],
          rightAnswerIndex: (correct-1),
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
    }
  }).modal('show')
}