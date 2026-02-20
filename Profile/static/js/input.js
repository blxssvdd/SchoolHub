/* ============================================
   SchoolHub - Form Enhanced Styling
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Apply form-control class to all inputs
    const inputTags = document.querySelectorAll("input");
    inputTags.forEach(function(tag) {
        if (!tag.classList.contains('form-control')) {
            tag.classList.add("form-control");
        }
    });

    // Apply form-control class to selects
    const selectElements = document.querySelectorAll("select");
    selectElements.forEach(function(select) {
        if (!select.classList.contains('form-control')) {
            select.classList.add("form-control");
        }
    });

    // Apply form-control class to textareas
    const textAreas = document.querySelectorAll("textarea");
    textAreas.forEach(function(textarea) {
        if (!textarea.classList.contains('form-control')) {
            textarea.classList.add("form-control");
        }
    });

    // Wrap form divs with proper Bootstrap classes
    const formDivs = document.querySelectorAll("[class*='form-div'], .form-group");
    formDivs.forEach(function(div) {
        if (!div.classList.contains('mb-3')) {
            div.classList.add('mb-3');
        }
    });

    // Style form labels
    const labels = document.querySelectorAll("label");
    labels.forEach(function(label) {
        if (!label.classList.contains('form-label')) {
            label.classList.add('form-label');
        }
    });

    // Style buttons
    const buttons = document.querySelectorAll("button:not([class*='btn'])");
    buttons.forEach(function(btn) {
        btn.classList.add('btn');
        // Determine button type
        if (btn.type === 'submit') {
            btn.classList.add('btn-primary');
        } else if (btn.type === 'reset') {
            btn.classList.add('btn-secondary');
        } else {
            btn.classList.add('btn-info');
        }
    });

    // Add validation styling to forms
    const forms = document.querySelectorAll('form');
    forms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            // Add animation
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.classList.add('animate-pulse');
            }
        });
    });
});
