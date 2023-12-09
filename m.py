import json

with open('j.json') as f:
    text = f.read()



print(json.loads(text)['pvz']['CITYFULL']['1861688'])

# for key, value in json.loads(text)['pvz']['CITY'].items():
#     if key == '3037':
#         print(value)