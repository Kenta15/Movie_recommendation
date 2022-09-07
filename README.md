# Movie Recommendation System
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
  
This project let user input any movie titles and click one of the results.

After clicking, it shows the movie details as well as recommendations based on the movie.

## Setup

Download [Python](https://www.python.org/downloads/) and [Anaconda](https://www.anaconda.com/products/distribution).
Run these commands:

```diff
# Install Django
python -m pip install Django

# Move to the file directory
cd movie_recommendation

# Run the local server
python manage.py runserver
```

## Code Example

As soon as a user input is entered, the fetch API is called to send the input to backend

```
fetch(url,{
              method:'POST',
              headers:{
                  'Content-Type':'application/json',
                  'X-CSRFToken':csrftoken,
              },
              body:JSON.stringify({'title':title,'genres':genre_set})
            })
            .then((res) => {
              // return Promise
              return res.json()
            })
 ```
 
Then, backend executes cosine similarity to make recommendations and returns top movies with highest similarities.
 
 ```
    cv = CountVectorizer()
    vectors = cv.fit_transform(df['comb'].astype('U'))
    target = vectors[index_of_title]

    result = cosine_similarity(vectors,target)
 ```

## API References
Created account in https://www.themoviedb.org/, then got own API key.

### Sources of the datasets
* [Movies Dataset](https://www.kaggle.com/datasets/carolzhangdc/imdb-5000-movie-dataset)

* [Movies in 2018](https://en.wikipedia.org/wiki/List_of_American_films_of_2018), [Movies in 2019](https://en.wikipedia.org/wiki/List_of_American_films_of_2019)

* [Movies in 2020](https://en.wikipedia.org/wiki/List_of_American_films_of_2020), [Movies in 2021](https://en.wikipedia.org/wiki/List_of_American_films_of_2021), [Movies in 2022](https://en.wikipedia.org/wiki/List_of_American_films_of_2022)

## Application Link
Use this link to visit our website: [Movie Recommender](https://movie-recommendation171.herokuapp.com/)

## References
This github repository helped us to create this web application.

https://github.com/kishan0725/The-Movie-Cinema

## Project Report
Here is our project report: [Project Report](https://drive.google.com/file/d/1vlsnavIr8DlYQ5d2I_8qd3KR8mOXfJZX/view?usp=sharing)
