from django import forms

from ..models import MainUser


class UserForm(forms.ModelForm):
    password2 = forms.CharField(label="Подтвердите пароль")

    class Meta:
        model = MainUser
        fields = ['login', 'FIO', 'password', 'password2']

    def clean_password2(self):
        password2 = self.cleaned_data['password2']
        password = self.cleaned_data['password']
        if password2 != password:
            raise forms.ValidationError('Данное поле не совпадает с полем пароля')
        return password2

