const search = document.querySelector('#search');
const submit = document.querySelector('#submit');
const random = document.querySelector('#random');
const mealsEl = document.querySelector('#meals');
const resultHeading = document.querySelector('#result-heading');
const single_mealEl = document.querySelector('#single-meal');

//Function to search for meal from API(fetch meal)
//Prevent default submit behaviour
function searchMeal(e) {
    e.preventDefault();

    //Clear single meal
    single_mealEl.innerHTML = '';

    //Get the keyword on search(what was typed in)
    const term = search.value;

    //Check if search bar is empty
    if(term.trim()){
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            resultHeading.innerHTML = `<h2>Search results for "${term}":</h2>`;

            if(data.meals === null){
                resultHeading.innerHTML = '<h3>Your search did not return any results, Please another keyword</h3>';
            } else{
                mealsEl.innerHTML = data.meals.map(meal => 
                    `<div class="meal">
                    <div class="meal-info" data-mealID="${meal.idMeal}">
                        <h3>${meal.strMeal}</h3>
                    </div>
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                    </div>`
                    ).join('');
            }
        });
        //Clear search text after providing values
        search.value = '';
    } else{
        alert('Please enter a keyword in the search bar');
    }
}

//Function to get meal by id
function getMealById(mealID){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0];
    
        addMealToDOM(meal);
    });
}

//Get a random meal
function getRandomMeal() {
    //Clear meals and heading if search was done already
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0];

        addMealToDOM(meal);
    });
}

//function to add meal to dom
function addMealToDOM(meal){
    const ingredients = [];

    for(let i = 1; i <= 20; i++){
        if(meal[`strIngredient${i}`]){
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else{
            break; 
        }
    }

    // console.log(ingredients)

    // update the single meal element on DOM
    single_mealEl.innerHTML = `
    <div class="single-meal">
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <div class="single-meal-info">
            ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
            ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
        </div>
        <div class="main">
            <p>${meal.strInstructions}</p>
            <h2>Ingredients:</h2>
            <ul>
                ${ingredients.map(ingredient => 
                    `<li>${ingredient}</li>`
                    ).join('')
                }
            </ul>
        </div>
    </div>
    `;
}

//Event listener for searching
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

//event listener to fetch single meal info on click
mealsEl.addEventListener('click', e => {
    //this will find out if meal-info div belongs to clicked element
    //this will go through all the child elements
    const mealInfo = e.path.find(item => {
        if(item.classList){
            return item.classList.contains('meal-info');
        }else{
            return false;
        }
    });

    if(mealInfo){
        const mealID = mealInfo.getAttribute('data-mealID');
        getMealById(mealID);
    }
});