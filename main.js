// To ensure Cypress tests work as expeded, add any code/functions that you would like to run on page load inside this function

async function run() {
    // Add code you want to run on page load here
    const select = document.querySelector(".select__movie select");
    const userReview = document.querySelector(".your__review form");
    const resetReview = document.querySelector("#reset-reviews");
    const people = document.querySelector("#show-people");
  
    select.addEventListener("change", changeFilm);
    userReview.addEventListener("submit", submitReview);
    resetReview.addEventListener("click", resetUserReviews);
    people.addEventListener("click", showPeople);
  
    const BASE_URL = "https://ghibliapi.herokuapp.com";
    let FILMS = [];
  
    try {
      FILMS = await getFilms();
      displayFilms(FILMS);
    } catch (err) {
      console.error(err);
    }
  
    async function getFilms() {
      try {
        const res = await fetch(`${BASE_URL}/films`);
        return await res.json();
      } catch (err) {
        console.error(err);
      }
    }
  
    function displayFilms(films) {
      let markup = "<option></option>";
  
      films.forEach((film) => {
        markup += `<option value="${film.id}">${film.title}</option>`;
      });
  
      select.innerHTML = markup;
    }
  
    function displayMain(film) {
      const container = document.querySelector("#display-info");
  
      let markup = "";
      if (film)
        markup = `
        <h3>${film.title}</h3>
        <p>${film.release_date}</p>
        <p>${film.description}</p>
      `;
  
      container.innerHTML = markup;
    }
  
    function changeFilm(e) {
      const id = e.target.value;
      const film = FILMS.find((film) => film.id === id);
      displayMain(film);
      const peopleList = document.querySelector(".movie__people ol");
      peopleList.innerHTML = "";
    }
  
    function submitReview(e) {
      e.preventDefault();
      const review = document.querySelector("#review");
      // const ul = document.querySelector("#reviews ul");
      const yourReview = document.querySelector(".your__review ul");
      const currentFilm = getSelectedMovie();
  
      if (!currentFilm) return alert("Please select a movie first");
  
      // ul.innerHTML += `<li><strong>${currentFilm.title}:</strong>${review.value}</li>`;
      yourReview.innerHTML += `<li><strong>${currentFilm.title}:</strong>${review.value}</li>`;
      review.value = "";
    }
  
    function getSelectedMovie() {
      return FILMS.find((film) => select.value === film.id);
    }
  
    function resetUserReviews() {
      // const ul = document.querySelector("#reviews ul");
      const yourReview = document.querySelector(".your__review ul");
      // ul.innerHTML = "";
      yourReview.innerHTML = "";
    }
  
    async function showPeople() {
      const peopleList = document.querySelector(".movie__people ol");
      try {
        const res = await fetch(`${BASE_URL}/people`);
        const resJson = await res.json();
        const currentFilm = select.value;
        const people = resJson.filter((p) =>
          p.films.includes(`${BASE_URL}/films/${currentFilm}`)
        );
  
        const markup = people.map((p) => `<li>${p.name}</li>`);
  
        peopleList.innerHTML = markup.join(" ");
      } catch (error) {}
    }
  }
  
  // This function will "pause" the functionality expected on load long enough to allow Cypress to fully load
  // So that testing can work as expected for now
  // A non-hacky solution is being researched
  
  setTimeout(run, 1000);