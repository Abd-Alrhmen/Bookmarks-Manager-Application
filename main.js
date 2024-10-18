const bookmarksContainer = document.querySelector(".bookmarks");
const categorySuggestionsContainer = document.querySelector(".category-suggestions div");
const CategorySuggestionsContainer = document.querySelector(".category-buttons div");
const showAll = document.querySelector(".all");

localStorage.removeItem("active-category")
showAll.addEventListener("click", function(){
    localStorage.removeItem("active-category")
    displayBookmarks();
    const categoryButtons = document.querySelectorAll(".category-buttons div span");
    categoryButtons.forEach((button) => button.classList.remove("active"));
});
function saveBookmark() {
    const title = document.querySelector(".title").value.trim();
    const url = document.querySelector(".url").value.trim();
    const category = document.querySelector(".category").value.trim();
    // Validation
    if (!title || !url || !category) {
        alert("Please Fill In All Fields");
        return;
    }
    const allBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
    if (!allBookmarks[category]) allBookmarks[category] = [];
    allBookmarks[category].push({ title, url });
    localStorage.setItem("bookmarks", JSON.stringify(allBookmarks));
    // Empty The Form
    document.querySelectorAll("input").forEach((input) => input.value = "");
    // Update Bookmarks List
    displayBookmarks();
    // Update Suggestions List
    displayCategorySuggestions();
    // Update Buttons List
    displayCategoryButtons();
}
function displayBookmarks() {
    bookmarksContainer.innerHTML = "";
    const allBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {}; 
    for (const category in allBookmarks) {
        const categoryBookmarks = allBookmarks[category];
        categoryBookmarks.forEach((bookmark, index) => {
            const bookmarkElement = document.createElement("div");
            bookmarkElement.innerHTML = `
                <div class="cat">${category}</div>
                <div class="link"><a href="${bookmark.url}" target="_blank">${bookmark.title}</a></div>
                <button onclick="deleteBookmark('${category}', ${index})">Delete</button>
            `;
            bookmarksContainer.appendChild(bookmarkElement);
        });
    }
}
function filterBookmarksByCategory(category) {
    const allBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
    const categoryBookmarks = allBookmarks[category];
    bookmarksContainer.innerHTML = "";
    categoryBookmarks.forEach((bookmark, index) => {
        const bookmarkElement = document.createElement("div");
        bookmarkElement.innerHTML = `
            <span class="number">${index + 1}</span>
            <div class="link"><a href="${bookmark.url}" target="_blank">${bookmark.title}</a></div>
            <button onclick="deleteBookmark('${category}', ${index})">Delete</button>
        `;
        bookmarksContainer.appendChild(bookmarkElement);
    });
}
function displayCategorySuggestions() {
    const allBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
    const categories = Object.keys(allBookmarks);
    
    categorySuggestionsContainer.innerHTML = "";
    categories.forEach((category) => {
        const categoryElement = document.createElement("span");
        categoryElement.textContent = category;
        categoryElement.addEventListener("click", () => document.querySelector(".category").value = category);
        categorySuggestionsContainer.appendChild(categoryElement);
    });
}
function displayCategoryButtons() {
    const allBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
    const categories = Object.keys(allBookmarks);

    CategorySuggestionsContainer.innerHTML = "";
    categories.forEach((category) => {
        const categoryElement = document.createElement("span");
        categoryElement.textContent = category;
        categoryElement.addEventListener("click", function() {
            filterBookmarksByCategory(category);
            localStorage.setItem("active-category", category);
            // Remove Active from All Buttons
            const categoryButtons = document.querySelectorAll(".category-buttons div span");
            categoryButtons.forEach((button) => button.classList.remove("active"));
            // Add Active Class To the Clicked Button
            this.classList.add("active");
        });
        const activeCategory = localStorage.getItem("active-category");
        if(activeCategory === category ) categoryElement.classList.add("active");
        CategorySuggestionsContainer.appendChild(categoryElement);
    });
}

displayCategorySuggestions();
displayCategoryButtons();
displayBookmarks();

function deleteBookmark(category, index) {
    const allBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
    allBookmarks[category].splice(index, 1);
    //If The Category is Empty Rimove The Category
    if(allBookmarks[category].length ===0) {
        delete allBookmarks[category];
        localStorage.removeItem("active-category")
    };
    localStorage.setItem("bookmarks", JSON.stringify(allBookmarks));
    if(allBookmarks[category] && localStorage.getItem("active-category")){
        filterBookmarksByCategory(category)
    }else{
        displayBookmarks();
    }
    displayCategoryButtons();
    displayCategorySuggestions();
}
