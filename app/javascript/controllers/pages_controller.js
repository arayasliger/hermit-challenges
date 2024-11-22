import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="pages"
export default class extends Controller {

  connect() {
    console.log("Hello!")
  }

  displayBamboo() {
    var bamboo = document.getElementById("twelveBamboo");
    if (bamboo.style.display === "none") {
      bamboo.style.display = "block";
    } else {
      bamboo.style.display = "none";
    }
  }
}
