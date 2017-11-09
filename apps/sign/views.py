from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.

def sign_in(request):
    # views about sign in
    pass

def sign_up(request):
    # views about sign up
    pass

def index(request):
    return render(request, 'base.html')