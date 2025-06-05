const listContainer = document.getElementById('apartmentsList');
const calculatetBtn = document.getElementById('calculateBtn');
const resultsBody = document.getElementById('resultsBody');
const totalSqmAmount = document.getElementById('totalSqmAmount');

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


/**
 * Represents a collection of apartments.
 * This variable stores information about multiple apartment entities,
 * which may include details such as location, size, price, availability, and other attributes.
 *
 * Can be used to manage and manipulate data related to housing units
 * within various applications such as property listing services,
 * rental management systems, or real estate platforms.
 */


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
 * Renders a list of apartment input forms to the DOM.
 *
 * @function renderApartments
 * @param {Array<Object>} apartments - Array of apartment objects to render
 * @param {string} apartments[].apartmentName - Name or number of the apartment
 * @param {number} apartments[].millimeters - Area in millimeters (‰) of the apartment
 *
 * @description
 * This function creates input forms for each apartment with the following features:
 * - Clears any existing content in the list container
 * - Creates a Bootstrap-styled form for each apartment with:
 *   - Name/Number input field (text)
 *   - Area/Millimeters input field (number)
 * - Uses Bootstrap classes for responsive layout (col-md-6 for two-column layout)
 * - Applies styling with classes:
 *   - mb-3: margin bottom
 *   - p-3: padding
 *   - border: adds border
 *   - rounded: rounds corners
 *   - form-group: Bootstrap form styling
 *   - form-control: Bootstrap input styling
 *
 * @example
 * const apartments = [
 *   { apartmentName: "Διαμ. 1", millimeters: 150 },
 *   { apartmentName: "Διαμ. 2", millimeters: 200 }
 * ];
 * renderApartments(apartments);
 *
 * @requires
 * - Bootstrap CSS framework
 * - Global listContainer element (DOM element where apartments will be rendered)
 *
 * @note
 * Input fields are given specific classes for later reference:
 * - apartment-name: for name input
 * - apartment-sqm: for area/millimeters input
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

/**
 * Calculates and displays the proportional fees for each apartment based on their area.
 *
 * @function calculateFees
 *
 * @description
 * This function performs the following operations:
 * 1. Collects apartment data from the DOM:
 *    - Finds all elements with class 'apartment-item'
 *    - Extracts name and area (millimeters) from input fields
 *    - Calculates total coverage area
 *
 * 2. Processes form inputs for:
 *    - Month and year
 *    - Cleaning fees
 *    - Electricity fees
 *    - Elevator fees
 *    - Water fees
 *    - Other fees
 *
 * 3. Calculates:
 *    - Total fees (sum of all fee types)
 *    - Individual apartment fees based on proportional area
 *    - Running total of distributed fees
 *
 * 4. Renders results:
 *    - Creates a table row for each apartment showing:
 *      * Apartment name
 *      * Area in millimeters
 *      * Calculated fees in euros
 *    - Updates total amount display
 *
 * @formula
 * Individual apartment fee = (apartment.millimeters / totalCoverage) * totalFees
 *
 * @requires
 * DOM elements:
 * - Input fields with ids: month, year, cleaning, electricity, elevator, water, other
 * - Elements with class: apartment-item, apartment-name, apartment-sqm
 * - Element with id: resultsBody (for displaying results)
 * - Element: totalSqmAmount (for displaying total fees)
 *
 * @notes
 * - All monetary values are rounded to 2 decimal places
 * - Invalid numeric inputs default to 0
 * - Results are displayed in euros (€)
 * - Clears previous results before displaying new ones
 */

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
        fees: 0
      });    })



    const inputFields = [
      {id: 'month', parse: (v) => v},
      {id: 'year', parse: (v) => v},
      {id: 'cleaning', parse: (v) => parseFloat(v) || 0},
      {id: 'electricity', parse: (v) => parseFloat(v) || 0},
      {id: 'elevator', parse: (v) => parseFloat(v) || 0},
      {id: 'water', parse: (v) => parseFloat(v) || 0},
      {id: 'other', parse: (v) => parseFloat(v) || 0}
    ].map(field => ({...field, value: field.parse(document.getElementById(field.id).value)}));

    const [month, year, cleaningFee, electricityFee, elevatorFee, waterFee, otherFee] =
        inputFields.map(field => field.value);

    const totalFees = (cleaningFee + electricityFee + elevatorFee + waterFee + otherFee).toFixed(2);

    let sumOfFees = 0;

    resultsBody.innerHTML = '';

    apartmentsData.forEach(apartment => {
      apartment.fees = ((apartment.millimeters / totalCoverage) * totalFees).toFixed(2);
      sumOfFees += parseFloat(apartment.fees);

      const row = document.createElement('tr');
      row.innerHTML = `
                <td>${apartment.apartmentName}</td>
                <td>${apartment.millimeters}</td>
                <td><strong>${apartment.fees} €</strong></td>
            `;

      resultsBody.appendChild(row);
    })
    totalSqmAmount.textContent = totalFees;

    console.log(apartmentsData); //  TODO DELETE
    console.log(sumOfFees);//  TODO DELETE
    console.log(month, year, totalCoverage, totalFees);//  TODO DELETE




    // console.log(apartmentsData);
    // console.log(totalCoverage);

  }
}

