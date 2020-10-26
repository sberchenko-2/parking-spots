import logging
import azure.functions as func
import json

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Sending data from server')

    parking_data = [
        { 'name': 'Azure' },
        { 'name': 'Sammy' },
        { 'name': 'Roscoe' },
    ];

    return func.HttpResponse(
       parking_data,
       status_code=200
    )
