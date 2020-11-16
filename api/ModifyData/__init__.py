import azure.functions as func
from azure.cosmos import CosmosClient, PartitionKey


def get_params(req):
    """
    Returns parameters in req input.
    This function simply returns the values of the raw parameters - no data verification is
        performed.
    :param req: HTTP trigger input
    :return: Values for 'name', 'slot_num', 'days', 'repeat', 'curr_week'
    """
    return req.params.get('name'), req.params.get('slot_num'), req.params.get('days'), \
           req.params.get('repeat'), req.params.get('curr_week')


def get_cosmos_connectivities():
    """
    Returns the Cosmos DB container associated with the parking data
    """
    endpoint = "https://parking-spots.documents.azure.com:443/"
    key = 'c9av0FP6xBrnz7XNUdBNIUFdCuo1IvE3H2SWvvB8Pxo92ALKzfW2gDXxgQlBlyUJtLDiJSZK6Ew8YO8yPNepnA=='
    client = CosmosClient(endpoint, key)

    # Select database
    database_name = 'Parking-Data'
    database = client.create_database_if_not_exists(id=database_name)

    # Select container
    container_name = 'Items'
    container = database.create_container_if_not_exists(
        id=container_name,
        partition_key=PartitionKey(path="/slots"),
        offer_throughput=400
    )

    return container


def modify_data(name, slot_num, days, repeat, curr_week):
    """
    Modifies data in Cosmos Database.
    :param name: The name of the person being added into the database
    :param slot_num: The slot number
    :param days: Array of 0 and 1s corresponding to the days the user selected
    :param repeat: Integer representing how long the selection should be repeated for
    :param curr_week: Index of current week to insert in
    """
    container = get_cosmos_connectivities()

    # Query slots using SQL
    query = f"SELECT * FROM c WHERE c.id='{slot_num}'"

    items = list(container.query_items(
        query=query,
        enable_cross_partition_query=True
    ))
    item = items[0]

    # Calculate maximum week of booking and relevant repeat
    max_week = curr_week + repeat - 1
    if repeat == -1:
        max_week = 3
    elif max_week > 3:
        max_week = 3
        repeat -= 3 - curr_week
    else:
        repeat = 0

    # Change availability and recurring where days indicates
    for i, e in enumerate(days):
        if e == '1':
            for week in range(curr_week, max_week+1):
                item['availability'][week][i] = name
                item['recurring'][week][i] = repeat if week == max_week else 0

    container.replace_item(item=item, body=item)


def process_inputs(name, slot_num, days, repeat, curr_week):
    """
    Processes the inputs and returns the new values.
    """
    # Process days
    days = days[1:-1].split(',')

    # Process repeat & curr_week
    repeat = int(repeat)
    curr_week = int(curr_week)

    return name, slot_num, days, repeat, curr_week


def main(req: func.HttpRequest) -> str:

    name, slot_num, days, repeat, curr_week = get_params(req)

    if not (name and slot_num and days and repeat and curr_week):
        response = f'Missing parameters: \nname = {name}\nslot_num = {slot_num}\ndays = {days}\n' + \
                   f'repeat = {repeat}\ncurr_week = {curr_week}'
        return func.HttpResponse(response, status_code=500)

    name, slot_num, days, repeat, curr_week = process_inputs(name, slot_num, days, repeat, curr_week)
    modify_data(name, slot_num, days, repeat, curr_week)
    return func.HttpResponse("This HTTP triggered function executed successfully.")
