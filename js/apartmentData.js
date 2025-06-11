const apartmentsData = [
    { apartmentName: "ΤΣΑΝΤΕΚΙΔΗΣ", millimeters: 217.61 },
    { apartmentName: "ΑΓΓΕΛΙΔΟΥ", millimeters: 420.4 },
    { apartmentName: "ΜΗΤΣΙΟΥ", millimeters: 133.39 },
    { apartmentName: "ΧΑΛΗΣ", millimeters: 71.33 },
    { apartmentName: "ΜΠΑΖΟΥΚΗΣ", millimeters: 157.27 }
];

const apartmentsDataWater = [
    {apartmentName: "ΚΟΙΝΟΧΡΗΣΤΟ", millimeters: 0 , lastReading: 1, currentReading: 2},
    { apartmentName: "ΤΣΑΝΤΕΚΙΔΗΣ", millimeters: 217.61, lastReading: 417, currentReading: 438},
    { apartmentName: "ΑΓΓΕΛΙΔΟΥ", millimeters: 420.4, lastReading: 2, currentReading: 23 },
    { apartmentName: "ΜΗΤΣΙΟΥ", millimeters: 133.39, lastReading: 13, currentReading: 28 },
    { apartmentName: "ΧΑΛΗΣ", millimeters: 71.33, lastReading: 10, currentReading: 19 },
    { apartmentName: "ΜΠΑΖΟΥΚΗΣ", millimeters: 157.27, lastReading: 4, currentReading: 8 }
];

const apartmentsDataWaterTwo = [

    { apartmentName: "ΑΓΓΕΛΙΔΟΥ", millimeters: 420.4, lastReading: 2, currentReading: 23 },
    { apartmentName: "ΜΠΑΖΟΥΚΗΣ", millimeters: 157.27, lastReading: 4, currentReading: 8 }
];

const apartmentsDataElectricity = [
    { apartmentName: "ΜΗΤΣΙΟΥ", percentage : 66 },
    { apartmentName: "ΧΑΛΗΣ", percentage : 34 }
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
