import azure.functions as func
from azure.cosmos import CosmosClient, PartitionKey
import json


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

    item = container.read_item(item='d1be1338-c8d6-420a-a379-1e3bfecc1c68',
                               partition_key='d1be1338-c8d6-420a-a379-1e3bfecc1c68')

    return func.HttpResponse(json.dumps(item))
