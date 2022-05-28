from django.shortcuts import render
from django.http import JsonResponse
import json
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer
from django.http import HttpResponse

# Create your views here.

def home(request):
    context = {}
    return render(request,'home.html',context)

def cosineSimilarity(request):

    data = json.loads(request.body)
    title = data['title'].lower()
    genres = data['genres']

    df=pd.read_csv("/Users/kentatanaka/Downloads/Classes/ECS171/Project/Movie_recommendation/movie_recommendation/home/JupyterNotebook/dataset/preprocessed_dataset.csv")
    # df=pd.read_csv('preprocessed_dataset.csv')
    
    for i, genre in enumerate(df['genres']): # genres has a few attributes so we have to splite each genre
        df['genres'][i] = str(genre).split()

    for i in range(len(df['movie_title'])):
        if df['movie_title'][i] == title:
            for genre in genres:
                if genre in df['genres'][i]:
                    index_of_title = i

    # Cosine Similarity

    cv = CountVectorizer()
    vectors = cv.fit_transform(df['comb'].astype('U'))
    target = vectors[index_of_title]

    num_of_recommendations = 15

    result = cosine_similarity(vectors,target)

    similarities = [0] * len(result)
    for i in range(len(result)):
        similarities[i] = result[i][0]
    
    max = 0
    indexes_of_top_movies = [0] * (num_of_recommendations + 1)
    for i in range(num_of_recommendations + 1):
        for j in range(len(similarities)):
            if similarities[max] < similarities[j]:
                max = j
        indexes_of_top_movies[i] = max
        similarities[max] = 0.0

    # retrieving movie title which has high similarities
    recommendation_movie_titles = ['NA'] * num_of_recommendations
    recommendation_movie_genres = [['NA']] * num_of_recommendations

    for i in range(num_of_recommendations):
        if df['movie_title'][indexes_of_top_movies[i+1]] != title and df['movie_title'][indexes_of_top_movies[i+1]] not in recommendation_movie_titles:
            recommendation_movie_titles[i] = df['movie_title'][indexes_of_top_movies[i+1]] # first index is the same movie
            recommendation_movie_genres[i] = df['genres'][indexes_of_top_movies[i+1]]

    return JsonResponse({'recommendations':recommendation_movie_titles,'recommendations_genres':recommendation_movie_genres})