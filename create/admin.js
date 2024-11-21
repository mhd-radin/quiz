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
  <div class="title">${qesTitle} </div>
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
          return (new Date(qesB.date) - new Date(qesA.date));
        }
      })
      
      questions.forEach(function(qesId, qesIndex) {
        var qes = data[subject][qesId];
        var item = createItemHtml(qesId, ((qesIndex + 1) + '. ' + qes.question), getObjectValues(qes.clues), qes.rightAnswerIndex);
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
  var optA = document.getElementById('optA').value;
  var optB = document.getElementById('optB').value;
  var optC = document.getElementById('optC').value;
  var optD = document.getElementById('optD').value;
  var correct = parseInt(document.getElementById('correct').value);

  if (!qes) {
    return null;
  } else if (!correct) {
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
  allowAdditions: true,
  fullTextSearch: false
});

document.getElementById('topic').onchange = function() {
  window.location.href = '#' + document.getElementById('topic').value;
}

function downloadAsJsonFile(data, fileName = "data.json") {
    // Convert the object to a JSON string
    const jsonString = JSON.stringify(data);

    // Create a Blob with the JSON data
    const blob = new Blob([jsonString], { type: "application/json" });

    // Create a link element
    const link = document.createElement("a");

    // Set the download attribute with a filename
    link.download = fileName;

    // Create a URL for the Blob and set it as the href
    link.href = URL.createObjectURL(blob);

    // Append the link to the document, click it, and then remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}




// Object.keys(questionData).forEach(function(subKey){
//   var arr = [];
//   var prs = [];
//   var qesDatas = questionData[subKey];
//   var qesDatasValue = getObjectValues(qesDatas);
//   qesDatasValue.forEach(function (qes) {
//     qes.sector = 'Plus Two';
//     qes.date = new Date().toString();
//     arr.push(qes)
//     prs.push(bushido.realtime.set('quiz/' + subKey + '/' + qes.id, qes))
//   })
  
//   Promise.all(prs).then(function (){
//     console.log("success")
//   }).catch(err=>{
//     console.log(err)
//   })
//   console.log(arr)
// })