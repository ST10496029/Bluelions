
const bookings = [];
const courseCheckboxes = document.querySelectorAll(".checklist input[type='checkbox']");
const courseCount = document.getElementById("course-count");
const totalPriceEl = document.getElementById("total-price");
const discountEl = document.getElementById("discount");
const finalPriceEl = document.getElementById("final-price");
const errorBox = document.getElementById("error-message");
const output = document.getElementById("output");

// update total when selected 
courseCheckboxes.forEach(checkbox => {
  checkbox.addEventListener("change", updateTotals);
});

// Function created to calculated toatal to calculate total price and discount
function updateTotals() {
  let selected = Array.from(courseCheckboxes).filter(cb => cb.checked);
  let totalPrice = selected.reduce((sum, cb) => sum + Number(cb.dataset.price), 0);
  let discount = 0;

  // Discount logic for the coureses 
  if (selected.length === 2) discount = 5;
  else if (selected.length === 3) discount = 10;
  else if (selected.length > 3) discount = 15;

  let finalPrice = totalPrice - (totalPrice * (discount / 100));

  // Update the UI of the screeen
  courseCount.textContent = selected.length;
  totalPriceEl.textContent = totalPrice.toFixed(2);
  discountEl.textContent = discount;
  finalPriceEl.textContent = finalPrice.toFixed(2);
}

// event listern on click after the button is pressed 
document.getElementById("bookBtn").addEventListener("click", function() {
  errorBox.style.display = "none";
  errorBox.innerText = "";

  const selectedCourses = Array.from(courseCheckboxes).filter(cb => cb.checked);
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  // Validation of input from our user
  if (selectedCourses.length === 0) {
    showError("Please select at least one course.");
    return;
  }
  if (!name || !email || !phone) {
    showError("Please fill in all contact details.");
    return;
  }
  if (!validateEmail(email)) {
    showError("Please enter a valid email address.");
    return;
  }
  if (!validatePhone(phone)) {
    showError("Please enter a valid phone number (only digits).");
    return;
  }

  // Calculate totals 
  const totalPrice = selectedCourses.reduce((sum, cb) => sum + Number(cb.dataset.price), 0);
  let discount = 0;
  if (selectedCourses.length === 2) discount = 5;
  else if (selectedCourses.length === 3) discount = 10;
  else if (selectedCourses.length > 3) discount = 15;

  const finalPrice = totalPrice - (totalPrice * (discount / 100));

  // Store booking plus discounts
  const booking = {
    name,
    email,
    phone,
    courses: selectedCourses.map(cb => cb.value),
    totalPrice,
    discount,
    finalPrice
  };
  bookings.push(booking);

  // Display on right side if the screen after
  output.innerHTML = `
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Courses:</strong> ${booking.courses.join(", ")}</p>
    <p><strong>Total Price:</strong> R${booking.totalPrice.toFixed(2)}</p>
    <p><strong>Discount:</strong> ${booking.discount}%</p>
    <p><strong>Final Price:</strong> R${booking.finalPrice.toFixed(2)}</p>
    <hr>
    <h4>All Bookings:</h4>
    <pre>${JSON.stringify(bookings, null, 2)}</pre>
  `;
});

// helping functions
function showError(message) {
  errorBox.style.display = "block";
  errorBox.innerText = message;
}
// functions to help validate email entered
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// functions to help validate phone numebr entered
function validatePhone(phone) {
  return /^[0-9]{8,15}$/.test(phone);
}
