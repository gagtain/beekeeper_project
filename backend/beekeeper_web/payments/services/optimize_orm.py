

def default_payment_only(x=None):
    return (f'{x}__id_payment', f'{x}__status', f'{x}__url', f'{x}__id') if x\
        else ('id_payment', 'status', 'url', 'id')