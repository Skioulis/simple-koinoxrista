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
printBtn.addEventListener('click', printResults);


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
    resultsBody.innerHTML = '';
    const apartments = document.querySelectorAll('.apartment-item');
    // console.log(apartments[0]);
    let totalCoverage = 0;
    const apartmentsData = [];
    apartments.forEach(apartment => {
        totalCoverage += parseFloat(apartment.querySelector('.apartment-sqm').value);
        apartmentsData.push({
            apartmentName: apartment.querySelector('.apartment-name').value,
            millimeters: parseFloat(apartment.querySelector('.apartment-sqm').value),
            fees: 0,
            electricity: 0,
            total: 0
        });
    })
    // console.log(apartmentsData);

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
     // console.log(inputFields);


    apartmentsData[1].electricity = parseFloat((((currentMeasurement - lastMeasurement) / powerConsumption) * (bill - fees)).toFixed(2));
    apartmentsData[0].electricity = parseFloat((((powerConsumption - (currentMeasurement - lastMeasurement) ) / powerConsumption) * (bill - fees)).toFixed(2));

    let totalFees = 0;
    apartmentsData.forEach(apartment => {
        apartment.fees = parseFloat((fees * (apartment.millimeters / totalCoverage)).toFixed(2));
        apartment.total = parseFloat((apartment.electricity + apartment.fees).toFixed(2));
        totalFees += apartment.total;

        const row = document.createElement('tr');
        row.innerHTML = `
                <td>${apartment.apartmentName}</td>
                <td>${apartment.millimeters}</td>
                <td><strong>${apartment.total} €</strong></td>
            `;

        resultsBody.appendChild(row);
    })

    totalSqmAmount.textContent = totalFees;    //  console.log(apartmentsData);
}

function printResults() {
    // First make sure we have results to print
    if (document.querySelectorAll('#resultsBody tr').length === 0) {
        alert('Παρακαλώ υπολογίστε πρώτα τα κοινόχρηστα για να εκτυπώσετε τα αποτελέσματα!');
        return;
    }




    // Create a printable version
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Κοινόχρηστα - Εκτύπωση</title>
                <link href="css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body { padding: 20px; }
                    @media print {
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1 class="text-center mb-4">Υπολογισμός Ρεύματος</h1>
                    
                   

                    <h4>Αποτελέσματα:</h4>
                    <div class="table-responsive">
                        ${document.querySelector('.table-responsive').innerHTML}
                    </div>

                    <div class="row mt-4 no-print">
                        <div class="col-12 text-center">
                            <button onclick="window.print()" class="btn btn-primary">Εκτύπωση</button>
                            <button onclick="window.close()" class="btn btn-secondary">Κλείσιμο</button>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `);
    printWindow.document.close();
}