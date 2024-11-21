var table = document.getElementById('table');
var topic = document.getElementById('topic');
var addBtn = document.getElementById('addBtn');


function createSessionHtml(title) {
  return new TagString(`
<div class="max-w-md rounded-lg border-2 border-blue-500 bg-gray-800 shadow-lg overflow-hidden my-2" id="${title}">
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

function createItemHtml(id, qesTitle, qesClues = [], rightAnswerIndex, num = '') {
  var clueString = '';
  qesClues.forEach(function(str, index) {
    var indexCode = ['A', 'B', 'C', 'D'];
    if (index == rightAnswerIndex) {

      clueString += `
    <button class="w-full flex items-center bg-blue-500 text-white py-2 px-4 rounded shadow-lg hover:brightness-110">
      <span class="mr-2 font-bold">${indexCode[index]}.</span>${str}
    </button>`;
    } else {
      clueString += `
    <button class="w-full flex items-center bg-gray-700 text-gray-300 py-2 px-4 rounded hover:bg-gray-600">
      <span class="mr-2 font-bold">${indexCode[index]}.</span>${str}
    </button>`;
    }
  })

  return new TagString(`
<div class="bg-gray-800 shadow-lg rounded-lg p-3 w-full max-w-sm my-2">
  <div class="flex justify-between items-center mb-4" id="${id}">
    <h2 class="text-lg font-bold">Question ${num}.</h2>
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
</div>
`);
}

function closeModal() {
  // Logic to hide or remove the modal
  const modal = document.querySelector('#modal');
  modal.style.display = 'none'; // Example hide method
}

function openModal() {
  const modal = document.querySelector('#modal');
  modal.style.display = 'flex';
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
    searchData = subjects;

    document.getElementById('subjects').innerHTML = '';
    subjects.forEach(function(subject) {
      document.getElementById('subjects').innerHTML += `<li class="px-4 py-2 hover:bg-gray-600 cursor-pointer">${subject}</li>`


      var session = createSessionHtml(subject);
      var subjectElem = session.parseElement()[0];
      table.appendChild(subjectElem)

      var questions = Object.keys(data[subject]);

      questions.sort((a, b) => {
        var qesA = data[subject][a];
        var qesB = data[subject][b];

        if (qesA.date && qesB.date) {
          return (new Date(qesB.date) - new Date(qesA.date));
        }
      })

      questions.forEach(function(qesId, qesIndex) {
        var qes = data[subject][qesId];
        var item = createItemHtml(qesId, (qes.question), getObjectValues(qes.clues), qes.rightAnswerIndex, (qesIndex+1));
        var itElem = item.parseElement()[0];

        subjectElem.querySelector('.topic-body').appendChild(itElem)
        lucide.createIcons();

        itElem.querySelector('button.negative').addEventListener('click', function() {
          if (confirm('Are you sure to delete this question permanently')) {
            bushido.realtime.set('quiz/' + subject + '/' + qesId, null);
          }
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

  openModal();
  document.getElementById('createBtn').onclick = function() {
    var data = getDataFromInp();
    if (data) {
      data.id = presentData.id;
      data.date = presentData.date;

      bushido.realtime.set('quiz/' + subject + '/' + data.id, data).then(function() {
        // done
      })


      closeModal()
    } else {
      alert('Form filled incorrectly');
    }
  }
}

addBtn.onclick = function() {
  var topicValue = topic.value;

  openModal();
  document.getElementById('createBtn').onclick = function() {
    var data = getDataFromInp();
    if (data && topicValue) {

      bushido.realtime.set('quiz/' + topicValue + '/' + data.id, data).then(function() {
        // done
        window.location.href = '#' + data.id;
      })

      closeModal();
    } else {
      alert('Form filled incorrectly');
    }
  }
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



document.getElementById('topic').onchange = function() {
  window.location.href = '#' + document.getElementById('topic').value;
}


// Data for comparison in the dropdown
var searchData = [];

// References to the search input and dropdown
const searchInput = document.getElementById("topic");
const dropdown = document.getElementById("dropdown");
const subjectsElem = document.getElementById("subjects");

// Function to toggle and filter dropdown items
function toggleDropdown() {
  const query = searchInput.value.trim().toLowerCase();
  subjectsElem.innerHTML = ""; // Clear existing dropdown items

  if (query !== "") {
    // Filter searchData and create dropdown items
    const filteredData = searchData.filter(item =>
      item.toLowerCase().includes(query)
    );

    if (filteredData.length > 0) {
      filteredData.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        li.className =
          "px-4 py-2 hover:bg-gray-600 cursor-pointer";
        li.onclick = () => selectOption(item); // Set click event
        subjectsElem.appendChild(li);
      });

      dropdown.classList.remove("hidden");
    } else {
      dropdown.classList.add("hidden");
    }
  } else {
    dropdown.classList.add('hidden');
  }
}

// Function to handle option selection
function selectOption(value) {
  searchInput.value = value; // Update input value
  dropdown.classList.add("hidden"); // Hide dropdown
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
// var arr = [];
// var prs = [];
// var qesDatas = questionData[subKey];
// var qesDatasValue = getObjectValues(qesDatas);
// qesDatasValue.forEach(function (qes) {
// qes.sector = 'Plus Two';
// qes.date = new Date().toString();
// arr.push(qes)
// prs.push(bushido.realtime.set('quiz/' + subKey + '/' + qes.id, qes))
// })

// Promise.all(prs).then(function (){
// console.log("success")
// }).catch(err=>{
// console.log(err)
// })
// console.log(arr)
// })