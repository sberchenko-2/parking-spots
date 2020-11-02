module.exports = async function (context, req) {
    context.log('Sending data from server');

    // Read parking-data
    //const response = await fetch('parking-data.json');
    //const parking_data = await response.json();

    const parking_data = [
        { url: document.URL}
    ]

    context.res = {
        // status: 200,
        body: {data: parking_data},
        header: { 'Content-Type': 'application/json' }
    };
}