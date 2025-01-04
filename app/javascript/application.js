// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
import "channels"
import "jquery"

document.addEventListener('turbo:load', () => {
  $('.ui.checkbox').checkbox(); // Initializes checkboxes
});
