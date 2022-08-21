const search__input = document.getElementById('search'),
    submit = document.getElementById('submit'),
    random__btn = document.getElementById('random__btn'),
    search__btn = document.getElementById('search__btn'),
    result__heading = document.getElementById('result__heading'),
    meals__el = document.getElementById('meals'),
    single__meal = document.getElementById('single-meal');

//Search meal and featch from API
function searchMeal(e) {
    e.preventDefault();

    single__meal.innerHTML = '';

    const term = search__input.value;

    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
                result__heading.innerHTML = `<h2>Search results for ${term}:</h2>`;

                if (data.meals === null) {
                    result__heading.innerHTML = `<p class="error">There are no search results. Try again!</p>`;
                    meals__el.innerHTML = "";
                } else {
                    meals__el.innerHTML = data.meals.map(meal => `
                    <div class="meal">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                        <div class="meal-info" data-mealID="${meal.idMeal}">
                            <h3>${meal.strMeal}</h3>
                        </div>
                    </div>
                `)
                        .join('');
                }
            });

        //Clear search text
        search__input.value = ''
    } else {
        alert('Please enter a search term');
    }
}

//Fetch meal by id
function getMealId(id) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];

            addMealToDOM(meal);
        })
}

//Fetch random meal from API
function getRandomMeal() {
    //Clear meals and heading
    meals__el.innerHTML = '';
    result__heading.innerHTML = '';

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => addMealToDOM(data.meals[0]))
}

//Add meal to DOM
function addMealToDOM(meal__data) {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
        if (meal__data[`strIngredient${i}`]) {
            ingredients.push(`${meal__data[`strIngredient${i}`]} - ${meal__data[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }

    console.log(meal__data);

    single__meal.innerHTML = `
        <div class="single__meal">
            <h1>${meal__data.strMeal}</h1>
            <img src="${meal__data.strMealThumb}" alt="${meal__data.strMeal}" />
            <div class="single__meal-info">
                ${meal__data.strCategory ? `<p>Category: ${meal__data.strCategory}</p>` : ''}
                ${meal__data.strArea ? `<p>Country: ${meal__data.strArea}</p>` : ''}
            </div>
            <div class="main">
                <p>${meal__data.strInstructions}</p>
                <h2>Ingredients</h2>
                <ul>
                    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

submit.addEventListener('submit', searchMeal);
random__btn.addEventListener('click', getRandomMeal);

meals__el.addEventListener('click', e => {
    const meal__info = e.path.find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });

    if (meal__info) {
        const meal__id = meal__info.getAttribute('data-mealID');
        getMealId(meal__id);
    }
});