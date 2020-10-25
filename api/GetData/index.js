module.exports = async function (context, req) {
    context.log('Sending data from server');



    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage,
        header: { 'Content-Type': 'application/json' }
    };
}