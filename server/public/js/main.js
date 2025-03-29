
// MovieBanner Class to handle movie data and banner transitions
class MovieBanner {
  constructor(User) {
    this.bg1 = document.getElementById("bannerBg1") || '';
    this.bg2 = document.getElementById("bannerBg2") || '';
    this.Query = document.querySelectorAll("#search-navbar") || '';
    this.ResultDiv = document.getElementById("ResultDiv") || '';
    this.ToHide = document.getElementById("Hide") || '';
    this.SignUpBtn = document.getElementById("SignUpBtn") || '';
    this.LoginBtn = document.getElementById("SignInBtn") || '';
    this.ProfileBtn = document.getElementById("ProfileBtn") || '';
    this.ResultDivVisible = false;
    this.currentIndex = 0;
    this.isBg1Visible = true;
    this.movies = [];
    this.User = User;
    this.TrendingSection = document.getElementById("TrendingScrollbar") || '';
    this.BannerActionBtns = document.querySelectorAll("#ActionBtns button") || ''
    this.AddToWishBtns = document.querySelectorAll(".AddingBtn") || ''
    this.DescBtns = document.querySelectorAll(".DescBtn") || ''
    this.AllMovies = []

    this.Init()
    // Fetch movie data from the server
    this.fetchMovies();
    this.fetchAllMovies()
    this.addEventListeners();
  }

  Init() {
    this.ProfileBtn.style.display = this.User ? "block" : "none";
    this.LoginBtn.style.display = this.User ? "none" : "block";
    this.SignUpBtn.style.display = this.User ? "none" : "block";


    this.AddToWishBtns.forEach((Btn) => {
      Btn.addEventListener("click", (e) => {
        const button = e.target.closest("button"); // Get the closest button element
        if (button) {
          alert(`Movie Added: ${button.id}`);
        }
      });
    });
    
    

    this.ResultDiv.addEventListener("click", (e) => {
      if (e.target.closest(".AddingBtn")) {
          const movieId = e.target.closest(".AddingBtn").id;
          alert("Movie Added: " + movieId);
      }
  });
  

    this.DescBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        window.location.href = `/movie/${e.target.id}`
      })
    })
  }

  addEventListeners() {
    this.Query.forEach((q) => {
      q.addEventListener("input", (e) => this.SearchMovies(e));

    });

  }
  // Method to fetch movie data from the server
  async fetchMovies() {
    try {
      // Fetch movie data from the server (assuming '/api/movies' is the endpoint)
      const response = await fetch('/movies');
      const movies = await response.json();

      if (movies && movies.length > 0) {
        this.movies = movies;
        this.updateBanner();
        setInterval(() => {
          this.autoChangeBanner();
        }, 5000); // Auto change every 5 seconds
      }
    } catch (error) {
      console.error("Error fetching movie data:", error);
    }
  }

  async fetchAllMovies(){
    try {
      // Fetch movie data from the server (assuming '/api/movies' is the endpoint)
      const data = await fetch('/all-movies');
      const AllMovie = await data.json();

      if (AllMovie && AllMovie.length > 0) {
        this.AllMovies = AllMovie;
      }

    } catch (error) {
      console.error("Error fetching movie data:", error);
    }
  }

  // Method to update the banner with the current movie data
  updateBanner() {
    const movie = this.movies[this.currentIndex];

    // Swap Backgrounds Smoothly
    if (this.isBg1Visible) {
      this.bg2.style.backgroundImage = `url(${movie.posterUrl})`;
      gsap.to(this.bg1, { opacity: 0, duration: 1 });
      gsap.to(this.bg2, { opacity: 1, duration: 1 });
    } else {
      this.bg1.style.backgroundImage = `url(${movie.posterUrl})`;
      gsap.to(this.bg2, { opacity: 0, duration: 1 });
      gsap.to(this.bg1, { opacity: 1, duration: 1 });
    }

    this.isBg1Visible = !this.isBg1Visible;

    // Update Text Content (Movie Title and Description)
    document.getElementById("movieTitle").innerText = movie.title;
    document.getElementById("movieDesc").innerText = movie.description;

    // Update Categories
    const categoryList = document.getElementById("categoryList");
    categoryList.innerHTML = "";
    movie.category.forEach((category) => {
      const span = document.createElement("span");
      span.className = "bg-blue-500 px-2 py-1 text-sm rounded-md";
      span.innerText = category;
      categoryList.appendChild(span);
    });

    this.BannerActionBtns.forEach((btn) => {
      btn.id = movie._id
    })


    // GSAP Animations for Text & Buttons
    gsap.from("#movieTitle", { opacity: 0, x: -50, duration: 1 });
    gsap.from("#movieDesc", { opacity: 0, y: 20, duration: 1, delay: 0.2 });
    gsap.from("#categoryList span", {
      opacity: 0,
      scale: 0.5,
      duration: 0.8,
      stagger: 0.2,
      delay: 0.5,
    });
  }



  // Method to auto change the banner to the next movie
  autoChangeBanner() {
    this.currentIndex = (this.currentIndex + 1) % this.movies.length;
    this.updateBanner();
  }



  SearchMovies(e) {
    e.preventDefault();
    const query = e.target.value.trim().toLowerCase();

    // If the search box is cleared, show all movies again
    if (query.length === 0) {
        this.ResultDiv.innerHTML = "";
        this.ResultDiv.className = "";
        this.ToHide.style.display = "none";
        this.ResultDivVisible = false;
        return; // Stop execution here
    }

    // Otherwise, perform the search
    this.ResultDiv.innerHTML = "";
    this.ToHide.style.display = "block";
    this.ResultDiv.className = 'p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 absolute rounded left-0 right-0 bg-gray-800 bg-opacity-90 z-50 mt-2';
    this.ResultDivVisible = true;

    const result = this.AllMovies.filter((movie) =>
        movie.title.toLowerCase().includes(query)
    );


    // Render the filtered movies
    result.forEach((movie) => {
        const div = document.createElement("div");
        div.className = "w-64 h-96 sm:w-80 lg:w-64 MoviCard h-48 rounded-lg overflow-hidden relative shadow-lg transition-transform duration-300 transform hover:scale-105";
        div.innerHTML = `
            <div
                class="absolute inset-0 bg-cover bg-center"
                style="background-image: url('${movie.posterUrl}'); background-position: center; background-size: cover;"
            ></div>

            <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent p-4">
                <div class="absolute bottom-0 left-0 p-4 w-full bg-gradient-to-t from-black to-transparent">
                    <h4 class="text-lg font-bold text-white">${movie.title}</h4>
                    <div id="CategoryContainer" class="text-sm text-gray-300 font-bold">
                        ${movie.category
                            .map((genre) => `<span class="bg-blue-500 px-2 py-1 text-sm rounded-md">${genre}</span>`)
                            .join("")}
                    </div>
                    <div class="flex justify-between items-center mt-3">
                        <button
                            class="text-red-600 hover:text-red-900 transition-colors AddingBtn duration-300"
                            id="${movie._id}"
                        >
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 2a2 2 0 0 0-2 2v18l8-4 8 4V4a2 2 0 0 0-2-2H6z"/>
                            </svg>
                        </button>

                        <button
                            class="bg-red-600 hover:bg-red-800 text-white text-sm px-3 py-1 rounded transition-all duration-300"
                            id="${movie._id}"
                            onclick="window.location.href = '/movie/${movie._id}'"
                        >
                            More Info
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.ResultDiv.appendChild(div);
    });
}

}




document.addEventListener("DOMContentLoaded", () => {
  function getCookie(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  const User = getCookie("token") || null;

  // Initialize the MovieBanner class
  new MovieBanner(User);
})