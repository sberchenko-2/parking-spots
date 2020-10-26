module.exports = async function (context, req) {
    context.log('Sending data from server');

    // Read parking-data
    const response = await fetch('parking-data.json');
    const data = await response.json();

    console.log(data)

    const parking_data = [
        { name: 'Azure' },
        { name: 'Sammy' },
        { name: 'Roscoe' },
    ];

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {data: parking_data},
        header: { 'Content-Type': 'application/json' }
    };
}