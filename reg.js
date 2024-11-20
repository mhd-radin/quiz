var regBtn = document.getElementById('reg-btn');
var quizBtn = document.getElementById('quiz-btn');

if ((JSON.parse(localStorage.getItem('client'))) && !(JSON.parse(localStorage.getItem('client')).sector)) {
  localStorage.clear();
  updateModals()
}


function hideLoader() {
  document.querySelector('.loader').style.display = 'none'
}


function formatString(str) {
  return str
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, '_') // Replace spaces with underscore
    .replace(/[^a-z0-9_-]/g, ''); // Remove all characters except lowercase letters, numbers, underscores, and hyphens
}

if (localStorage.getItem('results') && localStorage.getItem('clientData')) {
  location.href = './app'
}

function updateModals() {
  if (localStorage.getItem('client')) {
    document.getElementById('register').style.display = 'none'
    document.getElementById('quiz').style.display = 'block'
  } else {
    document.getElementById('register').style.display = 'block'
    document.getElementById('quiz').style.display = 'none'
  }
}

updateModals();

regBtn.onclick = function() {
  var name = document.getElementById('name');
  var division = document.getElementById('division');
  var rollnum = document.getElementById('rollnum');
  var sector = localStorage.getItem('sector');

  if (!name.value) {
    alert('Fill your name correctly')
  } else if (!rollnum.value) {
    alert('Enter your roll number correctly')
  } else {
    var id = formatString(name.value) + '-' + division.value + '-' + rollnum.value;
    var data = {
      name: name.value,
      id,
      division: division.value,
      sector: sector,
      rollnum: rollnum.value,
    }
    localStorage.setItem('client', JSON.stringify(data));
    updateModals();
  }
}

if (!localStorage.getItem('client')) {
  bushido.realtime.get('quizSectors').then(function(snapshot) {
    var data = snapshot.val();
    var classes = Object.keys(data);
    document.getElementById('division').innerHTML = '';

    classes.forEach(function(subject) {
      var div = Object.keys(data[subject])[0];
      document.getElementById('division').innerHTML += `<option class="item" value="${div}" data-sector="${subject}">${div} ( ${subject} )</option>`;
      localStorage.setItem('sector', document.getElementById('division').value)
      document.getElementById('division').onchange = function() {
        localStorage.setItem('sector', subject)
      }
    })
    hideLoader();
  })
}

bushido.realtime.get('quiz').then(function(snapshot) {
  if (localStorage.getItem('client')) hideLoader();
  var data = snapshot.val();
  var keys = Object.keys(data);
  keys.forEach(function(subject) {
    document.getElementById('subject').innerHTML += '<option value="' + subject + '">' + subject + '</option>'
  })
})

quizBtn.onclick = function() {
  var subject = document.getElementById('subject');
  localStorage.setItem('subject', subject.value);
  window.location.href = './app';
}