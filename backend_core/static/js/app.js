/**
   * HomePage - Help section
 * */
  class Help {
    constructor($el) {
      this.$el = $el;
      this.$buttonsContainer = $el.querySelector(".help--buttons");
      this.$slidesContainers = $el.querySelectorAll(".help--slides");
      this.currentSlide = this.$buttonsContainer.querySelector(".active").parentElement.dataset.id;
      this.init();
    }

    init() {
      this.events();
    }

    events() {
      /**
       * Slide buttons
       */
      this.$buttonsContainer.addEventListener("click", e => {
        if (e.target.classList.contains("btn")) {
          this.changeSlide(e);
        }
      });

      /**
       * Pagination buttons
       */
      this.$el.addEventListener("click", e => {
        if (e.target.classList.contains("btn") && e.target.parentElement.parentElement.classList.contains("help--slides-pagination")) {
          this.changePage(e);
        }
      });
    }

    changeSlide(e) {
      e.preventDefault();
      const $btn = e.target;

      // Buttons Active class change
      [...this.$buttonsContainer.children].forEach(btn => btn.firstElementChild.classList.remove("active"));
      $btn.classList.add("active");

      // Current slide
      this.currentSlide = $btn.parentElement.dataset.id;

      // Slides active class change
      this.$slidesContainers.forEach(el => {
        el.classList.remove("active");

        if (el.dataset.id === this.currentSlide) {
          el.classList.add("active");
        }
      });
    }

    /**
     * TODO: callback to page change event
     */
    changePage(e) {
      e.preventDefault();
      const page = e.target.dataset.page;

      console.log(page);
    }
  }
  const helpSection = document.querySelector(".help");
  if (helpSection !== null) {
    new Help(helpSection);
  }

  /**
   * Form Select
   */
  class FormSelect {
    constructor($el) {
      this.$el = $el;
      this.options = [...$el.children];
      this.init();
    }

    init() {
      this.createElements();
      this.addEvents();
      this.$el.parentElement.removeChild(this.$el);
    }

    createElements() {
      // Input for value
      this.valueInput = document.createElement("input");
      this.valueInput.type = "text";
      this.valueInput.name = this.$el.name;

      // Dropdown container
      this.dropdown = document.createElement("div");
      this.dropdown.classList.add("dropdown");

      // List container
      this.ul = document.createElement("ul");

      // All list options
      this.options.forEach((el, i) => {
        const li = document.createElement("li");
        li.dataset.value = el.value;
        li.innerText = el.innerText;

        if (i === 0) {
          // First clickable option
          this.current = document.createElement("div");
          this.current.innerText = el.innerText;
          this.dropdown.appendChild(this.current);
          this.valueInput.value = el.value;
          li.classList.add("selected");
        }

        this.ul.appendChild(li);
      });

      this.dropdown.appendChild(this.ul);
      this.dropdown.appendChild(this.valueInput);
      this.$el.parentElement.appendChild(this.dropdown);
    }

    addEvents() {
      this.dropdown.addEventListener("click", e => {
        const target = e.target;
        this.dropdown.classList.toggle("selecting");

        // Save new value only when clicked on li
        if (target.tagName === "LI") {
          this.valueInput.value = target.dataset.value;
          this.current.innerText = target.innerText;
        }
      });
    }
  }
  document.querySelectorAll(".form-group--dropdown select").forEach(el => {
    new FormSelect(el);
  });

  /**
   * Hide elements when clicked on document
   */
  document.addEventListener("click", function(e) {
    const target = e.target;
    const tagName = target.tagName;

    if (target.classList.contains("dropdown")) return false;

    if (tagName === "LI" && target.parentElement.parentElement.classList.contains("dropdown")) {
      return false;
    }

    if (tagName === "DIV" && target.parentElement.classList.contains("dropdown")) {
      return false;
    }

    document.querySelectorAll(".form-group--dropdown .dropdown").forEach(el => {
      el.classList.remove("selecting");
    });
  });

  /**
   * Switching between form steps
   */
  class FormSteps {
    constructor(form) {
      this.$form = form;
      this.$next = form.querySelectorAll(".next-step");
      this.$prev = form.querySelectorAll(".prev-step");
      this.$step = form.querySelector(".form--steps-counter span");
      this.currentStep = 1;

      this.$stepInstructions = form.querySelectorAll(".form--steps-instructions p");
      const $stepForms = form.querySelectorAll("form > div");
      this.slides = [...this.$stepInstructions, ...$stepForms];

      this.init();
    }

    /**
     * Init all methods
     */
    init() {
      this.events();
      this.updateForm();
    }

    /**
     * All events that are happening in form
     */
    events() {
      // Next step
      this.$next.forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          this.validateForm();
          this.updateForm();
          if (this.currentStep === 4) {
            this.formSummary();
          }
        });
      });

      // Previous step
      this.$prev.forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          this.currentStep--;
          this.updateForm();
        });
      });

      // Form submit
      this.$form.querySelector("form").addEventListener("submit", e => this.submit(e));
    }

    /**
     * Update form front-end
     * Show next or previous section etc.
     */

    validateForm() {
      let isValid = true;

      const choosenCats = [...document.querySelectorAll("input[type='checkbox']:checked")];
      const quantityField = document.querySelector("#quantity");
      const addressField = document.querySelector("#address");
      const cityField = document.querySelector("#city");
      const zipCodeField = document.querySelector("#zip_code");
      const phoneNumberField = document.querySelector("#phone_number");
      const pickUpDateField = document.querySelector("#pickupdate");
      const pickUpTimeField = document.querySelector("#pickuptime");

      const categoriesValidator = !(choosenCats.length === 0);
      const quantityValidator = !((this.currentStep > 1 && !quantityField.value) || (this.currentStep > 1 && quantityField.value < 1));
      const detailsValidator = !(this.currentStep > 3
          && (!addressField.value || !cityField.value || !zipCodeField.value || !phoneNumberField.value
              || !pickUpDateField.value || !pickUpTimeField.value));

      isValid &&= categoriesValidator;
      isValid &&= quantityValidator;

      if (this.currentStep === 3) {
        const institution = document.querySelector('input[name="institution"]:checked');
        let choosenInstValidator = false;

        if (institution !== null) {
           choosenInstValidator = true;
        }

        isValid &&= choosenInstValidator;
      }

      isValid &&= detailsValidator;

      const formErrors = [...document.querySelectorAll(".form-error")];
      const currStepError = formErrors.filter(err => err.parentElement.classList.contains("active"))[0];

      if (isValid === true) {
        this.currentStep++;
        if (this.currentStep < 5) {
          currStepError.setAttribute("hidden", "hidden");
        }
      } else {
        currStepError.removeAttribute("hidden");
      }

      return isValid;
    }

    updateForm() {
      this.$step.innerText = this.currentStep;

      this.slides.forEach(slide => {
        slide.classList.remove("active");

        if (slide.dataset.step == this.currentStep) {
          slide.classList.add("active");
        }
      });

      this.$stepInstructions[0].parentElement.parentElement.hidden = this.currentStep >= 5;
      this.$step.parentElement.hidden = this.currentStep >= 5;
    }

    formSummary() {
      const summaryBtn = document.querySelector(".get-form-data");
      summaryBtn.addEventListener("click", function () {
        const quantity = document.getElementById("quantity").value;
        const institution = document.querySelector('input[name="institution"]:checked').parentElement.textContent;
        const chosenCats = document.querySelectorAll('input[name="categories"]:checked');
        let chosenCatsNames = "";

        chosenCats.forEach(cat => {
          const catName = cat.parentElement.textContent;
          if (chosenCatsNames === "") {
            chosenCatsNames += catName;
          } else {
            chosenCatsNames += (", " + catName);
          }
        })

        const address = document.querySelector("#address").value;
        const city = document.querySelector("#city").value;
        const zipCode = document.querySelector("#zip_code").value;
        const phoneNumber = document.querySelector("#phone_number").value;
        const pickUpDate = document.querySelector("#pickupdate").value;
        const pickUpTime = document.querySelector("#pickuptime").value;
        const pickUpComment = document.querySelector("#comment").value;

        document.querySelector("#donation_info").innerHTML = quantity + " worków " + chosenCatsNames;
        document.querySelector("#don_institution").innerHTML = "Dla " + institution;
        document.querySelector("#don_address").innerHTML = address;
        document.querySelector("#don_city").innerHTML = city;
        document.querySelector("#don_zip_code").innerHTML = zipCode;
        document.querySelector("#don_phone").innerHTML = phoneNumber;
        document.querySelector("#don_date").innerHTML = pickUpDate;
        document.querySelector("#don_time").innerHTML = pickUpTime;
        document.querySelector("#don_comment").innerHTML = pickUpComment;
      })
    }

    /**
     * Submit form
     *
     */
    submit(e) {
      e.preventDefault();
      this.validateForm();
      this.updateForm();

      const form = document.querySelector("#donation-form");
      let formData = new FormData(form);
      const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;

      function sendJson(inData) {
        const quantity = document.getElementById("quantity").value;
        const institution = document.querySelector('input[name="institution"]:checked').value;
        const chosenCats = document.querySelectorAll('input[name="categories"]:checked');
        let chosenCatsIds = [];

        chosenCats.forEach(cat => {
          const catId = cat.value;
          chosenCatsIds.push(catId);
        })

        const address = document.querySelector("#address").value;
        const city = document.querySelector("#city").value;
        const zipCode = document.querySelector("#zip_code").value;
        const phoneNumber = document.querySelector("#phone_number").value;
        const pickUpDate = document.querySelector("#pickupdate").value;
        const pickUpTime = document.querySelector("#pickuptime").value;
        const pickUpComment = document.querySelector("#comment").value;

        let xhr = new XMLHttpRequest();
        let url = "";

        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("X-CSRFToken", csrfToken);

        let data = JSON.stringify({
          "categories": chosenCatsIds,
          "quantity": quantity,
          "institution": institution,
          "address": address,
          "city": city,
          "zip_code": zipCode,
          "phone_number": phoneNumber,
          "pick_up_date": pickUpDate,
          "pick_up_time": pickUpTime,
          "pick_up_comment": pickUpComment
        })
        xhr.send(data);
      }

      sendJson(formData);

      setTimeout(function() {
        document.location.href = "/";
      }, 5000);
    }

  }
  const form = document.querySelector(".form--steps");
  if (form !== null) {
    new FormSteps(form);
  }
