module.exports = async function (context, req) {
    context.log('Sending data from server');

    // Read parking-data
    const parking_data = fetch('parking-data.json');

    context.res = {
        status: 200,
        body: {data: parking_data},
        header: { 'Content-Type': 'application/json' }
    };
}