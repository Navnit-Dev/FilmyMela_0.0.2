
alert("JS Loaded")
function addDownloadLink() {
    let container = document.getElementById("download-links-C");
    let newInput = document.createElement("div");
    newInput.id = "download-links"
    
    newInput.innerHTML = `<div class="flex space-x-2 mt-2 items-center">
<input type="text" name="quality[]" class="w-1/3 p-2.5 border quality rounded-lg dark:bg-gray-600 dark:text-white" placeholder="720p">
<input type="text" name="link[]" class="w-2/3 p-2.5 border link rounded-lg dark:bg-gray-600 dark:text-white" placeholder="https://downloadlink.com">
<button onclick="this.parentElement.remove();" class="w-6 h-6 rounded bg-red-500 text-white">    <i class="fa-solid fa-trash"></i>
</button> </div>
`;
    container.appendChild(newInput);
}


// // To Display Modal 
//  function DisplayModal(id){
//     const movieData = <%- JSON.stringify(movie) %>;
//     const ToEdit = movieData.filter(()=>{
//         movieData._id == id
//     })

//     console.log(ToEdit)
// }


async function fetchMovieData(movieId) {
    const form = document.getElementById("MovieForm")
    const MovieId = document.getElementById("Mid");
    const FormTitle = document.getElementById("FormTitle");
    const title = document.getElementById("title")
    const posterUrl = document.getElementById("posterUrl")
    const desc = document.getElementById("description");
    const categories = document.getElementById("categories")
    const screenshots = document.getElementById("screenshots");
    const industry = document.getElementById("industry");
    const languages = document.getElementById("languages");
    const starcasts = document.getElementById("star-casts");
    const rating = document.getElementById("rating");
    const download = document.getElementById("download-links-C")
    const watchlink = document.getElementById("watchonline");
    const year = document.getElementById("year")
    const position = document.getElementById("position")

    try {
        const response = await fetch(`/movie/${movieId}`, {
            headers: { "X-Requested-With": "XMLHttpRequest" } // Makes it an AJAX request
        });

        const result = await response.json();
        const movie = await result.data

        if (result.success) {
            console.log("Movie Data:", result.data); // Use movie data
            form.setAttribute("data-method","put");
            MovieId.parentElement.classList.remove("hidden")
            MovieId.value = movie._id
            FormTitle.textContent = "Update Movie"
            title.value = movie.title;
            posterUrl.value = movie.posterUrl
            desc.value = movie.description;
            categories.value = movie.category
            movie.screenshots.forEach((link)=>{
                const shortenedURL = link.length > 20 ? link.substring(0, 10) + "..." : link;
                screenshots.value += `${shortenedURL},`
            })
            industry.value = movie.industry ? movie.industry : "Undefined"

            languages.value = movie.languages ? movie.languages :  "undefined"
            starcasts.value = movie.actors ? movie.actors :  "undefined"
            rating.value = movie.rating ? movie.rating :  "undefined"

            download.innerHTML = " ";
            Object.entries(movie.downloadLinks).forEach(([quality,link])=>{
                const div = document.createElement("div")
                div.id = "download-links"

                div.innerHTML = `
                <div class="flex space-x-2 mt-2 items-center">
                <input
                      type="text"
                      id="quality"
                      name="quality[]"
                      value="${quality}"
                      class="w-1/3 p-2.5 border rounded-lg dark:bg-gray-600 dark:text-white"
                    />
                    <input
                      type="text"
                      id="link"
                      value="${link}"
                      name="link[]"
                      class="w-2/3 p-2.5 border rounded-lg dark:bg-gray-600 dark:text-white"
                    /></div>`

                    download.appendChild(div)
            });

            watchlink.value = movie.watch  ? movie.watch  :"undefined"
            year.value = movie.year.toISOString().split("T")[0]
            position.value =  movie.position ? movie.position  :"undefined"
        } else {
            console.error("Error:", result.message);
        }
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

const checkboxes = document.querySelectorAll("#checkbox-table-search-1");
const deleteButton = document.getElementById("deleteSpeedDial");

// Function to show/hide delete button
function toggleDeleteButton() {
    const anyChecked = [...checkboxes].some(checkbox => checkbox.checked);
    deleteButton.classList.toggle("hidden", !anyChecked);
}

// Event listener for checkboxes
checkboxes.forEach(checkbox => {
    checkbox.addEventListener("change", toggleDeleteButton);
});

//Trigger Confirmation
function ShowConfirmation(){
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, proceed!",
    cancelButtonText: "No, cancel"
}).then((result) => {
    if (result.isConfirmed) {
        // ✅ User clicked "Yes"
        Swal.fire("Success!", "Movie Deleted Successfully", "success");

        // 👉 Perform your action here (e.g., delete, update, etc.)
        sendSelectedData()  
    } else {
        // ❌ User clicked "No"
        Swal.fire("Cancelled", "Movie Not Deleted", "error");
    }
});
}

 // Function to send selected mId values to server
 function sendSelectedData() {
    const selectedIds = [...document.querySelectorAll("#checkbox-table-search-1:checked")]
        .map(checkbox => checkbox.getAttribute("data-mId"));

    if (selectedIds.length === 0) return;

    fetch("/admin/delete-movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieIds: selectedIds })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Server Response:", data);
        // Remove deleted checkboxes from UI
        document.querySelectorAll("#checkbox-table-search-1:checked").forEach(checkbox => {
            checkbox.parentElement.parentElement.parentElement.remove();
        });
        deleteButton.classList.add("hidden"); // Hide button after deletion
    })
    .catch(error => console.error("Error:", error));
}
//DropDown
const dropdownMenu = document.getElementById("dropdownAction")
const dropdownItems = document.querySelectorAll(".Dropdown-item")
const movieContainer = document.getElementById("MovieContainer")
dropdownItems.forEach((item) => {
    item.addEventListener("click", async function (e) {
      e.preventDefault();
      const filter = this.getAttribute("data-filter");

      // Fetch filtered movies
      const response = await fetch(`/movies/filter/${filter}`);
      const movies = await response.json();

      // Clear existing movies
      movieContainer.innerHTML = "";
      movies.forEach((movie)=>{
        const tr = document.createElement("tr")
        tr.classList.add("bg-white" ,"border-b" ,"dark:bg-gray-800", "dark:border-gray-700", "border-gray-200", "hover:bg-gray-50", "dark:hover:bg-gray-600")
        tr.innerHTML = `
            <td class="w-4 p-4">
                <div class="flex items-center">
                  <input
                    id="checkbox-table-search-1"
                    data-mId="${ movie._id }"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label for="checkbox-table-search-1" class="sr-only"
                    >checkbox</label
                  >
                </div>
              </td>
              <th
                scope="row"
                class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
              >
                <img
                  class="w-10 h-10 rounded-full"
                  src="${ movie.posterUrl }"
                  alt="Jese image"
                />
                <div class="ps-3">
                  <div class="text-base font-semibold">${ movie.title}</div>
                  <div class="font-normal text-gray-500">
                     ${movie.category.map(cat => `<span class="bg-gray-300 rounded px-2 py-1 mr-2">${cat}</span>`).join("")}
                  </div>
                </div>
              </th>
              <td class="px-6 py-4">${ movie.industry }</td>
              <td class="px-6 py-4">

              ${movie.position === "trending" ? `
                <div class="flex items-center">
                  <div class="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>
                  ${movie.position}
                </div>
              ` : `
                <div class="flex items-center">
                  <div class="h-2.5 w-2.5 rounded-full bg-red-500 me-2"></div>
                  ${movie.position}
                </div>
              `}
              </td>
              <td class="px-6 py-4">
                <a
                  id="${movie._id}"
                  href="#"
                  onclick="fetchMovieData('${movie._id}')"
                  type="button"
                  data-modal-target="editUserModal"
                  data-modal-show="editUserModal"
                  class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >Edit user</a
                >
              </td>
              <td class="px-6 py-4">${movie.sequence}</td>
        `

        movieContainer.appendChild(tr)
      })
    console.log(movies)
      dropdownMenu.classList.add("hidden"); // Hide dropdown after selection
    });
  });


  //Handle Add Movie Form 
  

  document.getElementById("MovieForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent form reload
    const method = document.getElementById("MovieForm").getAttribute('data-method').toUpperCase()
    const Id = document.getElementById("Mid").value
    const Url = Id ? `/admin/update-movie/${Id}` : '/admin/add-movie';

    // Collect form data
    const formData = {
        title: document.getElementById("title").value,
        posterUrl:document.getElementById("posterUrl").value,
        rating: document.getElementById("rating").value,
        description: document.getElementById("description").value,
        category: document.getElementById("categories").value.split(",").map(cat => cat.trim()),
        screenshots: document.getElementById("screenshots").value.split(",").map(url => url.trim()),
        industry: document.getElementById("industry").value,
        languages: document.getElementById("languages").value.split(",").map(lang => lang.trim()),
        actors: document.getElementById("star-casts").value.split(",").map(actor => actor.trim()),
        downloadLinks: getDownloadLinks(), // Gets download links as an object
        watch: document.getElementById("watchonline").value,
        year:document.getElementById("year").value,
        position: document.getElementById("position").value
    };
    console.log(formData)
    try {
        const response = await fetch(`${Url}`, {
            method: `${method}`,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        
        if (response.ok) {
          console.log(response.action)
          const title = result.action === "added" ? "Added" : "Updated";
          Swal.fire({
            icon: 'success',
            title: `${title}!`,
            text: `${result.message}`,
            confirmButtonText: "OK"
        });
        
            document.getElementById("MovieForm").reset(); // Clear form
            document.getElementById("downloadLinksList").innerHTML = ""; // Clear UI list
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops!',
            text: 'Something went wrong!',
            confirmButtonText: "OK"
        });
        console.log(result.message)        
        }
    } catch (error) {
        console.log("Failed to submit the form!");
    }
});

// Function to get download links dynamically and store them as a key-value object
function getDownloadLinks() {
  const links = {};
  document.querySelectorAll("#download-links .flex").forEach(div => {
      const qualityInput = div.querySelector(".quality");
      const linkInput = div.querySelector(".link");

      if (qualityInput && linkInput) {
          const quality = qualityInput.value.trim();
          const url = linkInput.value.trim();
          if (quality && url) {
              links[quality] = url; // Store as key-value pair
          }
      }
  });
  return links; // Example: { "720p": "https://download.com/720p", "1080p": "https://download.com/1080p" }
}


function AddMovieForm(){
  const Form  =  document.getElementById("MovieForm")
  const FormTitle = document.getElementById("FormTitle");
  const title = document.getElementById("title")
  const download = document.getElementById("download-links")
  const MovieId = document.getElementById("Mid");


  Form.reset();
  Form.setAttribute("data-method","post")
  FormTitle.textContent = "Add Movie";
  MovieId.parentElement.classList.add("hidden")
  MovieId.value = ''
  download.innerHTML= ` <div class="flex space-x-2 mt-2">
                <input
                  type="text"
                  id="quality"
                  name="quality[]"
                  class="w-1/3 p-2.5 border quality rounded-lg dark:bg-gray-600 dark:text-white"
                  placeholder="720p"
                />
                <input
                  type="text"
                  id="link"
                  name="link[]"
                  class="w-2/3 p-2.5 link border rounded-lg dark:bg-gray-600 dark:text-white"
                  placeholder="https://downloadlink.com"
                />
              </div>`
}


// To Display Result 
let movies = []; // Store movie data globally

// Fetch movie data once when the page loads
async function fetchMovies() {
    try {
        const response = await fetch('/get-all-movie');
        movies = await response.json();
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}

// Search function
async function ShowResult(e) {
    const query = e.target.value.trim().toLowerCase();
    const movieContainer = document.getElementById("MovieContainer");
    
    // Clear old results
    movieContainer.innerHTML = "";

    // Filter movies based on the search query
    const ToDisplay = query 
        ? movies.filter(m => m.title.toLowerCase().includes(query)) 
        : movies;

    // Append filtered movies
    ToDisplay.forEach((movie) => {
        const tr = document.createElement("tr");
        tr.classList.add(
            "bg-white", "border-b", "dark:bg-gray-800", "dark:border-gray-700",
            "border-gray-200", "hover:bg-gray-50", "dark:hover:bg-gray-600"
        );
        tr.innerHTML = `
            <td class="w-4 p-4">
                <div class="flex items-center">
                    <input
                        data-mId="${ movie._id }"
                        type="checkbox"
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label class="sr-only">checkbox</label>
                </div>
            </td>
            <th scope="row" class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                <img class="w-10 h-10 rounded-full" src="${ movie.posterUrl }" alt="Movie Poster" />
                <div class="ps-3">
                    <div class="text-base font-semibold">${ movie.title }</div>
                    <div class="font-normal text-gray-500">
                        ${movie.category.map(cat => `<span class="bg-gray-300 rounded px-2 py-1 mr-2">${cat}</span>`).join("")}
                    </div>
                </div>
            </th>
            <td class="px-6 py-4">${ movie.industry }</td>
            <td class="px-6 py-4">
                <div class="flex items-center">
                    <div class="h-2.5 w-2.5 rounded-full ${movie.position === 'trending' ? 'bg-green-500' : 'bg-red-500'} me-2"></div>
                    ${movie.position}
                </div>
            </td>
            <td class="px-6 py-4">
                <a id="${movie._id}" href="#" onclick="fetchMovieData('${movie._id}')" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                    Edit Movie
                </a>
            </td>
            <td class="px-6 py-4">${movie.sequence}</td>
        `;

        movieContainer.appendChild(tr);
    });
}

// Fetch movies once when the page loads
fetchMovies();
