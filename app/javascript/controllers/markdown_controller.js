import { Controller } from "@hotwired/stimulus"
import SimpleMDE from "simplemde";
import "simplemde/dist/simplemde.min.css"

// Connects to data-controller="markdown"
export default class extends Controller {
  connect() {
    this.editor = new SimpleMDE({ element: this.element });
  }
}
