from rest_framework_simplejwt.authentication import JWTAuthentication


"""
class CustomAuthentication(JWTAuthentication):
    def authenticate(self, request):
        header = self.get_header(request)
        print('asd')
        if header is None:
            raw_token = request.COOKIES.get('token') or None
        else:
            raw_token = self.get_raw_token(header)
        if raw_token is None:
            return None
        validated_token = self.get_validated_token(raw_token)
        print(validated_token)
        return self.get_user(validated_token), validated_token

"""

class CustomAuthentication(JWTAuthentication):
    def authenticate(self, request):
        header = self.get_header(request)
        if header is None:
            raw_token = request.data.get('token') or None
        else:
            raw_token = self.get_raw_token(header)
        if raw_token is None:
            return None
        validated_token = self.get_validated_token(raw_token)
        print(validated_token)
        return self.get_user(validated_token), validated_token