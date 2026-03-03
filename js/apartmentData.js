const apartmentsData = [
    { apartmentName: "A", millimeters: 217.61 },
    { apartmentName: "ΒΓ", millimeters: 420.4 },
    { apartmentName: "Δ1", millimeters: 133.39 },
    { apartmentName: "Δ2", millimeters: 71.33 },
    { apartmentName: "Ε", millimeters: 157.27 }
];

const apartmentsDataWaterOne = [
    {apartmentName: "ΚΟΙΝΟΧΡΗΣΤΟ", millimeters: 0 , lastReading: 0, currentReading: 0},
    { apartmentName: "Α", millimeters: 217.61, lastReading: 0, currentReading: 0},
    { apartmentName: "Δ1", millimeters: 133.39, lastReading: 0, currentReading: 0 },
    { apartmentName: "Δ2", millimeters: 71.33, lastReading: 0, currentReading: 0 },

];

const apartmentsDataWaterTwo = [

    { apartmentName: "ΒΓ", millimeters: 420.4, lastReading: 0, currentReading: 0 },
    { apartmentName: "Ε", millimeters: 157.27, lastReading: 0, currentReading: 0 }
];

const apartmentsDataElectricity = [
    { apartmentName: "Δ1", percentage : 66 },
    { apartmentName: "Δ2", percentage : 34 }
];

// const greekMonths = [];
// for (let i = 0; i < 12; i++) {
//     // Create a date for the 1st of each month
//     const date = new Date(2020, i, 1);
//     // Format the date to get the month in Greek
//     const monthName = date.toLocaleString('el-GR', { month: 'long' });
//     greekMonths.push(monthName.charAt(0).toUpperCase() + monthName.slice(1)); // Capitalize first letter
// }
//
// console.log(greekMonths);
