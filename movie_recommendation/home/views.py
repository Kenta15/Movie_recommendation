from django.shortcuts import render
from django.http import JsonResponse
import json

import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer

# Create your views here.

def home(request):
    return render(request,'home.html')

def cosineSimilarity(request):

    data = json.loads(request.body)
    title = data['title'].lower()

    df=pd.read_csv("/Users/kentatanaka/Downloads/Classes/ECS171/Project/Movie_recommendation/movie_recommendation/home/JupyterNotebook/dataset/preprocessed_dataset.csv")

    for i, genre in enumerate(df['genres']): # genres has a few attributes so we have to splite each genre
        df['genres'][i] = str(genre).split()

    for i in range(len(df['movie_title'])):
        if df['movie_title'][i] == title:
            index_of_title = i

    cv = CountVectorizer()
    vectors = cv.fit_transform(df['comb'].astype('U'))
    target = vectors[index_of_title]

    # Cosine Similarity

    result = cosine_similarity(vectors,target)

    similarities = [0] * len(result)
    for i in range(len(result)):
        similarities[i] = result[i][0]
    
    max = 0
    indexes_of_top_10 = [0] * 11
    for i in range(11):
        for j in range(len(similarities)):
            if similarities[max] < similarities[j]:
                max = j
        indexes_of_top_10[i] = max
        similarities[max] = 0.0

    # retrieving movie title for top_10
    top_10_movie_titles = ['NA'] * 10

    for i in range(10):
        top_10_movie_titles[i] = df['movie_title'][indexes_of_top_10[i+1]] # first index is the same movie

    return JsonResponse({'data': top_10_movie_titles},safe=False)


def Some(request):
    top_10 = cosine_similarity()
    context={'top_10':top_10}
    print(top_10)
    return render(request,'',context)