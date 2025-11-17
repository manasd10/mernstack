const form = document.getElementById('employeeForm');
const table = document.getElementById('employeeTable').getElementsByTagName('tbody')[0];

form.addEventListener('submit', function (event) {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  const age = document.getElementById('age').value.trim();
  const position = document.getElementById('position').value.trim();
  if (name && age && position) {
    const newRow = table.insertRow();
    newRow.insertCell(0).textContent = name;
    newRow.insertCell(1).textContent = age;
    newRow.insertCell(2).textContent = position;
    form.reset();
  }
});