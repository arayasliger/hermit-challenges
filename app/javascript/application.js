// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
import "channels"
import "jquery"

document.addEventListener('turbo:load', () => {
  $('.ui.dropdown').dropdown(); // Initialize dropdowns
  $('.ui.modal').modal();       // Initialize modals
  $('.ui.checkbox').checkbox(); // Initializes checkboxes
  $('.message .close').on('click', function() {
    $(this).closest('.message').transition('fade');
  });
});
