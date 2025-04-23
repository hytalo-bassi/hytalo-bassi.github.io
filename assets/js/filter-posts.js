/**
 * Represents the filter options
 * @typedef {Object} FilterOptions
 * @property {string[]?} ofSubCategory - All the sub-categories to filter
 * @property {string[]?} containingTags - Filter based on category
 * @property {string?} matchTitle - Filter based on title
 */

/**
 * Creates the Filter options
 * @param {string[]?} ofSubCategory - All the sub-categories to filter
 * @param {string[]?} containingTags - Filter based on category
 * @param {string?} matchTitle - Filter based on title
 * @returns {FilterOptions} The filter
 */
function filterOptions_(ofSubCategory, containingTags, matchTitle) {
  return {
    ofSubCategory,
    containingTags,
    matchTitle
  }
}

function pass_item(item) {
  item.classList.remove("hidden")
  item.classList.add("card")
}

function hold_item(item) {
  item.classList.add("hidden")
  item.classList.remove("card")
}

/**
 * Filters item based on options. Filters from most generic to most specific.
 * @param {HTMLElement} item - DOM element to filter
 * @param {FilterOptions} filter_options - The filter options
 * @param {function(HTMLElement): void} pass - The function callback when an item matches the filter options
 * @param {function(HTMLElement): void} hold - The function callback when an item do not matches the filter options
 */
function filter_item(item, filter_options, pass = pass_item, hold = hold_item) {
  const fil = filter_options
  const item_data = {
    subCategory: item.getAttribute('data-post-subcategory'),
    tags: item.getAttribute('data-post-tags').split(" "),
    title: item.getAttribute('data-post-title').toLowerCase()
  }

  pass(item)

  if (fil.matchTitle && !item_data.title.includes(fil.matchTitle.toLowerCase())) {
    hold(item)
  }

  if (fil.ofSubCategory && item_data.subCategory) {
    if (!fil.ofSubCategory.includes(item_data.subCategory))
      hold(item)
  }

  if (fil.containingTags && against.tags) {
    if (!item_data.tags.every(tag => fil.containingTags.includes(tag))) {
      hold(item)
    }
  } 
}

/**
 * Filters items based on options. Filters from most generic to most specific.
 * @param {HTMLElement[]} items - DOM elements to filter
 * @param {FilterOptions} filter_options - The filter options
 */
function filter_items(items, filter_options) {
  items.forEach((item) => filter_item(item, filter_options))
}


/**
 * Returns an array of the checked inputs' id.
 * @param {HTMLInputElement[]} inputs - All the inputs to be checked
 * @return {string[]} The inputs' ids
 */
function checkedInputs(inputs) {
  const arr = []
  inputs.forEach(item => {
    if (item.checked)
      arr.push(item.id)
  })

  return arr
}

document.addEventListener("DOMContentLoaded", (ev) => {
  const ulPostFilter = document.querySelector("ul[data-post-filter]")
  const btnApplyFilter = document.getElementsByName("apply-filter")[0]
  // SubCtg: Sub-categories
  const textMatchInput = document.getElementById("title-filter")
  const filterSubCtg = document.querySelectorAll("input[data-post-filter-subcategory]")

  if (ulPostFilter && btnApplyFilter) {
    const liPosts = ulPostFilter.querySelectorAll("li[data-post-title]")
    // Tags is just all the tags available
    const tags = {}
    let matchTitle
    
    if (liPosts.length > 0) {
      liPosts.forEach((li) => {
        const post_tags = li.getAttribute("data-post-tags").split(" ")

        post_tags.forEach(tag => tags[tag] = true)
      })
    }

    // TODO: Pass all the tags to HTML

    btnApplyFilter.onclick = (e) => {
      const subcategories = checkedInputs(filterSubCtg)
      if (textMatchInput) {
        matchTitle = textMatchInput.value !== "" ? textMatchInput.value : null
      }

      // filter_items(liPosts, filterOptions_(subcategories, Object.keys(tags), matchTitle))
      filter_items(liPosts, filterOptions_(subcategories, null, matchTitle))
    }
  }
})
