module.exports = async function (context, req) {
    context.log('Sending data from server');

    // Read parking-data
    const response = await fetch('https://purple-sand-05ece0d10.azurestaticapps.net/parking-data.json');
    const parking_data = await response.json();

    context.res = {
        // status: 200,
        body: {data: parking_data},
        header: { 'Content-Type': 'application/json' }
    };
}