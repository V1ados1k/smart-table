import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes).forEach((elementName) => {
        const selectElement = elements[elementName];
        if (selectElement) {
            // Добавляем пустую опцию "Все"
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Все';
            selectElement.append(defaultOption);
            
            // Добавляем опции из индексов
            const options = Object.values(indexes[elementName]).map(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                return option;
            });
            
            selectElement.append(...options);
        }
    });

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
    const fieldName = action.dataset.field;
    
    if (fieldName && elements[fieldName]) {
        elements[fieldName].value = '';
        
        if (state) {
            state[fieldName] = '';
        }
    }
}
        if (action && action.type === 'reset') {
            // Очищаем все поля фильтрации
            Object.keys(elements).forEach(elementName => {
                const element = elements[elementName];
                if (element) {
                    // Для select элементов
                    if (element.tagName === 'SELECT') {
                        element.value = '';
                    }
                    // Для input элементов
                    else if (element.tagName === 'INPUT') {
                        element.value = '';
                    }
                    // Для textarea элементов
                    else if (element.tagName === 'TEXTAREA') {
                        element.value = '';
                    }
                }
            });
        }
        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state)); 
    }
}