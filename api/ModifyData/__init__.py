import json
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

    days = req.params.get('days')
    if not days:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            dates = req_body.get('days')

    repeat = req.params.get('repeat')
    if not repeat:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            dates = req_body.get('repeat')

    curr_week = req.params.get('curr_week')
    if not curr_week:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            dates = req_body.get('curr_week')
    
    return name, slot_num, days, repeat, curr_week


def modify_data(name, slot_num, days, repeat, curr_week):
    # Read in parking data
    data = ''
    with open('parking-data.json', 'r') as f:
        for line in f.readlines():
            data += line

    data = json.loads(data)



def main(req: func.HttpRequest) -> func.HttpResponse:

    name, slot_num, days, repeat, curr_week = get_params(req)

    if name and slot_num and days and repeat:
        modify_data(name, slot_num, days)
        return func.HttpResponse("This HTTP triggered function executed successfully." +
                                 "name=" + name + "; slot_num=" + slot_num + "; days=" + days +
                                 "; repeat=" + repeat)
    else:
        return func.HttpResponse(
             "Invalid / missing parameter passed (name, slot_num, dates)",
             status_code=500
        )
