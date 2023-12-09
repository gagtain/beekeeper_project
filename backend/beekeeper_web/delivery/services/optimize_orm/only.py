
def default_delivery_only(x=None):
    return (f'{x}__id', f'{x}__uuid', f'{x}__track_number', f'{x}__status', f'{x}__delivery_method', f'{x}__where',
            f'{x}__price', f'{x}__delivery_type') if x \
        else ('id', 'uuid', 'track_number', 'status', 'delivery_method', 'where', 'price', 'delivery_type')