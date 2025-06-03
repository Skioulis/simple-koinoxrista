```javascript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const addApartmentBtn = document.getElementById('addApartment');
    const calculateBtn = document.getElementById('calculateBtn');
    const apartmentsList = document.getElementById('apartmentsList');
    const resultsBody = document.getElementById('resultsBody');
    const totalSqmAmount = document.getElementById('totalSqmAmount');
    const monthSelect = document.getElementById('month');
    const yearSelect = document.getElementById('year');

    // Initialize month and year dropdowns with current date
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
    const currentYear = currentDate.getFullYear();

    // Set the current month and year as selected
    monthSelect.value = currentMonth;

    // Check if the current year exists in the dropdown, if not add it
    if (!Array.from(yearSelect.options).some(option => option.value === currentYear.toString())) {
        const option = document.createElement('option');
        option.value = currentYear;
        option.textContent = currentYear;
        yearSelect.appendChild(option);
    }
    yearSelect.value = currentYear;

    // Listen for database ready event
    document.addEventListener('db-ready', function() {
        console.log('Database is ready, loading apartment data...');
        loadCsvData();
    });

    // Listen for database error event
    document.addEventListener('db-error', function(event) {
        console.error('Database initialization failed:', event.detail);
        alert('Σφάλμα κατά την αρχικοποίηση της βάσης δεδομένων. Τα δεδομένα θα αποθηκευτούν μόνο τοπικά.');
    });

    // Try to load apartment data immediately in case database is already initialized
    if (window.db) {
        console.log('Database already initialized, loading apartment data...');
        loadCsvData();
    }

    // Add buttons to the DOM for save, load, print, and reset
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'row mb-4';
    actionsDiv.innerHTML = `
        <div class="col-12 d-flex justify-content-center gap-2">
            <button type="button" class="btn btn-primary" id="saveBtn">Αποθήκευση Όλων</button>
            <button type="button" class="btn btn-info" id="loadBtn">Φόρτωση Δεδομένων</button>
            <button type="button" class="btn btn-secondary" id="printBtn">Εκτύπωση</button>
            <button type="button" class="btn btn-warning" id="resetBtn">Καθαρισμός Φόρμας</button>
        </div>
    `;

    // Insert after the calculate button
    document.querySelector('.col-12.text-center.mb-4').after(actionsDiv);

    // Get references to the new buttons
    const saveBtn = document.getElementById('saveBtn');
    const loadBtn = document.getElementById('loadBtn');
    const printBtn = document.getElementById('printBtn');
    const resetBtn = document.getElementById('resetBtn');

    // Add event listeners
    addApartmentBtn.addEventListener('click', addApartment);
    calculateBtn.addEventListener('click', calculateExpenses);
    saveBtn.addEventListener('click', saveData);
    loadBtn.addEventListener('click', loadData);
    printBtn.addEventListener('click', printResults);
    resetBtn.addEventListener('click', resetForm);

    // Add event listener to the initial remove button
    document.querySelector('.remove-apartment').addEventListener('click', function() {
        if (document.querySelectorAll('.apartment-item').length > 1) {
            this.closest('.apartment-item').remove();
        } else {
            alert('Πρέπει να υπάρχει τουλάχιστον ένα διαμέρισμα!');
        }
    });


    // Function to add a new apartment
    function addApartment() {
        const apartmentItem = document.createElement('div');
        apartmentItem.className = 'apartment-item mb-3 p-3 border rounded';

        apartmentItem.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label>Όνομα/Αριθμός</label>
                        <input type="text" class="form-control apartment-name" placeholder="π.χ. Διαμ. 1">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label>Χιλιοστά (‰)</label>
                        <input type="number" class="form-control apartment-sqm" step="0.01" min="0">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 d-flex justify-content-end">
                    <button type="button" class="btn btn-sm btn-danger remove-apartment mt-2">Αφαίρεση</button>
                </div>
            </div>
        `;

        apartmentsList.appendChild(apartmentItem);

        // Add event listener to the new remove button
        apartmentItem.querySelector('.remove-apartment').addEventListener('click', function() {
            if (document.querySelectorAll('.apartment-item').length > 1) {
                this.closest('.apartment-item').remove();
            } else {
                alert('Πρέπει να υπάρχει τουλάχιστον ένα διαμέρισμα!');
            }
        });

    }

    // Function to calculate expenses
    function calculateExpenses() {
        // Validate inputs before calculation
        if (!validateInputs()) {
            return;
        }

        // Get expense values
        const cleaning = parseFloat(document.getElementById('cleaning').value) || 0;
        const electricity = parseFloat(document.getElementById('electricity').value) || 0;
        const elevator = parseFloat(document.getElementById('elevator').value) || 0;
        const water = parseFloat(document.getElementById('water').value) || 0;
        const other = parseFloat(document.getElementById('other').value) || 0;

        // Calculate total expenses
        const totalExpenses = cleaning + electricity + elevator + water + other;

        // Get all apartments
        const apartments = document.querySelectorAll('.apartment-item');

        // Calculate total square meters
        let totalSqm = 0;

        apartments.forEach(apartment => {
            const sqm = parseFloat(apartment.querySelector('.apartment-sqm').value) || 0;
            totalSqm += sqm;
        });

        // Calculate cost per square meter
        const costPerSqm = totalSqm > 0 ? totalExpenses / totalSqm : 0;

        // Clear previous results
        resultsBody.innerHTML = '';

        // Calculate and display results for each apartment
        let totalSqmAmountValue = 0;

        apartments.forEach(apartment => {
            const name = apartment.querySelector('.apartment-name').value || 'Χωρίς όνομα';
            const sqm = parseFloat(apartment.querySelector('.apartment-sqm').value) || 0;

            const amount = sqm * costPerSqm;
            totalSqmAmountValue += amount;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${name}</td>
                <td>${sqm.toFixed(2)}</td>
                <td><strong>${amount.toFixed(2)} €</strong></td>
            `;

            resultsBody.appendChild(row);
        });

        // Update total
        totalSqmAmount.textContent = totalSqmAmountValue.toFixed(2) + ' €';
    }


    // Function to save all data to localStorage and SQLite database
    function saveData() {
        // Add logging to debug database availability
        console.log('Save button clicked');
        console.log('window.db:', window.db);
        console.log('saveApartments function exists:', typeof saveApartments === 'function');
        console.log('saveExpenses function exists:', typeof saveExpenses === 'function');

        // Collect all expense data
        const expenseData = {
            month: document.getElementById('month').value,
            year: document.getElementById('year').value,
            cleaning: document.getElementById('cleaning').value,
            electricity: document.getElementById('electricity').value,
            elevator: document.getElementById('elevator').value,
            water: document.getElementById('water').value,
            other: document.getElementById('other').value
        };

        // Collect all apartment data
        const apartmentsData = [];
        document.querySelectorAll('.apartment-item').forEach(apartment => {
            apartmentsData.push({
                name: apartment.querySelector('.apartment-name').value,
                sqm: apartment.querySelector('.apartment-sqm').value
            });
        });

        // Save to localStorage
        const saveData = {
            expenses: expenseData,
            apartments: apartmentsData,
            timestamp: new Date().toLocaleString()
        };

        localStorage.setItem('koinoxristaData', JSON.stringify(saveData));

        // Save data to SQLite database
        if (window.db && typeof saveApartments === 'function') {
            try {
                console.log('Attempting to save apartments to database...');
                // Save apartments
                saveApartments(apartmentsData);
                console.log('Apartments saved successfully to database');

                // Try to save expenses if the function exists
                let expensesSaved = false;
                if (typeof saveExpenses === 'function') {
                    try {
                        console.log('Attempting to save expenses to database...');
                        saveExpenses(expenseData);
                        expensesSaved = true;
                        console.log('Expenses saved successfully to database');
                    } catch (expenseError) {
                        console.error('Error saving expenses to database:', expenseError);
                        // Continue with apartment data saved
                    }
                }

                // Export database to file
                if (typeof exportDatabase === 'function') {
                    try {
                        const dbData = exportDatabase();
                        if (dbData) {
                            // Create a download link for the database file
                            const blob = new Blob([dbData], { type: 'application/octet-stream' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'data.db';
                            a.style.display = 'none';
                            document.body.appendChild(a);
                            a.click();
                            URL.revokeObjectURL(url);
                            document.body.removeChild(a);

                            if (expensesSaved) {
                                alert('Όλα τα δεδομένα αποθηκεύτηκαν επιτυχώς στη βάση δεδομένων και στο localStorage! Το αρχείο data.db έχει δημιουργηθεί.');
                            } else {
                                alert('Τα διαμερίσματα αποθηκεύτηκαν επιτυχώς στη βάση δεδομένων και στο localStorage! Το αρχείο data.db έχει δημιουργηθεί.');
                            }
                        } else {
                            if (expensesSaved) {
                                alert('Όλα τα δεδομένα αποθηκεύτηκαν επιτυχώς στη βάση δεδομένων και στο localStorage!');
                            } else {
                                alert('Τα διαμερίσματα αποθηκεύτηκαν επιτυχώς στη βάση δεδομένων και στο localStorage!');
                            }
                        }
                    } catch (exportError) {
                        console.error('Error exporting database:', exportError);
                        if (expensesSaved) {
                            alert('Όλα τα δεδομένα αποθηκεύτηκαν επιτυχώς στη βάση δεδομένων και στο localStorage, αλλά υπήρξε σφάλμα κατά την εξαγωγή της βάσης δεδομένων!');
                        } else {
                            alert('Τα διαμερίσματα αποθηκεύτηκαν επιτυχώς στη βάση δεδομένων και στο localStorage, αλλά υπήρξε σφάλμα κατά την εξαγωγή της βάσης δεδομένων!');
                        }
                    }
                } else {
                    if (expensesSaved) {
                        alert('Όλα τα δεδομένα αποθηκεύτηκαν επιτυχώς στη βάση δεδομένων και στο localStorage!');
                    } else {
                        alert('Τα διαμερίσματα αποθηκεύτηκαν επιτυχώς στη βάση δεδομένων και στο localStorage!');
                    }
                }
            } catch (error) {
                console.error('Error saving apartments to database:', error);
                alert('Τα δεδομένα αποθηκεύτηκαν επιτυχώς στο localStorage, αλλά υπήρξε σφάλμα κατά την αποθήκευση των διαμερισμάτων στη βάση δεδομένων!');
            }
        } else {
            console.log('Database not available for saving');
            alert('Τα δεδομένα αποθηκεύτηκαν επιτυχώς στο localStorage! (Η βάση δεδομένων δεν είναι διαθέσιμη)');
        }
    }

    // Function to load data from database and localStorage
    function loadData() {
        // Try to load from database first
        let loadedFromDb = false;
        let loadedApartmentsFromDb = false;
        let data = null;

        if (window.db) {
            try {
                // Get current month and year values
                const month = document.getElementById('month').value;
                const year = document.getElementById('year').value;

                // Try to load expenses from database
                if (typeof getExpenses === 'function') {
                    const dbExpenses = getExpenses(month, year);

                    if (dbExpenses) {
                        // Set form values from database
                        document.getElementById('cleaning').value = dbExpenses.cleaning || '';
                        document.getElementById('electricity').value = dbExpenses.electricity || '';
                        document.getElementById('elevator').value = dbExpenses.elevator || '';
                        document.getElementById('water').value = dbExpenses.water || '';
                        document.getElementById('other').value = dbExpenses.other || '';

                        loadedFromDb = true;
                        console.log('Loaded expenses from database');
                    }
                }

                // Try to load apartments from database
                if (typeof getApartments === 'function') {
                    const apartments = getApartments();

                    if (apartments && apartments.length > 0) {
                        // Clear existing apartments except the first one
                        const apartmentItems = document.querySelectorAll('.apartment-item');
                        for (let i = 1; i < apartmentItems.length; i++) {
                            apartmentItems[i].remove();
                        }

                        // Get the first apartment element
                        const firstApartment = document.querySelector('.apartment-item');

                        // Process each apartment
                        apartments.forEach((apartment, index) => {
                            if (index === 0) {
                                // Update the first apartment
                                if (firstApartment) {
                                    firstApartment.querySelector('.apartment-name').value = apartment.name;
                                    firstApartment.querySelector('.apartment-sqm').value = apartment.millimeters;
                                }
                            } else {
                                // Add new apartment
                                addApartment();
                                const newApartment = document.querySelectorAll('.apartment-item')[index];
                                newApartment.querySelector('.apartment-name').value = apartment.name;
                                newApartment.querySelector('.apartment-sqm').value = apartment.millimeters;
                            }
                        });

                        loadedApartmentsFromDb = true;
                        console.log('Loaded apartments from database');
                    }
                }
            } catch (error) {
                console.error('Error loading from database:', error);
            }
        }

        // If we couldn't load from database, try localStorage
        if (!loadedFromDb || !loadedApartmentsFromDb) {
            const savedData = localStorage.getItem('koinoxristaData');

            if (!savedData) {
                if (!loadedFromDb && !loadedApartmentsFromDb) {
                    alert('Δεν βρέθηκαν αποθηκευμένα δεδομένα!');
                    return;
                }
            } else {
                try {
                    data = JSON.parse(savedData);

                    // Load expense data if not already loaded from database
                    if (!loadedFromDb && data.expenses) {
                        // Load month and year if available
                        if (data.expenses.month) {
                            document.getElementById('month').value = data.expenses.month;
                        }
                        if (data.expenses.year) {
                            document.getElementById('year').value = data.expenses.year;
                        }

                        document.getElementById('cleaning').value = data.expenses.cleaning || '';
                        document.getElementById('electricity').value = data.expenses.electricity || '';
                        document.getElementById('elevator').value = data.expenses.elevator || '';
                        document.getElementById('water').value = data.expenses.water || '';
                        document.getElementById('other').value = data.expenses.other || '';
                    }

                    // Load apartment data if not already loaded from database
                    if (!loadedApartmentsFromDb && data.apartments && data.apartments.length > 0) {
                        // Clear existing apartments except the first one
                        const apartmentItems = document.querySelectorAll('.apartment-item');
                        for (let i = 1; i < apartmentItems.length; i++) {
                            apartmentItems[i].remove();
                        }

                        // Update the first apartment
                        const firstApartment = document.querySelector('.apartment-item');
                        if (firstApartment && data.apartments[0]) {
                            firstApartment.querySelector('.apartment-name').value = data.apartments[0].name || '';
                            firstApartment.querySelector('.apartment-sqm').value = data.apartments[0].sqm || '';
                        }

                        // Add the rest of the apartments
                        for (let i = 1; i < data.apartments.length; i++) {
                            addApartment();
                            const newApartment = document.querySelectorAll('.apartment-item')[i];
                            newApartment.querySelector('.apartment-name').value = data.apartments[i].name || '';
                            newApartment.querySelector('.apartment-sqm').value = data.apartments[i].sqm || '';
                        }
                    }
                } catch (error) {
                    console.error('Error parsing saved data:', error);
                    if (!loadedFromDb && !loadedApartmentsFromDb) {
                        alert('Σφάλμα κατά τη φόρτωση των δεδομένων από το localStorage!');
                        return;
                    }
                }
            }
        }

        // Show success message
        if (loadedFromDb && loadedApartmentsFromDb) {
            alert('Όλα τα δεδομένα φορτώθηκαν επιτυχώς από τη βάση δεδομένων!');
        } else if (loadedFromDb) {
            alert('Τα έξοδα φορτώθηκαν από τη βάση δεδομένων και τα διαμερίσματα από το localStorage!');
        } else if (loadedApartmentsFromDb) {
            alert('Τα διαμερίσματα φορτώθηκαν από τη βάση δεδομένων και τα έξοδα από το localStorage!');
        } else if (data && data.timestamp) {
            alert(`Τα δεδομένα φορτώθηκαν επιτυχώς από το localStorage! (Αποθηκεύτηκαν: ${data.timestamp})`);
        }

        // Calculate expenses with the loaded data
        calculateExpenses();
    }

    // Function to print results
    function printResults() {
        // First make sure we have results to print
        if (document.querySelectorAll('#resultsBody tr').length === 0) {
            alert('Παρακαλώ υπολογίστε πρώτα τα κοινόχρηστα για να εκτυπώσετε τα αποτελέσματα!');
            return;
        }

        // Get the selected month and year
        const monthValue = document.getElementById('month').value;
        const yearValue = document.getElementById('year').value;

        // Get the month name in Greek
        const monthNames = [
            'Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος',
            'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'
        ];
        const monthName = monthNames[parseInt(monthValue) - 1];

        // Create a formatted date string
        const formattedDate = `${monthName} ${yearValue}`;

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
                    <p class="text-center mb-4">Περίοδος: ${formattedDate}</p>

                    <h4>Έξοδα:</h4>
                    <ul>
                        <li>Καθαριότητα: ${document.getElementById('cleaning').value || '0'} €</li>
                        <li>Ρεύμα Κοινόχρηστων: ${document.getElementById('electricity').value || '0'} €</li>
                        <li>Συντήρηση Ανελκυστήρα: ${document.getElementById('elevator').value || '0'} €</li>
                        <li>Νερό: ${document.getElementById('water').value || '0'} €</li>
                        <li>Άλλα Έξοδα: ${document.getElementById('other').value || '0'} €</li>
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

    // Function to validate inputs
    function validateInputs() {
        // Check if at least one expense has been entered
        const cleaning = parseFloat(document.getElementById('cleaning').value) || 0;
        const electricity = parseFloat(document.getElementById('electricity').value) || 0;
        const elevator = parseFloat(document.getElementById('elevator').value) || 0;
        const water = parseFloat(document.getElementById('water').value) || 0;
        const other = parseFloat(document.getElementById('other').value) || 0;

        const totalExpenses = cleaning + electricity + elevator + water + other;

        if (totalExpenses <= 0) {
            alert('Παρακαλώ εισάγετε τουλάχιστον ένα έξοδο!');
            return false;
        }

        // Check if all apartments have valid data
        const apartments = document.querySelectorAll('.apartment-item');
        let isValid = true;

        apartments.forEach((apartment, index) => {
            const name = apartment.querySelector('.apartment-name').value.trim();
            const sqm = parseFloat(apartment.querySelector('.apartment-sqm').value) || 0;

            if (name === '') {
                alert(`Παρακαλώ εισάγετε όνομα για το διαμέρισμα #${index + 1}!`);
                isValid = false;
                return;
            }

            if (sqm <= 0) {
                alert(`Παρακαλώ εισάγετε έγκυρα χιλιοστά για το διαμέρισμα "${name}"!`);
                isValid = false;
                return;
            }
        });

        return isValid;
    }

    // Function to reset the form
    function resetForm() {
        if (!confirm('Είστε σίγουροι ότι θέλετε να καθαρίσετε τη φόρμα; Όλα τα δεδομένα θα χαθούν!')) {
            return;
        }

        // Reset month and year to current date
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
        const currentYear = currentDate.getFullYear();

        document.getElementById('month').value = currentMonth;

        // Check if the current year exists in the dropdown, if not add it
        const yearSelect = document.getElementById('year');
        if (!Array.from(yearSelect.options).some(option => option.value === currentYear.toString())) {
            const option = document.createElement('option');
            option.value = currentYear;
            option.textContent = currentYear;
            yearSelect.appendChild(option);
        }
        yearSelect.value = currentYear;

        // Clear expense inputs
        document.getElementById('cleaning').value = '';
        document.getElementById('electricity').value = '';
        document.getElementById('elevator').value = '';
        document.getElementById('water').value = '';
        document.getElementById('other').value = '';

        // Clear all apartments except the first one
        const apartmentItems = document.querySelectorAll('.apartment-item');
        for (let i = 1; i < apartmentItems.length; i++) {
            apartmentItems[i].remove();
        }

        // Clear the first apartment
        const firstApartment = document.querySelector('.apartment-item');
        if (firstApartment) {
            firstApartment.querySelector('.apartment-name').value = '';
            firstApartment.querySelector('.apartment-sqm').value = '';
        }

        // Clear results
        resultsBody.innerHTML = '';
        totalSqmAmount.textContent = '0.00 €';
    }

    // Function to load apartment and expense data from CSV file, SQLite database, or localStorage
    function loadCsvData() {
        // Check if the database is initialized
        if (!window.db) {
            console.log('SQLite database not initialized. Waiting for initialization...');
            // Wait for database initialization
            setTimeout(loadCsvData, 500);
            return;
        }

        try {
            let loadedApartmentsFromDb = false;
            let loadedExpensesFromDb = false;

            // Check if there's already data in the database
            if (typeof getApartments === 'function') {
                const apartments = getApartments();

                if (apartments && apartments.length > 0) {
                    console.log('Data already exists in the database. Using database data instead of CSV.');

                    // Clear existing apartments except the first one
                    const apartmentItems = document.querySelectorAll('.apartment-item');
                    for (let i = 1; i < apartmentItems.length; i++) {
                        apartmentItems[i].remove();
                    }

                    // Get the first apartment element
                    const firstApartment = document.querySelector('.apartment-item');

                    // Process each apartment
                    apartments.forEach((apartment, index) => {
                        if (index === 0) {
                            // Update the first apartment
                            if (firstApartment) {
                                firstApartment.querySelector('.apartment-name').value = apartment.name;
                                firstApartment.querySelector('.apartment-sqm').value = apartment.millimeters;
                            }
                        } else {
                            // Add new apartment
                            addApartment();
                            const newApartment = document.querySelectorAll('.apartment-item')[index];
                            newApartment.querySelector('.apartment-name').value = apartment.name;
                            newApartment.querySelector('.apartment-sqm').value = apartment.millimeters;
                        }
                    });

                    loadedApartmentsFromDb = true;
                    console.log('Apartments loaded from database.');
                    return; // Skip CSV loading
                }
            }

            // If no data in database, try to load from CSV file
            fetch('data.csv')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to load CSV file');
                    }
                    return response.text();
                })
                .then(csvText => {
                    const apartments = parseCSV(csvText);

                    // Clear existing apartments
                    apartmentsList.innerHTML = '';

                    apartments.forEach(apartment => {
                        const apartmentItem = document.createElement('div');
                        apartmentItem.className = 'apartment-item mb-3 p-3 border rounded';

                        apartmentItem.innerHTML = `
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Όνομα/Αριθμός</label>
                                        <input type="text" class="form-control apartment-name" value="${apartment.name}" placeholder="π.χ. Διαμ. 1">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Χιλιοστά (‰)</label>
                                        <input type="number" class="form-control apartment-sqm" value="${apartment.sqm}" step="0.01" min="0">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12 d-flex justify-content-end">
                                    <button type="button" class="btn btn-sm btn-danger remove-apartment mt-2">Αφαίρεση</button>
                                </div>
                            </div>
                        `;
                        apartmentsList.appendChild(apartmentItem);

                        apartmentItem.querySelector('.remove-apartment').addEventListener('click', function() {
                            if (document.querySelectorAll('.apartment-item').length > 1) {
                                this.closest('.apartment-item').remove();
                            } else {
                                alert('Πρέπει να υπάρχει τουλάχιστον ένα διαμέρισμα!');
                            }
                        });
                    });
                })
                .catch(error => {
                    console.error('Error loading CSV data:', error);
                });

            // Get apartments from database (this will be used if CSV loading fails)
            if (typeof getApartments === 'function') {
                const apartments = getApartments();

                if (apartments && apartments.length > 0) {
                    // We'll only use this if CSV loading fails
                    loadedApartmentsFromDb = true;
                }
            }

            // Try to load expenses from database
            if (typeof getExpenses === 'function') {
                // Get current month and year values
                const month = document.getElementById('month').value;
                const year = document.getElementById('year').value;

                const dbExpenses = getExpenses(month, year);

                if (dbExpenses) {
                    // Set form values from database
                    document.getElementById('cleaning').value = dbExpenses.cleaning || '';
                    document.getElementById('electricity').value = dbExpenses.electricity || '';
                    document.getElementById('elevator').value = dbExpenses.elevator || '';
                    document.getElementById('water').value = dbExpenses.water || '';
                    document.getElementById('other').value = dbExpenses.other || '';

                    loadedExpensesFromDb = true;
                    console.log('Expenses loaded from database.');
                }
            }

            // If we loaded data from the database, calculate expenses and return
            if (loadedApartmentsFromDb && loadedExpensesFromDb) {
                console.log('All data loaded from database.');
                calculateExpenses();
                return;
            }

            // If we didn't load all data from database, try to load from localStorage
            if (!loadedApartmentsFromDb || !loadedExpensesFromDb) {
                console.log('Some data not found in database. Checking localStorage...');
                const savedData = localStorage.getItem('koinoxristaData');

                if (savedData) {
                    try {
                        const data = JSON.parse(savedData);

                        // Load apartment data if not already loaded from database
                        if (!loadedApartmentsFromDb && data.apartments && data.apartments.length > 0) {
                            // Clear existing apartments except the first one
                            const apartmentItems = document.querySelectorAll('.apartment-item');
                            for (let i = 1; i < apartmentItems.length; i++) {
                                apartmentItems[i].remove();
                            }

                            // Get the first apartment element
                            const firstApartment = document.querySelector('.apartment-item');

                            // Update the first apartment
                            if (firstApartment && data.apartments[0]) {
                                firstApartment.querySelector('.apartment-name').value = data.apartments[0].name || '';
                                firstApartment.querySelector('.apartment-sqm').value = data.apartments[0].sqm || '';
                            }

                            // Add the rest of the apartments
                            for (let i = 1; i < data.apartments.length; i++) {
                                addApartment();
                                const newApartment = document.querySelectorAll('.apartment-item')[i];
                                newApartment.querySelector('.apartment-name').value = data.apartments[i].name || '';
                                newApartment.querySelector('.apartment-sqm').value = data.apartments[i].sqm || '';
                            }
                            console.log('Apartments loaded from localStorage.');
                        }

                        // Load expense data if not already loaded from database
                        if (!loadedExpensesFromDb && data.expenses) {
                            // Load month and year if available
                            if (data.expenses.month) {
                                document.getElementById('month').value = data.expenses.month;
                            }
                            if (data.expenses.year) {
                                document.getElementById('year').value = data.expenses.year;
                            }

                            document.getElementById('cleaning').value = data.expenses.cleaning || '';
                            document.getElementById('electricity').value = data.expenses.electricity || '';
                            document.getElementById('elevator').value = data.expenses.elevator || '';
                            document.getElementById('water').value = data.expenses.water || '';
                            document.getElementById('other').value = data.expenses.other || '';

                            console.log('Expenses loaded from localStorage.');
                        }

                        // Calculate expenses with the loaded data
                        calculateExpenses();
                    } catch (error) {
                        console.error('Error parsing saved data from localStorage:', error);
                    }
                } else {
                    console.log('No saved data found in localStorage.');
                }
            }
        } catch (error) {
            console.error('Error loading data from database:', error);

            // Try to load from localStorage as fallback
            const savedData = localStorage.getItem('koinoxristaData');

            if (savedData) {
                try {
                    const data = JSON.parse(savedData);

                    if (data.apartments && data.apartments.length > 0) {
                        // Clear existing apartments except the first one
                        const apartmentItems = document.querySelectorAll('.apartment-item');
                        for (let i = 1; i < apartmentItems.length; i++) {
                            apartmentItems[i].remove();
                        }

                        // Get the first apartment element
                        const firstApartment = document.querySelector('.apartment-item');

                        // Update the first apartment
                        if (firstApartment && data.apartments[0]) {
                            firstApartment.querySelector('.apartment-name').value = data.apartments[0].name || '';
                            firstApartment.querySelector('.apartment-sqm').value = data.apartments[0].sqm || '';
                        }

                        // Add the rest of the apartments
                        for (let i = 1; i < data.apartments.length; i++) {