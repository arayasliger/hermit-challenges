import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="bamboo"
export default class extends Controller {
  connect() {
  }

  toggleBamboo() {
    var bamboo = document.getElementById("twelveBamboo");
    bamboo.style.visibility = (bamboo.style.visibility === "visible") ? "hidden" : "visible"
  }
}
