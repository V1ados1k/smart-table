import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";

import {initTable} from "./components/table.js";
import {initPagination} from "./components/pagination.js"
import {initSorting} from './components/sorting.js';
import {initFiltering} from './components/filtering.js';
import {initSearching} from './components/searching.js';
// @todo: подключение


// Исходные данные используемые в render()
const {data, ...indexes} = initData(sourceData);

let applyFiltering;
let applyPagination;
let applySorting;
let applySearch;

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = parseInt(state.rowsPerPage);
    const page = parseInt(state.page ?? 1);
    return {
        ...state,
        rowsPerPage,
        page
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
    let state = collectState(); // состояние полей из таблицы
    let result = [...data]; // копируем для последующего изменения
    // @todo: использование
    if (applySearch) {
        result = applySearch(result, state, action);
    }

    if (applyFiltering) {
        result = applyFiltering(result, state, action);
    }

    if (applySorting) {
        result = applySorting(result, state, action);
    }

    if (applyPagination) {
        result = applyPagination(result, state, action);
    }

    sampleTable.render(result)
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

// @todo: инициализация
    applyFiltering = initFiltering(sampleTable.templates.before[2].elements, {
    searchBySeller: indexes.sellers
});

     applyPagination = initPagination(
    sampleTable.templates.after[0].elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el
    }
);

     applySorting = initSorting([
    sampleTable.templates.before[1].elements.sortByDate,
    sampleTable.templates.before[1].elements.sortByTotal
]);
 applySearch = initSearching('search');

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

render();
