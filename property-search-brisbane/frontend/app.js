const app = document.getElementById('app');

function renderApp() {
  app.innerHTML = `
    <header>
      <h1>Property Search Brisbane</h1>
      <p>Find the perfect property in Brisbane with up-to-date listings and market insights.</p>
    </header>
    <main>
      <section class="search">
        <h2>Search Listings</h2>
        <form id="search-form">
          <label>
            Suburb
            <input type="text" name="suburb" placeholder="e.g., West End" required />
          </label>
          <label>
            Price Range
            <select name="price">
              <option value="any">Any</option>
              <option value="0-500000">$0 - $500k</option>
              <option value="500000-1000000">$500k - $1m</option>
              <option value="1000000+">$1m+</option>
            </select>
          </label>
          <button type="submit">Search</button>
        </form>
      </section>
      <section class="results" id="results">
        <h2>Results</h2>
        <p>Enter a suburb and price range to begin your search.</p>
      </section>
    </main>
  `;

  const form = document.getElementById('search-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const suburb = formData.get('suburb');
    const price = formData.get('price');

    const results = document.getElementById('results');
    results.innerHTML = `
      <h2>Results</h2>
      <p>Showing listings in <strong>${suburb}</strong> with price range <strong>${price}</strong>.</p>
      <p>This is a placeholder – connect to the backend API to load live data.</p>
    `;
  });
}

renderApp();
