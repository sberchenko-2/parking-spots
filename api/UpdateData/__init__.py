import azure.functions as func
from azure.cosmos import CosmosClient, PartitionKey


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


def main(mytimer: func.TimerRequest) -> None:
    container = get_cosmos_connectivities()

    # Query slots using SQL
    query = "SELECT * FROM c"

    items = list(container.query_items(
        query=query,
        enable_cross_partition_query=True
    ))

    for item in items:
        print('TODO')
