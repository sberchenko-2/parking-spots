module.exports = async function (context, req) {
    console.log('in internal index');

    context.log('Sending data from server');

    // Read parking-data
    const response = await fetch('parking-data.json');
    console.log('obtained response data')
    console.log(response)
    const parking_data = await response.json();
    console.log('converted data to json')
    console.log(parking_data)

    context.res = {
        status: 200,
        body: {data: parking_data},
        header: { 'Content-Type': 'application/json' }
    };
}