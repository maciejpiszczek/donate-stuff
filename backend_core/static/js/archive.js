let coll = document.querySelectorAll(".collapsible");

for (let i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("chosen");
    let content = this.nextElementSibling;
    if (content.style.display === "flex") {
      content.style.display = "none";
    } else {
      content.style.display = "flex";
    }
  });
}

const archiveBtns = document.querySelectorAll(".archive");

function archiveDonation(donId) {
    let xhr = new XMLHttpRequest();
    let url = "";
    const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("X-CSRFToken", csrfToken);

    let data = JSON.stringify({"donation_id": donId});
    xhr.send(data);
}

archiveBtns.forEach(btn =>
    btn.onclick = function() {
      this.style.display = 'none';
      let donButton = this.parentElement.parentElement.previousElementSibling;
      let donDetails = this.parentElement.parentElement;
      donButton.textContent += ' (DOSTARCZONE)';
      donButton.classList.toggle("chosen");
      donButton.remove();
      document.querySelector(".scroll-container").append(donButton);
      document.querySelector(".scroll-container").append(donDetails);
      donDetails.style.display = "none";
      const donationId = this.value;
      // let donationIdInt = parseInt(donationId, 10)
      //
      // const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;

      // $.ajax({
      //   type: "POST",
      //   url: window.location.href,
      //   dataType: "json",
      //   headers: {
      //     "X-requested-With": "XMLHttpRequest",
      //     "X-CSRFToken": csrfToken,
      //   },
      //   data: {
      //     "donation_id": donationIdInt
      //   }})

      archiveDonation(donationId);

      });
