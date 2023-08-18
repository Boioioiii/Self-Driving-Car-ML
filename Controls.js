class Controls {
  constructor() {
    this.forward = false;
    this.left = false;
    this.right = false;
    this.reverse = false;

    //The # means its a private method, you can't access it outside of this class
    this.#addKeyBoardListeners();
  }

  #addKeyBoardListeners() {
    //Takes in our key inputs

    //What does the => mean?
    //It's a shorthand for a function
    //It's the same as writing:
    //document.onkeydown = function(event) {
    //but we don't want to write that because we want to use the "this" keyword
    //and if we use the function keyword, the "this" keyword will refer to the function
    //instead of the class
    //So we use the => to make sure the "this" keyword refers to the class
    //and not the function
    //The => is called an arrow function
    document.onkeydown = (event) => {
      switch (event.key) {
        case "ArrowLeft":
          this.left = true;
          break;
        case "ArrowRight":
          this.right = true;
          break;
        case "ArrowUp":
          this.forward = true;
          break;
        case "ArrowDown":
          this.reverse = true;
          break;
      }
    };

    //We don't want anything to happen when we let go of the key
    document.onkeyup = (event) => {
      switch (event.key) {
        case "ArrowLeft":
          this.left = false;
          break;
        case "ArrowRight":
          this.right = false;
          break;
        case "ArrowUp":
          this.forward = false;
          break;
        case "ArrowDown":
          this.reverse = false;
          break;
      }
    };
  }
}
