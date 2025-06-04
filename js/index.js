

let apartments = [];
const listContainer = document.getElementById('apartmentsList');


document.addEventListener('DOMContentLoaded', () => {
  fetch('/public/data/data.csv') // Replace with your CSV path
    .then(response => response.text())
    .then(csvText => {
      const data = parseCSV(csvText);
      // console.log(data);
      // const listContainer = document.getElementById('apartmentsList');
      renderApartments(data);

      // You can now use the parsed CSV data
      // For example, render apartments to your page here
      // updateApartmentsList(data);
    })
    .catch(error => console.error('Error loading CSV:', error));
});



// Simple CSV parser: converts CSV string to an array of objects
function parseCSV(csvString) {
  const lines = csvString.trim().split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj, header, i) => {
      obj[header.trim()] = values[i].trim();
      return obj;
    }, {});
  });
}

function renderApartments(apartments) {
  listContainer.innerHTML = ''; // Clear previous content
  apartments.forEach(apartment => {
    const item = document.createElement('div');
    item.className = 'apartment-item';
    item.innerHTML = `
      
        <div class="apartment-item mb-3 p-3 border rounded">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Όνομα/Αριθμός</label>
                                        <input type="text" class="form-control apartment-name" placeholder="π.χ. Διαμ. 1" value="${apartment.apartmentName}">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Χιλιοστά (‰)</label>
                                        <input type="number" class="form-control apartment-sqm" step="0.01" min="0" value="${apartment.millimeters}">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12 d-flex justify-content-end">
                                    <button type="button" class="btn btn-sm btn-danger remove-apartment mt-2">Αφαίρεση</button>
                                </div>
                            </div>
                        </div>    

`;
    listContainer.appendChild(item);
  });
}
