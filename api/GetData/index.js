module.exports = async function (context, req) {
    context.log('Sending data from server');

    // Read parking-data
    const reader = new FileReader();
    let data;

    reader.onload = function() {
        data = JSON.parse(reader.result);
    }

    reader.readAsText('parking-data.json')
    console.log(data)

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: data,
        header: { 'Content-Type': 'application/json' }
    };
}