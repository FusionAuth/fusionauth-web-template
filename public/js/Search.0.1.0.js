'use strict';

class Search {
  #searchInput;
  #searchModal;
  #searchResults;

  constructor() {
    this.#searchModal = document.querySelector('[data-widget=search]');
    this.#searchModal.querySelectorAll('[data-widget="search-close"]')
      .forEach(e => e.addEventListener('click', () => this.closeSearch()));
    this.#searchResults = document.querySelector('[data-widget="search-results"] ul');
    this.#searchInput = document.querySelector('[data-widget="search-input"]')

    document.addEventListener('click', event => this.#handleClick(event));
    document.addEventListener('keydown', event => this.#handleKeyDown(event));
    document.addEventListener('keyup', event => this.#handleKeyUp(event));

    this.#handleResults({});
  }

  closeSearch() {
    this.#searchModal.classList.add('hidden');
  }

  #handleClick(event) {
    const button = event.target.closest('[data-widget="search-button"]');
    if (!button) {
      return;
    }

    this.#searchModal.classList.toggle('hidden');
  }

  #handleKeyDown(event) {
    if (event.key === 'Meta') {
      this.meta = true;
      return;
    } else if (event.key === 'k' && this.meta) {
      this.#searchModal.classList.toggle('hidden');
    }

    if (this.#searchModal.classList.contains('hidden')) {
      return;
    }

    if (event.key === 'Escape') {
      this.closeSearch();
    } else {
      this.#search();
    }

    //
    // if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    //   event.stopPropagation();
    //   event.preventDefault();
    //
    //   if (this.menu.classList.contains('hidden')) {
    //     this.openMenu();
    //   }
    //
    //   this.#highlightSiblingMenuItem(event.key === 'ArrowDown');
    // } else if (event.key === 'Enter') {
    //   const button = this.menu.querySelector('ul:not(.hidden) li.active button');
    //   if (button) {
    //     this.changeTheme(button.dataset.theme);
    //     this.closeMenu();
    //   }
    // }
  }

  #handleKeyUp(event) {
    if (event.key === 'Meta') {
      this.meta = false;
    }
  }

  #search() {
    fetch(
      'https://MN6ZCVNV21-dsn.algolia.net/1/indexes/website/query',
      {
        'body': JSON.stringify(
          {
            'params': `query=${this.#searchInput.value}`
          }
        ),
        'headers': {
          'Content-Type': 'application/json',
          'X-Algolia-Application-Id': 'MN6ZCVNV21',
          'X-Algolia-API-Key': 'e65ffc9f8bb352def753e7614de78416'
        },
        'method': 'POST'
      }
    ).then(response => {
      if (!response.ok) {
        // Ignore for now
      }

      return response.json();
    }).then(json => this.#handleResults(json));
  }

  #handleResults(json) {
    if (this.#searchInput.value.trim() !== '' && json.hits && json.hits.length > 0) {
      this.#searchResults.innerHTML = json.hits.map(hit => {
        return `<li>
        <a href="${hit.url}" class="bg-slate-100 rounded-md flex group items-center px-4 py-2 dark:bg-slate-700 dark:hover:bg-indigo-600 hover:bg-indigo-600 hover:text-white">
          <i class="bg-white border border-slate-900/10 fa-regular fa-hashtag mr-4 px-1 py-0.5 rounded-md shadow-sm text-slate-400 text-sm dark:bg-slate-600 group-hover:bg-indigo-600 group-hover:border-indigo-300 group-hover:text-white"></i>
          <span class="mr-auto text-slate-700 text-sm dark:text-slate-400 group-hover:text-white">
            ${hit.title}
          </span>
          <i class="fa-regular fa-angle-right"></i>
        </a>
      </li>`;
      }).join('\n');
    } else {
      this.#searchResults.innerHTML = `<li data-widget="search-no-results">
        <div class="font-semibold px-2">
          If you search it, they will come.
        </div>
      </li>`;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new Search());