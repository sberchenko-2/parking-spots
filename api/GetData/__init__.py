import azure.functions as func
from azure.cosmos import exceptions, CosmosClient, PartitionKey


def main(req: func.HttpRequest) -> func.HttpResponse:

    # Initialize the Cosmos client
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

    # Query slots using SQL
    query = "SELECT * FROM c"

    items = list(container.query_items(
        query=query,
        enable_cross_partition_query=True
    ))

    return func.HttpResponse(items[0])