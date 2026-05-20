// ----------------------------------// Variables //-----------------------------//

inputFullName = document.getElementById("contactName");
inputPhoneNumber = document.getElementById("contactPhone");
inputEmailAddress = document.getElementById("contactEmail");
inputAddress = document.getElementById("contactAddress");
inputGroup = document.getElementById("contactGroup");
inputNotes = document.getElementById("contactNotes");
contactFav = document.getElementById("contactFavorite");
contactEmergency = document.getElementById("contactEmergency");
addBtn = document.getElementById("saveContactBtn");
contactsList = document.getElementById("contactsList");
var searchInput = document.getElementById("search");
var addModalLabel = document.getElementById("addModalLabel");
var editModalLabel = document.getElementById("editModalLabel");
var exampleModal = document.getElementById("exampleModal");
var contactsCount = document.getElementById("contactsCount");
var totalContacts = document.getElementById("totalContacts");
var favoriteContacts = document.getElementById("favoriteContacts");
var emergencyContacts = document.getElementById("emergencyContacts");
var favoriteContactsList = document.getElementById("favoriteContactsList");
var emergencyContactsList = document.getElementById("emergencyContactsList");

var contactList = [];
var isUpdate = false;
var colors = [
  "linear-gradient(to bottom right, #E12AE9, #ED006E)",
  "linear-gradient(to bottom right, #7c26fd, #4f46e5)",
  "linear-gradient(to bottom right, #60a5fa, #2563eb)",
  "linear-gradient(to bottom right, #00b67f, #009f87)",
  "linear-gradient(to bottom right, #ffad00, #ff8200)",
];
// ----------------------------------// EventListener //-------------------------//

addBtn.addEventListener("click", () => {
  if (isUpdate) {
    updateContact();
  } else {
    addContact();
  }
});

searchInput.addEventListener("input", () => {
  searchContact();
});

exampleModal.addEventListener("hidden.bs.modal", function () {
  isUpdate = false;

  addModalLabel.classList.remove("d-none");
  editModalLabel.classList.add("d-none");

  clearForm();
});

inputFullName.addEventListener("input", function () {
  validationInput(this);
});

inputPhoneNumber.addEventListener("input", function () {
  validationInput(this);
});

inputEmailAddress.addEventListener("input", function () {
  validationInput(this);
});

//-----------------------------------// Functions //-----------------------------//

if (localStorage.getItem("contacArray") != null) {
  contactList = JSON.parse(localStorage.getItem("contacArray"));
}
displayContacts(contactList);

// ================================= Add Contact ==========================================//

function addContact() {
  if (
    validationInput(contactName) &&
    validationInput(contactPhone) &&
    (inputEmailAddress.value == "" || validationInput(contactEmail))
  ) {
    var contact = {
      name: inputFullName.value,
      phone: inputPhoneNumber.value,
      email: inputEmailAddress.value,
      address: inputAddress.value,
      group: inputGroup.value,
      notes: inputNotes.value,
      favorite: contactFav.checked,
      emergency: contactEmergency.checked,
    };

    for (var i = 0; i < contactList.length; i++) {
      if (inputPhoneNumber.value == contactList[i].phone) {
        Swal.fire({
          icon: "error",
          title: "Duplicate Phone Number",
          text: `A contact with this phone number already exists: ${contactList[i].name}`,
        });

        return;
      }
    }

    contactList.push(contact);

    localStorage.setItem("contacArray", JSON.stringify(contactList));

    var modal = bootstrap.Modal.getOrCreateInstance(exampleModal);
    modal.hide();

    Swal.fire({
      icon: "success",
      title: "Added!",
      text: "Contact has been added successfully.",
      timer: 1500,
      showConfirmButton: false,
    });

    clearForm();
    displayContacts(contactList);
  } else {
    validateForm();
  }
}

// ================================= Clear form ==========================================//
function clearForm() {
  inputFullName.value = "";
  inputPhoneNumber.value = "";
  inputEmailAddress.value = "";
  inputAddress.value = "";
  inputGroup.value = "";
  inputNotes.value = "";
  contactFav.checked = false;
  contactEmergency.checked = false;

  var inputs = [inputFullName, inputPhoneNumber, inputEmailAddress];

  for (var i = 0; i < inputs.length; i++) {
    inputs[i].classList.remove("is-invalid");
    if (inputs[i].nextElementSibling) {
      inputs[i].nextElementSibling.classList.add("d-none");
    }
  }
}

// ================================= Display Contacts ==========================================//

function displayContacts(array) {
  contactsCount.innerHTML = `Manage and organize your ${contactList.length} contacts`;
  totalContacts.innerHTML = `${contactList.length}`;

  displayfavCard(array);
  displayEmergyCard(array);

  if (array.length === 0) {
    contactsList.innerHTML = `
      <div class="no-contact col-12 text-center py-5">
          <div class="mb-3 d-flex justify-content-center align-items-center">
            <i class="fa-solid fa-address-book"></i>
          </div>
          <p class="fw-semibold text-muted">No contacts found</p>
          <p class="text-secondary small">
            Click "Add Contact" to get started
          </p>
      </div>
    `;
    return;
  }

  var cartona = "";

  for (var i = 0; i < array.length; i++) {
    cartona += `
    <div class="col-12 col-md-6">
        <div class="card">
                    <div class="box-body">
                      <div class="d-flex align-items-center gap-3">
                        <div
                          class="avatar-box d-flex justify-content-center align-items-center"
                           style="background-image:${avatarColor(array[i].name)}"
                        >
                        <div class="${array[i].favorite ? "fav-icon" : ""} ${array[i].emergency ? "emerg-icon" : ""}"></div>
                          <span>${getInitials(array[i].name)}</span>
                        </div>

                        <div>
                          <h3 class="fs-6 fw-semibold">${array[i].name}</h3>

                          <div
                            class="contact-number d-flex align-items-center gap-2 mt-2"
                          >
                            <div
                              class="phone-icon d-flex justify-content-center align-items-center"
                            >
                              <i class="fa-solid fa-phone"></i>
                            </div>

                            <span class="small text-secondary"
                              >${array[i].phone}</span
                            >
                          </div>
                        </div>
                      </div>

                      <div class="box-details mt-3">
                        <div class="d-flex align-items-center gap-2 mb-2">
                          <div
                            class="info-icon email justify-content-center align-items-center ${array[i].email != "" ? "d-flex" : "d-none"}"
                          >
                            <i class="fa-solid fa-envelope"></i>
                          </div>

                          <span class="small text-secondary">
                            ${array[i].email}
                          </span>
                        </div>

                        <div class="d-flex align-items-center gap-2">
                          <div
                            class="info-icon location ${array[i].address != "" ? "d-flex" : "d-none"} justify-content-center align-items-center"
                          >
                            <i class="fa-solid fa-location-dot"></i>
                          </div>

                          <span class="small text-secondary"
                            >${array[i].address}</span
                          >
                        </div>
                      </div>

                      <div class="d-flex gap-2 align-items-center">
                        <div class="group ${array[i].group != "" ? "d-flex" : "d-none"} ${array[i].group}">
                          <span>${array[i].group}</span>
                        </div>
                        <div class="group emerg ${array[i].emergency != "" ? "d-flex" : "d-none"} align-items-center gap-1">
                          <span><i class="fa-solid fa-heart-pulse"></i> Emergency</span>
                        </div>
                      </div>
                    </div>

                    <div
                      class="box-footer d-flex justify-content-between align-items-center"
                    >
                      <div class="d-flex align-items-center gap-2">
                        <a href="tel:${array[i].phone}">
                        <button
                            class="btn location d-flex align-items-center justify-content-center"
                          >
                            <i class="fa-solid fa-phone"></i>
                        </button>
                        </a>

                        <button
                          class="btn email align-items-center justify-content-center ${array[i].email != "" ? "d-flex" : "d-none"}"
                        >
                          <i class="fa-solid fa-envelope"></i>
                        </button>
                      </div>

                      <div class="d-flex align-items-center gap-2">
                        <div
                          class="action star d-flex align-items-center justify-content-center ${array[i].favorite ? "active" : ""} " onclick="toggleFavorite(${i})"
                        >
                          <i class="${array[i].favorite ? "fa-solid fa-star" : "fa-regular fa-star"}"></i>
                        </div>

                        <div
                          class="action heart d-flex align-items-center justify-content-center ${array[i].emergency ? "active" : ""}" onclick="toggleEmergency(${i})"
                        >
                          <i class="${array[i].emergency ? "fa-solid fa-heart-pulse" : "fa-regular fa-heart"}"></i>
                        </div>

                        <div
                          class="action edit d-flex align-items-center justify-content-center" onclick="setDataToInputs(${i})"
                        >
                          <i class="fa-solid fa-pen"></i>
                        </div>

                        <div
                          class="action delete d-flex align-items-center justify-content-center" onclick="deleteContact(${i})"
                        >
                          <i class="fa-solid fa-trash"></i>
                        </div>
                      </div>
                    </div>
                  </div>
    </div>
      `;
  }

  contactsList.innerHTML = cartona;
}

function displayfavCard(array) {
  var favCartona = "";
  var favTotal = 0;

  for (var i = 0; i < array.length; i++) {
    if (array[i].favorite) {
      favTotal++;
    }
    favoriteContacts.innerHTML = favTotal;

    if (array[i].favorite) {
      favCartona += `
        <div class="col-12 col-md-6 col-lg-12">
          <a
            href="tel:${array[i].phone}"
            class="contact-card d-flex justify-content-between align-items-center"
          >
            <div class="d-flex align-items-center gap-2">
              <div
                class="avatar-box d-flex justify-content-center align-items-center"
                style="background-image:${avatarColor(array[i].name)}"
              >
                ${getInitials(array[i].name)}
              </div>

              <div class="contact-info">
                <h5>${array[i].name}</h5>
                <span>${array[i].phone}</span>
              </div>
            </div>

            <div
              class="call d-flex align-items-center justify-content-center"
            >
              <i class="fa-solid fa-phone"></i>
            </div>
          </a>
        </div>
      `;
    }
  }

  if (favCartona == "") {
    favoriteContactsList.innerHTML = `<p class="small text-secondary text-center">No favorites yet</p>`;
  } else {
    favoriteContactsList.innerHTML = favCartona;
  }
}

function displayEmergyCard(array) {
  var emrgyCartona = "";
  var emerTotal = 0;
  for (var i = 0; i < array.length; i++) {
    if (array[i].emergency) {
      emerTotal++;
    }
    emergencyContacts.innerHTML = emerTotal;
    if (array[i].emergency) {
      emrgyCartona += `
        <div class="col-12 col-md-6 col-lg-12">
          <a
            href="tel:${array[i].phone}"
            class="contact-card d-flex justify-content-between align-items-center"
          >
            <div class="d-flex align-items-center gap-2">
              <div
                class="avatar-box d-flex justify-content-center align-items-center"
                style="background-image:${avatarColor(array[i].name)}"
              >
                ${getInitials(array[i].name)}
              </div>

              <div class="contact-info">
                <h5>${array[i].name}</h5>
                <span>${array[i].phone}</span>
              </div>
            </div>

            <div
              class="call d-flex align-items-center justify-content-center"
            >
              <i class="fa-solid fa-phone"></i>
            </div>
          </a>
        </div>
      `;
    }
  }

  if (emrgyCartona == "") {
    emergencyContactsList.innerHTML = `<p class="small text-secondary text-center">No emergency contacts</p>`;
  } else {
    emergencyContactsList.innerHTML = emrgyCartona;
  }
}

function toggleFavorite(index) {
  contactList[index].favorite = !contactList[index].favorite;

  localStorage.setItem("contacArray", JSON.stringify(contactList));

  displayContacts(contactList);
}

function toggleEmergency(index) {
  contactList[index].emergency = !contactList[index].emergency;

  localStorage.setItem("contacArray", JSON.stringify(contactList));

  displayContacts(contactList);
}

function getInitials(name) {
  return name
    .trim()
    .split(" ")
    .map((word) => (word ? word[0].toUpperCase() : ""))
    .slice(0, 2)
    .join("");
}

function avatarColor(name) {
  var total = 0;
  for (var i = 0; i < name.length; i++) {
    total += name.charCodeAt(i);
  }
  return colors[total % colors.length];
}
// =================================  Delete Contact ==========================================//
function deleteContact(index) {
  Swal.fire({
    title: "Delete Contact?",
    text: `Are you sure you want to delete ${contactList[index].name}? This action cannot be undone.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DC2626",
    cancelButtonColor: "#606773",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      contactList.splice(index, 1);

      localStorage.setItem("contacArray", JSON.stringify(contactList));

      displayContacts(contactList);

      Swal.fire({
        title: "Deleted!",
        text: "Contact has been deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  });
}

// ================================= Search Contact ==========================================//
function searchContact() {
  var searchIndex = searchInput.value;

  var searchResult = [];
  for (var i = 0; i < contactList.length; i++) {
    if (
      contactList[i].name.toLowerCase().includes(searchIndex.toLowerCase()) ||
      contactList[i].phone.toLowerCase().includes(searchIndex.toLowerCase()) ||
      contactList[i].email.toLowerCase().includes(searchIndex.toLowerCase())
    ) {
      searchResult.push(contactList[i]);
    }
  }
  displayContacts(searchResult);
}

// ================================= Update Contact ==========================================//

var currentIndex;

function setDataToInputs(updatindex) {
  isUpdate = true;
  addModalLabel.classList.add("d-none");
  editModalLabel.classList.remove("d-none");

  currentIndex = updatindex;

  inputFullName.value = contactList[updatindex].name;
  inputPhoneNumber.value = contactList[updatindex].phone;
  inputEmailAddress.value = contactList[updatindex].email;
  inputAddress.value = contactList[updatindex].address;
  inputGroup.value = contactList[updatindex].group;
  inputNotes.value = contactList[updatindex].notes;
  contactFav.checked = contactList[updatindex].favorite;
  contactEmergency.checked = contactList[updatindex].emergency;

  var modal = bootstrap.Modal.getOrCreateInstance(exampleModal);
  modal.show();
}

function updateContact() {
  if (
    validationInput(contactName) &&
    validationInput(contactPhone) &&
    (inputEmailAddress.value == "" || validationInput(contactEmail))
  ) {
    for (var i = 0; i < contactList.length; i++) {
      if (inputPhoneNumber.value == contactList[i].phone && i != currentIndex) {
        Swal.fire({
          icon: "error",
          title: "Duplicate Phone Number",
          text: `A contact with this phone number already exists: ${contactList[i].name}`,
        });

        return;
      }
    }
    editModalLabel.classList.add("d-none");
    addModalLabel.classList.remove("d-none");

    contactList[currentIndex].name = inputFullName.value;
    contactList[currentIndex].phone = inputPhoneNumber.value;
    contactList[currentIndex].email = inputEmailAddress.value;
    contactList[currentIndex].address = inputAddress.value;
    contactList[currentIndex].group = inputGroup.value;
    contactList[currentIndex].notes = inputNotes.value;
    contactList[currentIndex].favorite = contactFav.checked;
    contactList[currentIndex].emergency = contactEmergency.checked;

    localStorage.setItem("contacArray", JSON.stringify(contactList));

    var modal = bootstrap.Modal.getOrCreateInstance(exampleModal);
    modal.hide();

    Swal.fire({
      icon: "success",
      title: "Updated!",
      text: "Contact has been updated successfully.",
      timer: 1500,
      showConfirmButton: false,
    });

    clearForm();

    displayContacts(contactList);
  } else {
    validateForm();
  }
}

// ================================= Validation ==========================================//

function validationInput(element) {
  var regex = {
    contactName: /^[A-Za-z\s]{2,50}$/,
    contactPhone: /^(\+20|20|01)[0-9]{9}$/,
    contactEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  };

  if (regex[element.id].test(element.value)) {
    element.classList.remove("is-invalid");
    element.nextElementSibling.classList.add("d-none");

    return true;
  } else {
    element.classList.add("is-invalid");
    element.nextElementSibling.classList.remove("d-none");
    return false;
  }
}

function validateForm() {
  if (inputFullName.value == "") {
    Swal.fire({
      icon: "error",
      title: "Missing Name",
      text: "Please enter a name for the contact!",
    });
  } else if (validationInput(contactName) == false) {
    Swal.fire({
      icon: "error",
      title: "Invalid Name",
      text: "Name should contain only letters and spaces (2-50 characters)",
    });
  } else if (inputPhoneNumber.value == "") {
    Swal.fire({
      icon: "error",
      title: "Missing Phone",
      text: "Please enter a phone number!",
    });
  } else if (validationInput(contactPhone) == false) {
    Swal.fire({
      icon: "error",
      title: "Invalid Phone",
      text: "Please enter a valid Egyptian phone number (e.g., 01012345678 or +201012345678)",
    });
  } else if (
    inputEmailAddress.value != "" &&
    validationInput(contactEmail) == false
  ) {
    Swal.fire({
      icon: "error",
      title: "Invalid Email",
      text: "Please enter a valid email address",
    });
  }
}
