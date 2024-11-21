/*class FormDataStorage {
    constructor(storageKey) {
        this.storageKey = storageKey;
    }
*/
    export async function saveData(storageKey) {
        //geçici bloğu begin
        if (JSON.parse(localStorage.getItem(storageKey)))
            return false;
        const form = document.querySelector('form');
        let formData = /*JSON.parse(localStorage.getItem(storageKey)) || */{};

        formData[form.id] = {};
        new FormData(form).forEach((value, key) => {
            formData[form.id][key] = value;
        });

        localStorage.setItem(storageKey, JSON.stringify(formData));
        return true;
        //geçici bloğu end
    }
/*
    async restoreData() {
        const savedFormData = JSON.parse(localStorage.getItem(this.storageKey));
        if (savedFormData) {
            for (const [formId, data] of Object.entries(savedFormData)) {
                const form = document.getElementById(formId);
                if (form) {
                    for (const [key, value] of Object.entries(data)) {
                        const input = form.elements[key];
                        if (input) {
                            input.value = value;
                        }
                    }
                }
            }
        }
    }
}

// To restore data

export { FormDataStorage };
*/
