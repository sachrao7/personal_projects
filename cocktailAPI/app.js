let currentIndex = 0; // Keep track of the current drink index

function searchCocktail() {
    const input = document.getElementById('drinkInput').value;
    const resultContainer = document.getElementById('result');
    const nextButton = document.getElementById('nextButton');

    // Clear previous results and reset index
    currentIndex = 0;
    resultContainer.innerHTML = '';
    nextButton.style.display = 'none';

    // Fetch cocktail data
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${input}`)
        .then(response => response.json())
        .then(data => {
            if (data.drinks) {
                displayCocktail(data.drinks[currentIndex]);
                // Show next button if there are more drinks
                if (data.drinks.length > 1) {
                    nextButton.style.display = 'block';
                }
            } else {
                resultContainer.innerHTML = '<p>No results found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            resultContainer.innerHTML = '<p>An error occurred. Please try again later.</p>';
        });
}

function getNextCocktail() {
    currentIndex++;
    const input = document.getElementById('drinkInput').value;
    const resultContainer = document.getElementById('result');

    // Fetch cocktail data
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${input}`)
        .then(response => response.json())
        .then(data => {
            if (data.drinks && data.drinks[currentIndex]) {
                displayCocktail(data.drinks[currentIndex]);
            } else {
                // If no more drinks, go back to the first one
                currentIndex = 0;
                displayCocktail(data.drinks[currentIndex]);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            resultContainer.innerHTML = '<p>An error occurred. Please try again later.</p>';
        });
}

function displayCocktail(drink) {
    const resultContainer = document.getElementById('result');
    const drinkName = drink.strDrink;
    const drinkImage = drink.strDrinkThumb;
    const drinkInstructions = drink.strInstructions;
    const ingredients = getIngredients(drink);

    // Display results
    resultContainer.innerHTML = `
        <h2>${drinkName}</h2>
        <img src="${drinkImage}" alt="${drinkName}">
        <h3>Ingredients:</h3>
        <ul>${ingredients}</ul>
        <h3>Instructions:</h3>
        <p>${drinkInstructions}</p>
    `;
}
function getIngredients(drink) {
    const ingredients = [];

    // Loop through ingredients (up to 15 ingredients)
    for (let i = 1; i <= 15; i++) {
        const ingredient = drink[`strIngredient${i}`];
        const measure = drink[`strMeasure${i}`];

        // Stop if no more ingredients
        if (!ingredient) break;

        ingredients.push(`<li>${measure} ${ingredient}</li>`);
    }

    return ingredients.join('');
}