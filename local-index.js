let parking_data;
let curr_week = 0;  // Current week in month

const days = ['M', 'Tu', 'W', 'Th', 'F'];
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
  const response = await fetch('https://parking-spots-functions.azurewebsites.net/api/getdata?code=1dAtdPKMgT0kJQsDRGfYBO03HnQbzusgcLKvyDS2sdwvcpLRGqVltA==');
  parking_data = await response.json();
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
                       document.getElementById("friday").checked];
  required_days = required_days.reduce((out, bool, i) => bool ? out.concat(i) : out, [])

  for (let k = 0; k < parking_data.length; k++) {
    let slot_data = parking_data[k];
    let slot_num = slot_data.slot_num;
    let slot_location = slot_data.location;
    let availability = slot_data.availability[curr_week];
    let recurring = slot_data.recurring[curr_week];

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

    for (let i = 0; i < 5; i++) {
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

async function confirm_booking() {
  let name = document.getElementById('name-input').value;
  let repeat = document.getElementById('repeat_limit').value;
  let slot = document.getElementById('selected-slot').textContent.substring(16);

  if (!document.getElementById('repeat').checked) {
    repeat = 0;
  }

  if (slot === 'None') {
    console.log('no slot selected');
  } else if (name === '') {
    console.log('no name selected')
  }

  let days = document.getElementById('selected-days').textContent.substring(15);

  // Processes days into array of 0s and 1s
  let selections = [0, 0, 0, 0, 0];
  if (days.search('M') !== -1) {
    selections[0] = 1;
  }
  if (days.search('Tu') !== -1) {
    selections[1] = 1;
  }
  if (days.search('W') !== -1) {
    selections[2] = 1;
  }
  if (days.search('Th') !== -1) {
    selections[3] = 1;
  }
  if (days.search('F') !== -1) {
    selections[4] = 1;
  }

  let fetch_str = 'https://parking-spots-functions.azurewebsites.net/api/modifydata?code=MoFDbgXluYzoOWLiIUw7XyKZt0Fab4DsO6fj81NQb1Eq8zjG2z76ZA==' +
    '&name=' + name + '&slot_num=' + slot + '&days=[' + selections +
    ']&repeat=' + repeat + "&curr_week=" + curr_week;

  let response = await fetch(fetch_str);
  cancel_booking();
  await load_data();
  display_data();
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
  if (curr_week === 3) {
    document.getElementById('forward_button').disabled = false;
  } else if (curr_week === 0) {
    document.getElementById('back_button').disabled = false;
  }

  curr_week += days_change / 7

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

  if (curr_week === 3) {
    document.getElementById('forward_button').disabled = true;
  } else if (curr_week === 0) {
    document.getElementById('back_button').disabled = true;
  }
}