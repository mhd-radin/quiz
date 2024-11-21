var regBtn = document.getElementById('reg-btn');
var quizBtn = document.getElementById('quiz-btn');


function hideLoader() {
  document.querySelector('.loader').style.display = 'none'
}

if (
  localStorage.getItem('client') &&
  typeof JSON.parse(localStorage.getItem('client')).section == 'undefined') {
  localStorage.clear();
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
  var divisionInp = document.getElementById('division');
  var rollnum = document.getElementById('rollnum');
  var splitted = divisionInp.value.split('$$');
  var division = splitted[0],
    section = splitted[1];

  if (!name.value) {
    alert('Fill your name correctly')
  } else if (!rollnum.value) {
    alert('Enter your roll number correctly')
  } else {
    var id = formatString(name.value) + '-' + division + '-' + rollnum.value;
    var data = {
      name: name.value,
      id,
      division,
      section,
      rollnum: rollnum.value,
    }
    localStorage.setItem('client', JSON.stringify(data));
    localStorage.setItem('section', section);
    updateModals();
  }
}

if (!localStorage.getItem('client')) {
  bushido.realtime.get('quizSectors').then(function(snapshot) {
    var data = snapshot.val();
    var classes = Object.keys(data);
    document.getElementById('division').innerHTML = '';

    classes.forEach(function(subject) {
      Object.keys(data[subject]).forEach(function(div) {
        document.getElementById('division').innerHTML += `<option value="${div}$$${subject}">${div} ( ${subject} )</option>`;
      })
    })
    hideLoader();
  })
} else {

  bushido.realtime.get(localStorage.getItem('section')+'_quizSubjects').then(function(snapshot) {
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
}