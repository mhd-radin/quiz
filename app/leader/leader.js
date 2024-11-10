function createUserHtml(name, division, rank, points, corrects, wrongs) {
  return `
  <div class="user">
        <div class="label">
          <div class="hash">#</div>
          ${rank}
        </div>
        <div class="box">
          <div class="username">${name} - ${division}</div>
          <div class="subname">${parseInt(points).toFixed(2)} Points</div>
        </div>

        <div class="right-icons">
          <div class="score-item score-success">
            ${corrects}
          </div>
          <div class="score-item score-wrong">
            ${wrongs}
          </div>
        </div>
      </div>
  `
}

var table = document.getElementById('box');

function clearBody() {
  table.innerHTML = ''
}

function addToBody(html) {
  table.innerHTML += html
}

var subjectInp = document.getElementById('subject');

function addValueToInp(val, text) {
  subjectInp.innerHTML += '<option value="' + val + '">' + text + '</option>';
}

var saveSnapshot = null;
clearBody();

function listOut(data, subject) {
  clearBody()
  var users = data[subject];
  var arr = getObjectValues(users);
  arr = arr.sort(function (a, b) {
    return b.points - a.points;
  });
  arr.forEach(function (result, index) {
    var html = createUserHtml(
      result.userName,
      result.division,
      (index+1),
      result.points,
      result.corrects,
      result.wrongs)
    addToBody(html)
  })
}

bushido.realtime.get('quizLeader').then(function(snapshot) {
  saveSnapshot = snapshot.val();
  subjectInp.innerHTML = '';
  if (snapshot.exists()) {
    var subjects = Object.keys(saveSnapshot);
    subjects.forEach(function(subject) {
      addValueToInp(subject, subject)
    });
    
    listOut(saveSnapshot, subjectInp.value);
    subjectInp.onchange = function() {
      var subjectValue = document.getElementById('subject').value;
      listOut(saveSnapshot, subjectValue)
    }
  }
})