resetAnswersStyle()

if (localStorage.getItem('clientData')) {
  clientData = JSON.parse(localStorage.getItem('clientData'));
}


if (localStorage.getItem('results')) {
  clientData.resultData = JSON.parse(localStorage.getItem('results'));
}

if (!localStorage.getItem('client') || !localStorage.getItem('subject')) {
  window.location.href = '../'
} else {
  if (clientData.end) {
    var resultData = JSON.parse(localStorage.getItem('results'));
    showReview()
    hideLoader();
    editReview(
      resultData.userName,
      resultData.division,
      resultData.points,
      resultData.results.length,
      resultData.corrects,
      resultData.wrongs)
  } else {
    showQuiz()
    var client = JSON.parse(localStorage.getItem('client'));
    var subject = localStorage.getItem('subject');
    var arr = [];

    bushido.realtime.get('quiz/' + subject).then(function(snapshot) {
      var data = snapshot.val();
      if (snapshot.exists()) {
        var keys = Object.keys(data).forEach(function(key) {
          var qes = data[key];
          qes.clues = getObjectValues(qes.clues);
          arr.push(qes);
        })
        hideLoader()
        startQuiz(arr, client.name, subject, client.division, client.rollnum, client.id)
      } else {
        window.location.href = '../'
      }
    })
  }
}