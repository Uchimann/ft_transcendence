class FormDataStorage {
    constructor(storageKey) {
        this.storageKey = storageKey;
    }
    
    async saveData() {
        const forms = document.querySelectorAll('form');
        let formData = JSON.parse(localStorage.getItem(this.storageKey)) || {};
        
        forms.forEach((form, index) => {
            const formId = form.id || `form-${index}`;
            formData[formId] = formData[formId] || {};
            new FormData(form).forEach((value, key) => {
                formData[formId][key] = value;
            });
        });
        
        localStorage.setItem(this.storageKey, JSON.stringify(formData));
    }
    
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
