const listContainer = document.getElementById('apartmentsList');
const calculateBtn = document.getElementById('calculateBtn');
const resultsBody = document.getElementById('resultsBody');
const totalAmount = document.getElementById('totalAmount');
const printBtn = document.getElementById('printBtn');
const resetBtn = document.getElementById('resetBtn');
const params = new URLSearchParams(window.location.search);
const group = params.get('group');


calculateBtn.addEventListener('click', calculateWaterExpenses );
printBtn.addEventListener('click', printWaterResults);
resetBtn.addEventListener('click', resetWaterForm);

document.addEventListener('DOMContentLoaded', () => {
    // Use apartmentsData directly
    // console.log(apartmentsData);

    if (group === 'A') {
        renderApartmentsWater(apartmentsDataWaterOne);
    } else {
        renderApartmentsWater(apartmentsDataWaterTwo);
    }


});

function renderApartmentsWater(apartments) {
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
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Προηγούμενη Ένδειξη (m³)</label>
                                        <input type="text" class="form-control apartment-last-reading" placeholder="π.χ. Διαμ. 1" value="${apartment.lastReading}">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Τωρινή Ένδειξη (m³)</label>
                                        <input type="number" class="form-control apartment-current-reading" step="0.01" min="0" value="${apartment.currentReading}">
                                    </div>
                                </div>
                            </div>
                           
                        </div>    

`;
        listContainer.appendChild(item);
    });
}

function printWaterResults() {
    // // First make sure we have results to print
    // if (document.querySelectorAll('#resultsBody tr').length === 0) {
    //     alert('Παρακαλώ υπολογίστε πρώτα τα κοινόχρηστα για να εκτυπώσετε τα αποτελέσματα!');
    //     return;
    // }
    // // Create a printable version
    // const printWindow = window.open('', '_blank');
    // printWindow.document.write(`
    //         <!DOCTYPE html>
    //         <html lang="el">
    //         <head>
    //             <title>Νερό - Εκτύπωση</title>
    //             <link href="css/bootstrap.min.css" rel="stylesheet">
    //             <style>
    //                 body { padding: 20px; }
    //                 @media print {
    //                     .no-print { display: none; }
    //                 }
    //             </style>
    //         </head>
    //         <body>
    //             <div class="container">
    //                 <h1 class="text-center mb-4">Υπολογισμός Νερου</h1>
    //
    //                 <h4>Λογαριασμος:</h4>
    //                 <ul>
    //                     <li>Προηγούμενη Ένδειξη (m³): ${document.getElementById('lastMeasurement').value || '0'} €</li>
    //                     <li>Τωρινή Ένδειξη (m³): ${document.getElementById('currentMeasurement').value || '0'} €</li>
    //                     <li>Ποσό πληρωμής (€): ${document.getElementById('elevator').value || '0'} €</li>
    //                 </ul>
    //
    //                 <h4>Αποτελέσματα:</h4>
    //                 <div class="table-responsive">
    //                     ${document.querySelector('.table-responsive').innerHTML}
    //                 </div>
    //
    //                 <div class="row mt-4 no-print">
    //                     <div class="col-12 text-center">
    //                         <button onclick="window.print()" class="btn btn-primary">Εκτύπωση</button>
    //                         <button onclick="window.close()" class="btn btn-secondary">Κλείσιμο</button>
    //                     </div>
    //                 </div>
    //             </div>
    //         </body>
    //         </html>
    //     `);
    // printWindow.document.close();

    if (document.querySelectorAll('#resultsBody tr').length === 0) {
        alert('Παρακαλώ υπολογίστε πρώτα τα κοινόχρηστα για να εκτυπώσετε τα αποτελέσματα!');
        return;
    }

    // Get the selected month and year


    // Get the month name in Greek
    const monthNames = [
        'Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος',
        'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'
    ];


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
                    <h1 class="text-center mb-4">Υπολογισμός Κοινοχρήστων</h1>
                    

                    <h4>Έξοδα:</h4>
                    <ul>
                        <li>Προηγούμενη Ένδειξη: ${document.getElementById('lastMeasurement').value || '0'} m³</li>
                        <li>Τωρινή Ένδειξη: ${document.getElementById('currentMeasurement').value || '0'} m³</li>
                        <li>Λογαριασμός Νερού: ${document.getElementById('bill').value || '0.00'} €</li>
                    </ul>

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

function resetWaterForm() {
    if (!confirm('Είστε σίγουροι ότι θέλετε να καθαρίσετε τη φόρμα; Όλα τα δεδομένα θα χαθούν!')) {
        return;
    }



    // Clear expense inputs
    document.getElementById('lastMeasurement').value = '';
    document.getElementById('currentMeasurement').value = '';
    document.getElementById('bill').value = '';

    // Clear results
    resultsBody.innerHTML = '';
    totalSqmAmount.textContent = '0.00 €';
}


function calculateWaterExpenses() {
    const apartments = document.querySelectorAll('.apartment-item');
    // console.log(apartments);

    let totalVolume = 0;

    const apartmentsData = [];
    // This loop populates the apartmentsData array with each apartment's name and millimeters
    apartments.forEach(apartment => {
        totalVolume += apartment.querySelector('.apartment-current-reading').value - apartment.querySelector('.apartment-last-reading').value;
        apartmentsData.push({
            apartmentName: apartment.querySelector('.apartment-name').value,
            millimeters: parseFloat(apartment.querySelector('.apartment-sqm').value),
            lastReading: parseFloat(apartment.querySelector('.apartment-last-reading').value) || 0,
            currentReading: parseFloat(apartment.querySelector('.apartment-current-reading').value) || 0,
            volume: apartment.querySelector('.apartment-current-reading').value - apartment.querySelector('.apartment-last-reading').value,
            fees: 0
        });
    })

    const inputFields = [
        {id: 'lastMeasurement', parse: (v) => parseInt(v)},
        {id: 'currentMeasurement', parse: (v) => parseInt(v)},
        {id: 'bill', parse: (v) => parseFloat(v) || 0},
    ].map(field => ({...field, value: field.parse(document.getElementById(field.id).value)}));

    const [ lastMeasurement, currentMeasurement, bill] = inputFields.map(field => field.value);

    // apartmentsData.forEach(apartment => {
    //     const volume = apartment.currentReading - apartment.lastReading;
    //     apartment.volume = volume > 0 ? volume : 0; // Ensure volume is not negative
    //     apartment.fees = parseFloat(((apartment.volume / totalVolume) * bill).toFixed(2));
    // })




    // const totalFees = (cleaningFee + electricityFee + elevatorFee + waterFee + otherFee).toFixed(2);
    //
    // let sumOfFees = 0;
    //
    resultsBody.innerHTML = '';

    apartmentsData.forEach(apartment => {
        const volume = apartment.currentReading - apartment.lastReading;
        apartment.volume = volume > 0 ? volume : 0; // Ensure volume is not negative
        apartment.fees = parseFloat(((apartment.volume / totalVolume) * bill).toFixed(2));

        const row = document.createElement('tr');
        row.innerHTML = `
                <td>${apartment.apartmentName}</td>
                <td>${apartment.volume}</td>
                <td><strong>${apartment.fees} €</strong></td>
            `;

        resultsBody.appendChild(row);
    })
    totalAmount.textContent = bill;


}