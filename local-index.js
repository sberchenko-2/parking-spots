let parking_data;

parking_data = [{slot_num: "62", location: "aboveground", availability: ["None", "None", "Howie", "None", "None", "None", "None"]},
                {slot_num: "63", location: "aboveground", availability: ["None", "None", "None", "None", "None", "None", "None"]},
                {slot_num: "032", location: "aboveground", availability: ["None", "None", "None", "None", "None", "None", "None"]},
                {slot_num: "146", location: "underground", availability: ["None", "None", "None", "None", "None", "None", "None"]},
                {slot_num: "148", location: "underground", availability: ["Derrick", "None", "None", "None", "None", "None", "None"]},
                {slot_num: "005", location: "underground", availability: ["None", "Natalia", "Natalia", "None", "None", "None", "None"]},
                {slot_num: "008", location: "underground", availability: ["None", "None", "None", "None", "None", "None", "None"]},
                {slot_num: "004", location: "underground", availability: ["None", "Andrey", "None", "Andrey", "Andrey", "None", "None"]},
                {slot_num: "44", location: "underground", availability: ["None", "Judy", "Judy", "Judy", "None", "None", "None"]},
                {slot_num: "49", location: "underground", availability: ["None", "Ryan", "Maurilio", "None", "Ryan", "None", "None"]},]

const days = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'];
const months = {1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June', 7: 'July',
                8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December'};

main();

async function main() {
  /**
   * Loads and displays initial state of parking
   */
  await load_data();
  display_data();
}

async function load_data() {
  /**
   * Loads in initial data from Azure function
   * @type {Response}
   */
  const response = await fetch('/api2/GetData');
  const json = await response.json();
  console.log(json);
  parking_data = json.data;
  console.log(parking_data)

  display_data()
}

function display_data() {
  let table = document.getElementById("availability-table")

  // remove old data
  let rows = table.rows;
  while (rows.length !== 1) {
    table.deleteRow(1);
  }

  // Get search parameters
  let location = document.getElementById("location-selector").value;
  let required_days = [document.getElementById("monday").checked,
                       document.getElementById("tuesday").checked,
                       document.getElementById("wednesday").checked,
                       document.getElementById("thursday").checked,
                       document.getElementById("friday").checked,
                       document.getElementById("saturday").checked,
                       document.getElementById("sunday").checked,]
  required_days = required_days.reduce((out, bool, i) => bool ? out.concat(i) : out, [])

  for (let k = 0; k < parking_data.length; k++) {
    let slot_data = parking_data[k];
    let slot_num = slot_data.slot_num;
    let slot_location = slot_data.location;
    let availability = slot_data.availability;

    // Check slot meets search parameters
    if (location !== "any" && location !== slot_location) {
      continue;
    }
    let has_days = true;
    for (let i = 0; i < required_days.length; i++) {
      let index = required_days[i];
      if (availability[index] !== "None") {
        has_days = false;
      }
    }
    if (!has_days) {
      continue;
    }

    let row = table.insertRow(-1);
    row.insertCell(0).innerHTML = "Slot " + slot_num;

    for (let i = 0; i < 7; i++) {
      let cell = row.insertCell(-1);
      cell.className = availability[i] !== "None" ? "unavailable-slot" : "available-slot";
      cell.id = slot_num + "_" + i;
      if (availability[i] === "None") {
        cell.onclick = function(){
          cell_clicked(cell, slot_num, slot_location, i)
        };
      }
    }
  }
}

function cell_clicked(cell, slot_num, slot_location, i) {
  
  // Determine if cell already selected
  let selected_slots = document.getElementById('selected-slot').textContent;
  let selected_days = document.getElementById('selected-days').textContent;

  let already_selected = selected_slots.includes(slot_num) && selected_days.includes(days[i]);
  if (already_selected) {
    // Remove cell from booking
    cell.style = 'background: green';
    let days_index = selected_days.indexOf(days[i]);
    let new_days = selected_days.substring(0, days_index) +
           selected_days.substring(days_index + days[i].length);
    if (new_days === "Selected Days: " ) {
      // Reset booking
      document.getElementById('selected-slot').textContent = "Selected Slot: None";
      document.getElementById('selected-days').textContent = "Selected Days: None";
      document.getElementById('slot-location').textContent = "Slot Location: N/A";
    } else {
      if (new_days.substring(days_index-2, days_index) === ', ') {
        new_days = new_days.substring(0, days_index-2) + new_days.substring(days_index);
      } else {
        new_days = new_days.substring(0, days_index) + new_days.substring(days_index+2);
      }
      document.getElementById('selected-days').textContent = new_days;
    }
    return;
  } else {
    cell.style = 'background: #50c3fc';
    // If another slot is already selected, reset booking
    if (selected_slots !== ("Selected Slot: #" + slot_num) && !selected_slots.includes('None')) {
      // Unselect other cells
      let other_slot_num = selected_slots.substring(16);
      let other_slot_days = selected_days.substring(15).split(',');
      let other_cells = other_slot_days.map(function (e) { return other_slot_num + '_' + days.indexOf(e.trim()); })
      for (let k = 0; k < other_cells.length; k++) {
        document.getElementById(other_cells[k]).style = 'background: green';
      }

      // Reset booking
      selected_days = "Selected Days: None";
    }
  }

  // Add slot to booking
  document.getElementById('selected-slot').textContent = "Selected Slot: #" + slot_num;

  // Add day to booking
  if (selected_days.includes('None')) {
    selected_days = "Selected Days: " + days[i];
  } else if (!selected_days.includes(days[i])){
    selected_days = selected_days + ", " + days[i];
  }
  document.getElementById('selected-days').textContent = selected_days

  // Add location to booking
  let new_location = slot_location === "underground" ? "Underground" : "Above Ground";
  document.getElementById('slot-location').textContent = "Slot Location: " + new_location;
}

function confirm_booking() {
  console.log('booking confirmed');
  cancel_booking();
}

function cancel_booking() {
  // Unselect other cells
  let selected_slot = document.getElementById('selected-slot').textContent;
  if (!selected_slot.includes('None')) {
    let other_slot_num = selected_slot.substring(16);
    let other_slot_days = document.getElementById('selected-days').textContent.substring(15).split(',');
    let other_cells = other_slot_days.map(function (e) { return other_slot_num + '_' + days.indexOf(e.trim()); })
    for (let k = 0; k < other_cells.length; k++) {
      document.getElementById(other_cells[k]).style = 'background: green';
    }
  }

  // Reset booking
  document.getElementById('selected-slot').textContent = "Selected Slot: None";
  document.getElementById('selected-days').textContent = "Selected Days: None";
  document.getElementById('slot-location').textContent = "Slot Location: N/A";
}

function change_time(days_change) {
  let curr_date = document.getElementById('date').textContent;
  let lower_date = curr_date.substring(0, curr_date.indexOf(' - '));
  lower_date = new Date(lower_date);
  let upper_date = curr_date.substring(curr_date.indexOf(' - ') + 3);
  upper_date = new Date(upper_date);

  lower_date.setDate(lower_date.getDate() + days_change);
  upper_date.setDate(upper_date.getDate() + days_change);

  lower_date = months[lower_date.getMonth() + 1] + ' ' + lower_date.getDate();
  upper_date = months[upper_date.getMonth() + 1] + ' ' + upper_date.getDate();
  document.getElementById('date').textContent = lower_date + ' - ' + upper_date;
}