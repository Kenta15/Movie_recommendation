from django.urls import path
from . import views

urlpatterns = [
    path('',views.home,name="home"),
    path('cosineSimilarity/',views.cosineSimilarity,name="cosineSimilarity"),
]