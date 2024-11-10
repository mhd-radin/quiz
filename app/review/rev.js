var table = document.getElementById('table');
var topic = document.getElementById('topic');

function hideLoader() {
  document.querySelector('.loader').style.display = 'none'
}

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

function createItemHtml(id, qesTitle, userAnswer, rightAnswer, isCorrect, elapsedTime) {
  var clueString = '';
  clueString += '<li class="'+(isCorrect ? 'ua': 'wa')+'"> <b> Your Answer: </b>' + userAnswer + '</li>';
  clueString += '<li class="ra"> <b> Right Answer: </b>' + rightAnswer + '</li>';
  clueString += '<p >' + elapsedTime + ' Seconds elapsed</p>';
  return `
<div class="item" id="${id}">
  <h3 class="ui block header">
    ${qesTitle}
  </h3>
  <ul>
    ${clueString}
  </ul>
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
if (localStorage.getItem('client')) {
  var id = JSON.parse(localStorage.getItem('client')).id;
  bushido.realtime.onSet('quizResults/' + id, function(snapshot) {
    var data = snapshot.val();
    hideLoader();
    clearBody()
    if (snapshot.exists()) {
      var subjects = Object.keys(data);
      subjects.forEach(function(subject) {
        var session = createSessionHtml(subject);
        addToTable(session);

        var questions = Object.keys(data[subject].results);
        questions.forEach(function(qesId) {
          var qes = data[subject].results[qesId];
          var clues = getObjectValues(qes.clues);
          var item = createItemHtml(qesId, qes.question, clues[qes.submittedAnswerIndex], clues[qes.rightAnswerIndex], qes.isCorrect, qes.elapsedTime);
          addToSession(subject, item);
        })
      })
    } else {
      table.innerHTML = `
        <div class="table" id="table">
          <div class="topic-session">
            <div class="topic-title">
              No Data Found!
            </div>
            <div class="topic-body">
              
            </div>
          </div>
        </div>
      `
    }
  }).catch(alert)
}