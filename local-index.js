let parking_data;

main();

async function main() {
    await load_data();
    display_data();
}

async function load_data() {
    const response = await fetch('/api/GetData');
    parking_data = await response.json();

    display_data()
}

function display_data() {
     document.getElementById('parking-data').textContent = parking_data;
}