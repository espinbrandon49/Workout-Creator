const submit = document.getElementById('form'),
  search = document.getElementById('form-input'),
  resultsHeading = document.getElementById('results-heading'),
  workouts = document.getElementById('workouts'),
  singleWorkout = document.getElementById('singleWorkout'),
  myFitnessDiv = document.getElementById("myFitness"),
  myFitnessBtn = document.getElementById('myFitnessBtn');
let myFitness = JSON.parse(localStorage.getItem('myFitness')) || [];

async function getWorkoutsBySearch(e) {
  e.preventDefault();
  const term = search.value.replace(" ", "%20");
  resultsHeading.innerHTML = `<h2>Search results for '${term}':</h2>`
  const url1 = `https://exercisedb.p.rapidapi.com/exercises/target/${term}`;
  const url2 = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${term}`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': "5627d96751msh8de08767b435f30p13a6d2jsnd6221616c103",
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(["abductors", "abs", "adductors", "biceps", "calves", "cardiovascular system", "delts", "forearms", "glutes", "hamstrings", "lats", "levator scapulae", "pectorals", "quads", "serratus anterior", "spine", "traps", "triceps", "upperback"].includes(term) ? url1 : url2, options);
    const result = await response.json();
    await displayWorkouts(result);
    console.log(result);
  } catch (error) {
    console.error(error);
    resultsHeading.innerHTML = `<p>There are no search results. Try again!<p>`;
  }
};

async function getWorkoutByID(id) {
  const url = `https://exercisedb.p.rapidapi.com/exercises/exercise/${id}`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': "5627d96751msh8de08767b435f30p13a6d2jsnd6221616c103",
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    await displaySingleWorkout(result);
  } catch (error) {
    console.error(error);
    resultsHeading.innerHTML = `<p>There are no search results. Try again!<p>`;
  }
};

// Display functions
function displayWorkouts(results) {
  singleWorkout.innerHTML = '';
  workouts.innerHTML = results.map((result, i) => {
    return (
      `
    <div class='workouts-workout'>
      <img class="workouts-workout-img" src="${result.gifUrl}" alt="${result.name}"/>
      <div class='workouts-workout-info' data-workoutID="${result.id}">
        <h3>${result.name}</h3>
      </div>
    </div>
    `)
  }).join('');
};

function displaySingleWorkout(results) {
  singleWorkout.innerHTML = displayOneWorkout(results);
};

function displayMyFitness() {
  myFitnessDiv.innerHTML = myFitness.map((results) => {
    return displayOneWorkout(results);
  })
}

function displayOneWorkout(results) {
  return (
    `
    <hr />
    <div class="singleWorkout" data-workoutID="${[results.name, results.gifUrl, results.bodyPart, results.equipment, results.target]}">
      <h2 class="singleWorkout-heading">${results.name}</h2>
      <img class="singleWorkout-img" src="${results.gifUrl}" alt="${results.name}" />
      <div class="singleWorkout-info">
        <p class="singleWorkout-info-p">${results.bodyPart}</p>
        <p class="singleWorkout-info-p">${results.equipment}</p>
        <p class="singleWorkout-info-p">${results.target}</p>
      </div>
    </div>
    `
  )
};

function addFitness(object) {
  if (!localStorage.myFitness) {
    localStorage.setItem('myFitness', JSON.stringify(myFitness));
  }

  let newObject = object.split(",");
  let newWorkout = {
    name: newObject[0],
    bodyPart: newObject[2],
    equipment: newObject[3],
    gifUrl: newObject[1],
    target: newObject[4]
  }

  const checkArray = myFitness.map(e => e.name)
  if (!checkArray.includes(newWorkout.name)) {
    myFitness.push(newWorkout);
    Toastify({
      text: "Exercise has been added!",
      duration: 3000
    }).showToast();
  } else (
    Toastify({
      text: "You already added this exercise!",
      duration: 3000
    }).showToast()
  )

  localStorage.setItem('myFitness', JSON.stringify(myFitness));
};

function workoutInfo(func, e, data) {
  const workoutInfo = e
    .composedPath()
    .find((item) => item.classList.contains(`${data}`))
    .getAttribute('data-workoutID');

  func(workoutInfo)
};

function toggleDisplay(a, b, c, d) {
  resultsHeading.style.display = a;
  workouts.style.display = b;
  singleWorkout.style.display = c;
  myFitnessDiv.style.display = d;
}

// Event Listeners
submit.addEventListener('submit', (e) => {
  getWorkoutsBySearch(e);
  toggleDisplay('block', 'grid', 'block', 'none');
});

workouts.addEventListener('click', e => {
  workoutInfo(getWorkoutByID, e, "workouts-workout-info")
});

singleWorkout.addEventListener('click', e => {
  workoutInfo(addFitness, e, "singleWorkout")
})

myFitnessBtn.addEventListener('click', () => {
  displayMyFitness();
  toggleDisplay('none', 'none', 'none', 'block');
})