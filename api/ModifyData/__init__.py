import logging

import azure.functions as func


def get_params(req):
    # Get data-modifying parameters
    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')

    slot_num = req.params.get('slot_num')
    if not slot_num:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            slot_num = req_body.get('slot_num')

    dates = req.params.get('dates')
    if not dates:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            dates = req_body.get('dates')
    
    return name, slot_num, dates


def modify_data(name, slot_num, dates):
    # Modifies the data
    print('Not implemented')


def main(req: func.HttpRequest) -> func.HttpResponse:

    name, slot_num, dates = get_params(req)

    if name and slot_num and dates:
        modify_data(name, slot_num, dates)
        return func.HttpResponse("This HTTP triggered function executed successfully.")
    else:
        return func.HttpResponse(
             "Invalid / missing parameter passed (name, slot_num, dates)",
             status_code=500
        )
