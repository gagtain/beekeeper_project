
from yookassa import Configuration
import os

# yookassa

Configuration.account_id = os.getenv('YOOKASSA_ID')
Configuration.secret_key = os.getenv('YOOKASSA_KEY')