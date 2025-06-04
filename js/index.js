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
  console.log(apartmentsData);
  renderApartments(apartmentsData);

});


calculatetBtn.addEventListener('click', () => {
  const apartments = document.querySelectorAll('.apartment-item');
  // console.log(apartments);
  let totalCoverage =0;
  const apartmentsData = [];
  apartments.forEach(apartment => {
    totalCoverage += parseFloat(apartment.querySelector('.apartment-sqm').value);
    apartmentsData.push({
      apartmentName: apartment.querySelector('.apartment-name').value,
      millimeters: apartment.querySelector('.apartment-sqm').value,
    });
  })
  console.log(apartmentsData);
  console.log(totalCoverage);

})


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

