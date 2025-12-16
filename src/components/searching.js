import {rules, createComparison} from "../lib/compare.js";

export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    const compare = createComparison(
        rules.skipEmptyTargetValues,
        rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)
    );

    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        const searchValue = state[searchField] || '';
        
        if (!searchValue) {
            return data; // Если нет поискового запроса, возвращаем все данные
        }
        
        // Фильтруем данные с помощью компаратора
        return data.filter(item => {
            return compare(item, searchValue);
        });
    };
}