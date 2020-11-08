import logging
import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Returning data')

    with open('parking-data.json', 'r') as f:
        data = ''
        for line in f.readlines():
            data += line
        return func.HttpResponse(data)
