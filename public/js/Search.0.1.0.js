'use strict';

class Search {
  #moveX;
  #moveY;
  #searchInput;
  #searchModal;
  #searchResults;

  constructor() {
    this.#searchModal = document.querySelector('[data-widget=search]');
    this.#searchModal.querySelectorAll('[data-widget="search-close"]');
    this.#searchModal.addEventListener('mousemove', event => this.#handleMouseMove(event));
    this.#searchResults = document.querySelector('[data-widget="search-results"] ul');
    this.#searchInput = document.querySelector('[data-widget="search-input"]');

    const debounce = (func, delay) => {
      let debounceTimer;
      return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), debounceTimer ? delay : 10);
      };
    };
    this.#searchInput.addEventListener('input', debounce(event => this.#handleSearch(event), 1000));

    document.addEventListener('click', event => this.#handleClick(event));
    document.addEventListener('keydown', event => this.#handleKeyDown(event));
    document.addEventListener('keyup', event => this.#handleKeyUp(event));

    this.#handleResults({});
  }

  closeSearch() {
    this.#searchModal.classList.add('hidden');
  }

  toggleSearch() {
    if (!this.#searchModal.classList.toggle('hidden')) {
      this.#searchInput.focus();
    }
  }

  #handleClick(event) {
    let button = event.target.closest('[data-widget="search-button"]');
    if (button) {
      this.toggleSearch();
      return;
    }

    button = event.target.closest('[data-widget="search-close"]');
    if (button) {
      this.closeSearch();
    }
  }

  #handleKeyDown(event) {
    if (event.key === 'Meta') {
      this.meta = true;
      return;
    } else if (event.key === 'k' && this.meta) {
      this.toggleSearch();
    }

    if (this.#searchModal.classList.contains('hidden')) {
      return;
    }

    if (event.key === 'Escape') {
      this.closeSearch();
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.stopPropagation();
      event.preventDefault();

      let active = this.#searchModal.querySelector('[data-widget="search-result"].active');
      if (active) {
        active = event.key === 'ArrowDown' ? active.nextElementSibling : active.previousElementSibling;
      } else {
        active = this.#searchModal.querySelector('[data-widget="search-result"]'); // First one
      }

      if (active) {
        this.#highlightMenuItem(active, true);
      }
    } else if (event.key === 'Enter') {
    }
  }

  #handleKeyUp(event) {
    if (event.key === 'Meta') {
      this.meta = false;
    }
  }

  #handleMouseMove(event) {
    const option = event.target.closest('[data-widget="search-result"]');
    if (!option || (event.screenX === this.#moveX && event.screenY === this.#moveY)) {
      return;
    }

    this.#highlightMenuItem(option, false);
    this.#moveX = event.screenX; // Hack because scroll fires this event if the <li> under the mouse changes
    this.#moveY = event.screenY;
  }

  #handleSearch() {
    if (this.#searchModal.classList.contains('hidden')) {
      return;
    }

    this.#search();
  }

  #highlightMenuItem(option, focus) {
    this.#searchModal.querySelectorAll('[data-widget="search-result"].active').forEach(e => e.classList.remove('active'));
    option.classList.add('active');

    if (focus) {
      option.querySelector('a').focus();
    }
  }

  #handleResults(json) {
    if (this.#searchInput.value.trim() !== '' && json.hits && json.hits.length > 0) {
      this.#searchResults.innerHTML = json.hits.map(hit => {
        return `<li class="group" data-widget="search-result">
        <a href="${hit.url}" class="bg-slate-100 rounded-md flex group items-center px-4 py-2 dark:bg-slate-700 group-[.active]:bg-indigo-600 group-[.active]:text-white">
          <i class="bg-white border border-slate-900/10 fa-regular fa-hashtag mr-4 px-1 py-0.5 rounded-md shadow-sm text-slate-400 text-sm dark:bg-slate-600 group-[.active]:bg-indigo-600 group-[.active]:border-indigo-300 group-[.active]:text-white"></i>
          <span class="mr-auto text-slate-700 text-sm dark:text-slate-400 group-[.active]:text-white">
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
}

document.addEventListener('DOMContentLoaded', () => new Search());