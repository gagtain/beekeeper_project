
def default_delivery_only(x=None):
    return (f'{x}__id', f'{x}__uuid', f'{x}__track_number', f'{x}__status', f'{x}__delivery_method', f'{x}__where') if x \
        else ('id', 'uuid', 'track_number', 'status', 'delivery_method', 'where')