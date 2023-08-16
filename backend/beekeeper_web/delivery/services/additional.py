from global_modules.exception.base import BaseDataException


def field_in_dict(dict_req: dict, field: str):
    if dict_req.get(field):
        return dict_req[field]
    else:
        raise BaseDataException(f'Не указано поле {field}')