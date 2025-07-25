

document.addEventListener("DOMContentLoaded", () => {
  'use strict';

  const forms = document.querySelectorAll('.needs-validation');
  console.log("validation was loaded")
  forms.forEach(form => {
      form.addEventListener('submit', event => {
          if (!form.checkValidity()) {
              event.preventDefault(); // Stop form submission
              event.stopPropagation();
          }
          form.classList.add('was-validated'); // Apply Bootstrap validation styles
      });
  });
});

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));

 const collapseEl = document.getElementById('navbarNavAltMarkup');

  // When collapse is fully shown
  collapseEl.addEventListener('show.bs.collapse', () => {
    collapseEl.classList.add('navbar-blur');
  });

  // When collapse is fully hidden
  collapseEl.addEventListener('hidden.bs.collapse', () => {
    collapseEl.classList.remove('navbar-blur');
  });