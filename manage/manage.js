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

function createItemHtml(id, qesTitle) {
  return new TagString(`
<div class="qes" id=${id}>
  <div class="title">${qesTitle} </div>
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


bushido.realtime.onSet('quizSectors', function(snapshot) {
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
      questions.forEach(function(qesId, qesIndex) {
        var item = createItemHtml(qesId, qesId);
        var itElem = item.parseElement()[0];

        subjectElem.querySelector('.topic-body').appendChild(itElem)

        itElem.querySelector('button.negative').addEventListener('click', function() {
          if (confirm('Are you sure to delete this division permanently')) {
            bushido.realtime.set(subject + '_quiz/' + subject + '/' + qesId, null);
            if (questions.length == 1) {
              alert('Deleting Data of Class including divisions, subjects and questions, leaderboard data and review...!');
              bushido.realtime.set(subject + '_quizSubjects', null);
              bushido.realtime.set(subject + '_quizLeader', null);
              bushido.realtime.set(subject + '_quiz', null);
              bushido.realtime.set(subject + '_quizResults/', null);
            }
          }
        })
      })
    })
  } else {
    table.innerHTML = '<h1>No Data Found!</h1>'
  }
}).catch(alert);

function getDataFromInp() {
  var topicValue = topic.value;
  var division = prompt('Division Name');

  if (!division) {
    return null;
  } else {
    var data = division;

    return data;
  }
}

addBtn.onclick = function() {
  var topicValue = topic.value;
  var data = getDataFromInp();
  if (data && topicValue) {

    bushido.realtime.set('quizSectors/' + topicValue + '/' + data, data).then(function() {
      // done
    })

    $('.ui.modal').modal('hide');
    return false;
  } else {
    alert('Form filled incorrectly');
  }
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