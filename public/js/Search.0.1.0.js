'use strict';
// import docsearch from '@docsearch/js';
// import '@docsearch/css';

// import docsearch from "@docsearch/js";

// const { autocomplete } = window['@algolia/autocomplete-js'];

class Search {
  constructor() {
    this.searchModal = document.querySelector('[data-widget=search]');
    this.searchModal.querySelectorAll('[data-widget="search-close"]')
      .forEach(e => e.addEventListener('click', () => this.closeSearch()));
    document.addEventListener('click', event => this.#handleClick(event));
    document.addEventListener('keydown', event => this.#handleKeyDown(event));
  }

  closeSearch() {
    this.searchModal.classList.add('hidden');
  }

  #handleClick(event) {
    const button = event.target.closest('[data-widget="search-button"]');
    if (!button) {
      return;
    }

    this.searchModal.classList.toggle('hidden');
  }

  #handleKeyDown(event) {
    if (this.searchModal.classList.contains('hidden')) {
      return;
    }

    if (event.key === 'Escape') {
      this.closeSearch();
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
}

document.addEventListener('DOMContentLoaded', () => new Search());