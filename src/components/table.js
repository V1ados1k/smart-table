import {cloneTemplate} from "../lib/utils.js";

export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);
    
    // Инициализируем свойство templates
    root.templates = {
        before: [],
        after: []
    };

    // @todo: #1.2 — вывести дополнительные шаблоны до и после таблицы
    if (before && before.length > 0) {
        before.reverse().forEach(templateId => {
            const template = cloneTemplate(templateId);
            root.container.prepend(template.container);
            root.templates.before.push(template);
            root[templateId] = template; // Добавляем шаблон по его ID
        });
    }

    if (after && after.length > 0) {
        after.forEach(templateId => { // <- ИСПРАВЛЕНО: templateId вместо templatedId
            const template = cloneTemplate(templateId); // <- ИСПРАВЛЕНО: templateId вместо templateId
            root.container.append(template.container);
            root.templates.after.push(template);
            root[templateId] = template; // Добавляем шаблон по его ID
        });
    }

    // @todo: #1.3 — обработать события и вызвать onAction()
    root.container.addEventListener('change', () => {
        onAction();
    });

    root.container.addEventListener('reset', () => {
        setTimeout(() => {
            onAction();
        }, 0);
    });

    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    });

    const render = (data) => {
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);
            Object.keys(item).forEach(key => {
                if (row.elements[key]) {
                    row.elements[key].textContent = item[key];
                }
            });
            return row.container;
        });
        root.elements.rows.replaceChildren(...nextRows);
    };
    
    root.render = render;
    
    // Возвращаем root, так как мы добавили к нему все нужные свойства
    return root;
}