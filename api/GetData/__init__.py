import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:

    with open('parking-data.json', 'r') as f:
        data = ''
        for line in f.readlines():
            data += line
        return func.HttpResponse(data)
