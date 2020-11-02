module.exports = async function (context, req) {
    context.log('Sending data from server');

    // Read parking-data
    //const parking_data = fetch('parking-data.json');
    const parking_data = [
        { name: 'Azure' },
        { name: 'Sammy' },
        { name: 'Roscoe' },
    ];

    context.res = {
        // status: 200,
        body: {dogs: parking_data},
        header: { 'Content-Type': 'application/json' }
    };
}