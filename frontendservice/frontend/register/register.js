    export async function saveData(storageKey) {
        if (JSON.parse(localStorage.getItem(storageKey)))
            return false;
        const form = document.querySelector('form');
        let formData = {};

        formData[form.id] = {};
        new FormData(form).forEach((value, key) => {
            formData[form.id][key] = value;
        });

        localStorage.setItem(storageKey, JSON.stringify(formData));
        return true;
    }
