import json


class FixedRussianData:
    @classmethod
    async def encode_json(cls, content):
        return json.dumps(content, ensure_ascii=False)