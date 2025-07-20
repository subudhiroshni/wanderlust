// (() => {
//   'use strict'

//   // Fetch all the forms we want to apply custom Bootstrap validation styles to
//   const forms = document.querySelectorAll('.needs-validation')

//   // Loop over them and prevent submission
//   Array.from(forms).forEach(form => {
//     form.addEventListener('submit', event => {
//       if (!form.checkValidity()) {
//         event.preventDefault()
//         event.stopPropagation()
//       }

//       form.classList.add('was-validated')
//     }, false)
//   })
// })()

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
