var popupDiv = null;
var postArticle = null;

function tocAction(e) {
  if (popupDiv === null || postArticle === null)
    return

  if (e !== undefined) e.stopPropagation();

  popupDiv.classList.toggle("popup");
  popupDiv.classList.toggle("hidden");

  postArticle.classList.toggle("blur");
}

// Based on https://stackoverflow.com/questions/16006583/capturing-ctrlz-key-combination-in-javascript
function keyPressHandler(e) {
  const isPopupShown = popupDiv.classList.contains("popup");

  if (e.shiftKey && e.keyCode === 84)
    tocAction(e);

  if (e.key === "Escape" && isPopupShown)
    tocAction(e);
}

function loadEvents() {
  popupDiv = document.getElementById("popup");
  postArticle = document.getElementById("post-article");

  const tocButton = document.getElementById("toc-button");
 
  tocButton.addEventListener("click", (e) => tocAction(e))

  window.addEventListener("keydown", (e) => keyPressHandler(e))

  console.log(tocButton);
}

// Handle Events

if (document.readyState !== 'loading')
  loadEvents();
else
  document.addEventListener('DOMContentLoaded', () => {
     loadEvents();
  });

