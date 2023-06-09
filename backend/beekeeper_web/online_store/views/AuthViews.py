from django.contrib.auth import login
from django.urls import reverse
from django.views.generic import CreateView

from ..forms.User import UserForm
from ..models import MainUser


class RegistrationView(CreateView):
    template_name = 'registration/register.html'
    form_class = UserForm

    def get_context_data(self, *args, **kwargs):
        context = super(RegistrationView, self).get_context_data(*args, **kwargs)
        context['next'] = self.request.GET.get('next')
        return context

    def get_success_url(self):
        next_url = self.request.POST.get('next')
        user = MainUser.objects.get(login=self.request.POST.get('login'))
        login(self.request, user, backend='django.contrib.auth.backends.ModelBackend')
        success_url = reverse('home')
        if next_url:
            success_url += '?next={}'.format(next_url)

        return success_url
