resetAnswersStyle()

const qesData = [
  {
    question: "Which mammal has the most teeth?",
    clues: ["Elephant", "Dolphin", "Giraffe", "Armadillo"],
    rightAnswerIndex: 1,
    time: 25
  },
  {
    question: "Which animal’s fingerprints are almost identical to humans?",
    clues: ["Gorilla", "Koala", "Elephant", "Chimpanzee"],
    rightAnswerIndex: 1,
    time: 25
  },
  {
    question: "How many legs does a lobster have?",
    clues: ["6", "8", "10", "12"],
    rightAnswerIndex: 2,
    time: 25
  },
  {
    question: "Which animal never sleeps?",
    clues: ["Jellyfish", "Shark", "Dolphin", "Bullfrog"],
    rightAnswerIndex: 3,
    time: 25
  },
  {
    question: "What is the only known venomous primate?",
    clues: ["Chimpanzee", "Slow Loris", "Baboon", "Gibbon"],
    rightAnswerIndex: 1,
    time: 25
  },
  {
    question: "Which animal has blue blood?",
    clues: ["Horse", "Octopus", "Human", "Dog"],
    rightAnswerIndex: 1,
    time: 25
  },
  {
    question: "How many hearts does a hagfish have?",
    clues: ["1", "2", "3", "4"],
    rightAnswerIndex: 3,
    time: 25
  },
  {
    question: "Which bird is known to mimic almost any sound, including chainsaws?",
    clues: ["Mockingbird", "Parrot", "Lyrebird", "Crow"],
    rightAnswerIndex: 2,
    time: 25
  },
  {
    question: "What is the largest species of frog?",
    clues: ["American Bullfrog", "Goliath Frog", "Tree Frog", "Poison Dart Frog"],
    rightAnswerIndex: 1,
    time: 25
  },
  {
    question: "Which animal has the largest eyes relative to its body size?",
    clues: ["Owl", "Tarsier", "Eagle", "Octopus"],
    rightAnswerIndex: 1,
    time: 25
  },
  {
    question: "Which animal can hold its breath the longest?",
    clues: ["Whale", "Sea Turtle", "Dolphin", "Sperm Whale"],
    rightAnswerIndex: 3,
    time: 25
  },
  {
    question: "Which animal has the highest blood pressure?",
    clues: ["Elephant", "Giraffe", "Tiger", "Crocodile"],
    rightAnswerIndex: 1,
    time: 25
  },
  {
    question: "Which animal can rotate its head 270 degrees?",
    clues: ["Cat", "Owl", "Eagle", "Hawk"],
    rightAnswerIndex: 1,
    time: 25
  },
  {
    question: "What is the largest known jellyfish species?",
    clues: ["Lion’s Mane", "Moon Jellyfish", "Blue Bottle", "Box Jellyfish"],
    rightAnswerIndex: 0,
    time: 25
  },
  {
    question: "Which animal is known to carry a 'weapon' made from discarded shells?",
    clues: ["Octopus", "Hermit Crab", "Lobster", "Squid"],
    rightAnswerIndex: 1,
    time: 25
  },
  {
    question: "What type of animal is a platypus?",
    clues: ["Marsupial", "Reptile", "Monotreme", "Mammal"],
    rightAnswerIndex: 2,
    time: 25
  },
  {
    question: "Which animal has the longest gestation period?",
    clues: ["Horse", "Elephant", "Whale", "Rhinoceros"],
    rightAnswerIndex: 1,
    time: 25
  },
  {
    question: "Which animal has the largest brain-to-body ratio?",
    clues: ["Human", "Dolphin", "Ant", "Octopus"],
    rightAnswerIndex: 2,
    time: 25
  },
  {
    question: "What is the only bird that can fly backward?",
    clues: ["Sparrow", "Hummingbird", "Falcon", "Hawk"],
    rightAnswerIndex: 1,
    time: 25
  },
  {
    question: "Which animal has the most powerful bite relative to its size?",
    clues: ["Lion", "Crocodile", "Hyena", "Piranha"],
    rightAnswerIndex: 3,
    time: 25
  },
  {
    question: "Which animal can regrow its limbs?",
    clues: ["Snake", "Starfish", "Bird", "Fish"],
    rightAnswerIndex: 1,
    time: 25
  },
  {
    question: "What is the smallest mammal by weight?",
    clues: ["Etruscan Shrew", "Bumblebee Bat", "Mouse", "Pygmy Possum"],
    rightAnswerIndex: 1,
    time: 25
  },
  {
    question: "Which animal is known to produce the loudest sound?",
    clues: ["Elephant", "Lion", "Blue Whale", "Wolf"],
    rightAnswerIndex: 2,
    time: 25
  },
  {
    question: "What is the only animal with four knees?",
    clues: ["Cat", "Elephant", "Giraffe", "Horse"],
    rightAnswerIndex: 1,
    time: 25
  },
  {
    question: "Which mammal spends the most time sleeping?",
    clues: ["Bear", "Sloth", "Koala", "Cat"],
    rightAnswerIndex: 2,
    time: 25
  },
  {
    question: "What color is the blood of a horseshoe crab?",
    clues: ["Red", "Blue", "Green", "Yellow"],
    rightAnswerIndex: 1,
    time: 25
  },
  {
    question: "What is the largest species of spider?",
    clues: ["Black Widow", "Tarantula", "Goliath Birdeater", "Wolf Spider"],
    rightAnswerIndex: 2,
    time: 25
  },
  {
    question: "Which animal has a heart that beats only a few times per minute?",
    clues: ["Whale", "Elephant", "Giraffe", "Crocodile"],
    rightAnswerIndex: 0,
    time: 25
  },
  {
    question: "What is the smallest bird in the world?",
    clues: ["Sparrow", "Hummingbird", "Bee Hummingbird", "Warbler"],
    rightAnswerIndex: 2,
    time: 25
  },
  {
    question: "Which animal has the most bones?",
    clues: ["Elephant", "Dog", "Snake", "Mouse"],
    rightAnswerIndex: 2,
    time: 25
  },
  {
    question: "Which animal is known to have the longest migration?",
    clues: ["Penguin", "Monarch Butterfly", "Gray Whale", "Arctic Tern"],
    rightAnswerIndex: 3,
    time: 25
  },
  {
    question: "Which creature has three hearts?",
    clues: ["Octopus", "Crab", "Fish", "Starfish"],
    rightAnswerIndex: 0,
    time: 25
  },
  {
    question: "What animal has the longest lifespan?",
    clues: ["Elephant", "Blue Whale", "Greenland Shark", "Giant Tortoise"],
    rightAnswerIndex: 2,
    time: 25
  },
  {
    question: "Which insect is known to create 'paper' nests?",
    clues: ["Bee", "Wasp", "Ant", "Butterfly"],
    rightAnswerIndex: 1,
    time: 25
  },
  {
    question: "Which animal is the only known venomous mammal?",
    clues: ["Koala", "Slow Loris", "Platypus", "Bat"],
    rightAnswerIndex: 2,
    time: 25
  },
  {
    question: "What is the only land mammal that can't jump?",
    clues: ["Bear", "Giraffe", "Elephant", "Horse"],
    rightAnswerIndex: 2,
    time: 25
  },
  {
    question: "Which animal has the thickest fur in the animal kingdom?",
    clues: ["Polar Bear", "Seal", "Sea Otter", "Arctic Fox"],
    rightAnswerIndex: 2,
    time: 25
  },
  {
    question: "Which bird has the largest wingspan?",
    clues: ["Eagle", "Albatross", "Condor", "Pelican"],
    rightAnswerIndex: 1,
    time: 25
  },
  {
    question: "Which animal has a detachable tail that can grow back?",
    clues: ["Snake", "Lizard", "Bird", "Fish"],
    rightAnswerIndex: 1,
    time: 25
  }
];

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
      var keys = Object.keys(data).forEach(function(key) {
        var qes = data[key];
        qes.clues = getObjectValues(qes.clues);
        arr.push(qes);
      })

      startQuiz(arr, client.name, subject, client.division, client.rollnum, client.id)
    })
  }
}