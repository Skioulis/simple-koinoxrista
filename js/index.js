const listContainer = document.getElementById('apartmentsList');
const calculatetBtn = document.getElementById('calculateBtn');

// document.addEventListener('DOMContentLoaded', () => {
//   fetch('/public/data/data.csv') // Replace with your CSV path
//     .then(response => response.text())
//     .then(csvText => {
//       const data = parseCSV(csvText);
//       renderApartments(data);
//     })
//     .catch(error => console.error('Error loading CSV:', error));
// });

document.addEventListener('DOMContentLoaded', () => {
  // Use apartmentsData directly
  // console.log(apartmentsData);
  renderApartments(apartmentsData);

});


calculatetBtn.addEventListener('click', calculateFees )


// Simple CSV parser: converts CSV string to an array of objects
// function parseCSV(csvString) {
//   const lines = csvString.trim().split('\n');
//   const headers = lines[0].split(',');
//   return lines.slice(1).map(line => {
//     const values = line.split(',');
//     return headers.reduce((obj, header, i) => {
//       obj[header.trim()] = values[i].trim();
//       return obj;
//     }, {});
//   });
// }

/**
 * Renders a list of apartment objects into the DOM.
 *
 * @param {Array<Object>} apartments - An array of apartment objects to be rendered. Each object should have the properties:
 *        - apartmentName {string}: The name or identifier of the apartment.
 *        - millimeters {number}: The size or measurement value associated with the apartment.
 * @return {void} This method does not return a value.
 */
function renderApartments(apartments) {
  listContainer.innerHTML = ''; // Clear previous content
  apartments.forEach(apartment => {
    const item = document.createElement('div');
    // item.className = 'apartment-item';
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
                                        <label>Εμβαδόν / Χιλιοστά (‰)</label>
                                        <input type="number" class="form-control apartment-sqm" step="0.01" min="0" value="${apartment.millimeters}">
                                    </div>
                                </div>
                            </div>
                           
                        </div>    

`;
    listContainer.appendChild(item);
  });
}

function calculateFees() {
  {
    const apartments = document.querySelectorAll('.apartment-item');
    // console.log(apartments);
    let totalCoverage =0;
    const apartmentsData = [];
    // This loop populates the apartmentsData array with each apartment's name and millimeters
    apartments.forEach(apartment => {
      totalCoverage += parseFloat(apartment.querySelector('.apartment-sqm').value);
      apartmentsData.push({
        apartmentName: apartment.querySelector('.apartment-name').value,
        millimeters: apartment.querySelector('.apartment-sqm').value,
      });
    })

    const month = document.getElementById('month').value;
    const year = document.getElementById('year').value;
    const cleaningFee = parseFloat(document.getElementById('cleaning').value) || 0;
    const electricityFee = parseFloat(document.getElementById('electricity').value) || 0;
    const elevatorFee = parseFloat(document.getElementById('elevator').value) || 0;
    const waterFee = parseFloat(document.getElementById('water').value) || 0;
    const otherFee = parseFloat(document.getElementById('other').value) || 0;

    const totalFees = cleaningFee + electricityFee + elevatorFee + waterFee + otherFee;

    console.log(month, year, totalCoverage, totalFees);
    // console.log(apartmentsData);
    // console.log(totalCoverage);

  }
}

