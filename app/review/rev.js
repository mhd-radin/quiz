var table = document.getElementById('table');
var topic = document.getElementById('topic');

function hideLoader() {
  document.querySelector('.loader').style.display = 'none'
}

function createSessionHtml(title) {
  return new TagString(`
<div class=" rounded-lg border-2 border-blue-500 bg-gray-800 shadow-lg overflow-hidden my-2" id="${title}">
  <!-- Head -->
  <div class="bg-blue-500 bg-opacity-80 text-white py-3 px-4">
    <h2 class="text-lg font-bold topic-title">${title}</h2>
  </div>

  <!-- Body -->
  <div class="bg-gray-900 flex justify-center flex-wrap flex-row overflow-scroll text-gray-300 p-1 topic-body">

  </div>
</div>
`)
}

function createItemHtml(id, qesTitle, userAnswer, rightAnswer, isCorrect, elapsedTime) {
  var clueString = '';

  clueString += `
    <button class="w-full flex items-center bg-green-500 text-white py-2 px-4 rounded hover:bg-gray-600">
      <span class="mr-2 font-bold">Right Answer.</span>${rightAnswer}
    </button>`;

  clueString += `
    <button class="w-full flex items-center ${isCorrect ? "bg-blue-500" : 'bg-red-500' } text-white py-2 px-4 rounded shadow-lg hover:brightness-110">
      <span class="mr-2 font-bold">Your Answer.</span>${userAnswer}
    </button>`;


  return new TagString(`
<div class="bg-gray-800 shadow-lg rounded-lg p-3 w-full max-w-sm my-2 mx-2">
  <div class="flex justify-between items-center mb-4" id="${id}">
    <h2 class="text-lg font-bold">Question.</h2>
    <!-- Lucide Edit Icon -->
    <div class="flex space-x-2 space-y-1">
      <button class="text-gray-400 rounded hover:text-gray-200 p-1 positive">
        <i data-lucide="edit"></i>
      </button>
      <button class="text-red-400 rounded hover:text-red-200 p-1 negative">
        <i data-lucide="delete"></i>
      </button>
    </div>
  </div>
  <p class="text-gray-300 mb-4">${qesTitle}</p>
  <div class="space-y-2">
    ${clueString}
  </div>
  <div class="p-2 m-2 text-white text-center">
    Elapsed time: ${elapsedTime} Seconds.
  </div>
</div>`);
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
  bushido.realtime.onSet(localStorage.getItem('section') + '_quizResults/' + id, function(snapshot) {
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
     <div class=" rounded border-2 border-blue-500 bg-gray-800 shadow-lg overflow-hidden my-0" id="">
  <!-- Head -->
  <div class="bg-blue-500 bg-opacity-80 text-white py-3 px-4">
    <h2 class="text-lg font-bold topic-title">No Data Found!</h2>
  </div>

  <!-- Body -->
  <div class="bg-gray-900 flex justify-center flex-wrap flex-row overflow-scroll text-gray-300 p-1 topic-body">

  </div>
</div>
      `
    }
  }).catch(alert)
}