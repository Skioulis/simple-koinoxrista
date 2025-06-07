const listContainer = document.getElementById('apartmentsList');
const calculateBtn = document.getElementById('calculateBtn');
const resultsBody = document.getElementById('resultsBody');
const totalSqmAmount = document.getElementById('totalSqmAmount');
const printBtn = document.getElementById('printBtn');
const resetBtn = document.getElementById('resetBtn');


document.addEventListener('DOMContentLoaded', () => {
    // Use apartmentsData directly
    // console.log(apartmentsData);
    renderApartments(apartmentsDataElectricity);

});



calculateBtn.addEventListener('click', calculateElectricity );
// printBtn.addEventListener('click', printResults);


resetBtn.addEventListener('click', resetForm);




/**
 * Renders a list of apartment objects into the DOM by dynamically creating HTML elements.
 *
 * @param {Array<Object>} apartments - An array of apartment objects to render.
 * Each object should have the following properties:
 *  - `apartmentName` {string}: The name or identifier of the apartment.
 *  - `percentage` {number}: The percentage value attributed to the apartment.
 *
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
                                        <label>Ποσοστό (%)</label>
                                        <input type="number" class="form-control apartment-sqm" step="0.01" min="0" value="${apartment.percentage}">
                                    </div>
                                </div>
                            </div>
                           
                        </div>    

`;
        listContainer.appendChild(item);
    });
}

function resetForm() {
    if (!confirm('Είστε σίγουροι ότι θέλετε να καθαρίσετε τη φόρμα; Όλα τα δεδομένα θα χαθούν!')) {
        return;
    }

    // Reset month and year to current date


    // Clear expense inputs
    document.getElementById('lastMeasurement').value = '';
    document.getElementById('currentMeasurement').value = '';
    document.getElementById('powerConsumption').value = '';
    document.getElementById('fees').value = '';
    document.getElementById('bill').value = '';

    // Clear results
    resultsBody.innerHTML = '';
    totalSqmAmount.textContent = '0.00 €';
}

function calculateElectricity() {
    const apartments = document.querySelectorAll('.apartment-item');
    // console.log(apartments[0]);
    let totalCoverage = 0;
    const apartmentsData = [];
    apartments.forEach(apartment => {
        totalCoverage += parseFloat(apartment.querySelector('.apartment-sqm').value);
        apartmentsData.push({
            apartmentName: apartment.querySelector('.apartment-name').value,
            millimeters: apartment.querySelector('.apartment-sqm').value,
            fees: 0
        });
    })
    console.log(apartmentsData);

    const inputFields = [
        {id: 'lastMeasurement', parse: (v) => parseInt(v) || 0},
        {id: 'currentMeasurement', parse: (v) => parseInt(v) || 0},
        {id: 'powerConsumption', parse: (v) => parseInt(v) || 0},
        {id: 'fees', parse: (v) => parseFloat(v) || 0},
        {id: 'bill', parse: (v) => parseFloat(v) || 0}
    ].map(field => ({...field, value: field.parse(document.getElementById(field.id).value)}));

    const [lastMeasurement, currentMeasurement, powerConsumption, fees, bill] = inputFields.map(field => field.value);

    if (lastMeasurement === 0 || currentMeasurement === 0 || powerConsumption === 0 || fees === 0 || bill === 0) {
        alert('Παρακαλώ συμπληρώστε όλα τα πεδία!');
        return;
    }
     console.log(inputFields);


}