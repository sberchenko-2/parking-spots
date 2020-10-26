let parking_data;

main();

async function main() {
    await load_data();
    display_data();
}

async function load_data() {
    const response = await fetch('/api2/GetData');
    const json = await response.json();
    console.log(json);
    parking_data = json.data;
    console.log(parking_data)

    display_data()
}

function display_data() {
     document.getElementById('parking-data').textContent = parking_data;
}