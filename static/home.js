const API_KEY = 'api_key=87f1f400a3e1445d86fdd4366532e611';

const IMG_URL= 'https://image.tmdb.org/t/p/original';

const BASE_URL = 'https://api.themoviedb.org/3';

const API_URL = BASE_URL + '/discover/movie?' + API_KEY;

const genres = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ]

function getToken(name){
  var cookieValue = null
  if(document.cookie && document.cookie !==''){
    var cookies = document.cookie.split(';')
    for(var i=0;i<cookies.length;i++){
      var cookie = cookies[i].trim();
      if(cookie.substring(0,name.length+1)===(name+'=')){
        cookieValue = decodeURIComponent(cookie.substring(name.length+1))
        break
      }
    }
  }
  return cookieValue;
}
var csrftoken = getToken('csrftoken')

function getMovies(inputVal){
    var url = BASE_URL + '/search/movie?' + API_KEY + '&query=' + inputVal
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results)
        showMovies(data.results)
    })
  main.innerHTML = url
}


function showMovies(data) {
    main.innerHTML = ''
    recom.innerHTML = ''
    data.forEach((movie,i) => {
        var {title, poster_path, vote_average, overview, id, genre_ids,release_date} = movie

        if(data[i].poster_path != null){
          var movieEl = document.createElement('div')
          movieEl.classList.add('movie')
          movieEl.innerHTML = `
          <div class="image-container">
              <a href="#" class="recommend"><img class="images" src="${poster_path? IMG_URL+poster_path:"http://via.placeholder.com/1080x1580" }" alt="${title}"></a>
          </div>
              `
          main.appendChild(movieEl)
        }
        })

        var recommends = document.querySelectorAll('.recommend')
        recommends.forEach((link,i) => {
            link.addEventListener('click', event =>{

                // get_movie_cast(data[i].id,API_KEY)
                var genre_set = []
                data[i].genre_ids.forEach(function(genre_id){
                    genres.forEach(function(genre){
                        if(genre_id==genre.id){
                            genre_set.push(genre.name)
                        }
                    })
                })

                poster_path = data[i].poster_path
                title = data[i].title
                vote_average = data[i].vote_average
                overview = data[i].overview
                genre_ids = data[i].genre_ids
                release_date = data[i].release_date

                console.log(title)
                console.log(genre_set)

                var url = 'cosineSimilarity/'

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
                .then((data) => {
                    // log JSON data
                  console.log(data)
                  search_movie(data)
                })
                .catch(() => {
                  error_page()
                });

                document.getElementById("main").innerHTML = `
                <h2 style="color:white;margin:40px 0 0 40px;">You clicked:</h2>
                <div style="margin:40px 0 0 250px;display:inline-block;">
                    <img class="images" style="width:180px;height:280px;" src="${poster_path? IMG_URL+poster_path:"http://via.placeholder.com/1080x1580" }" alt="${title}">
                </div>
                <div style="display:inline-block;margin-left:60px;color:white;">
                    <div>
                        <h4>Title: ${title}</h4>
                    </div>
                    <div>
                        <h4>Rating: ${vote_average}</h4>
                    </div>
                    <div>
                        <h4>Genre: ${genre_set}</h4>
                    </div>
                    <div>
                        <h4>Release Date: ${release_date}</h4>
                    </div>
                </div>
                <div class="overview" style="color:white;width:70%;margin:40px 0 0 40px;">
                    <h4>Overview:</h4>
                    <p style="margin-left:30px;">${overview}<p>
                </div>
                <h2 style="color:white;margin:40px 0 0 40px;">Recommended movies:</h2>
                    `
            })
        })
}

function error_page(){
  console.log("not available")
  var recommendations = document.createElement('div')
  recommendations.classList.add('error')
  recommendations.innerHTML = `
      <div>
        <h2 style="color:white;margin-left:100px;margin-top:20px;">Sorry, the movie is not in our dataset 🙇‍♂️</h2>
      </div>
    `
    recom.appendChild(recommendations)
}

// searching movies for each top 15 highest cosineSimilarity
function search_movie(top_15_movies){
  top_15 = top_15_movies['recommendations']
  top_15_genres = top_15_movies['recommendations_genres']
  top_15.forEach((movie,i)=>{
    var url = BASE_URL + '/search/movie?' + API_KEY + '&query=' + movie
    fetch(url).then(res => res.json()).then(data => {
      recom_movie(data.results,movie,top_15_genres[i])
    })
  })
}

// list all recommended movies in html
function recom_movie(data,movie,genre){
  data.forEach((each_data)=>{

    if(each_data.title.toLowerCase() == movie){
      // getting genres by genre_ids
      var genre_set = []
      each_data.genre_ids.forEach(function(genre_id){
          genres.forEach(function(genre){
              if(genre_id==genre.id){
                  genre_set.push(genre.name)
              }
          })
      })

      break_count = 0
      genre.forEach((gen)=>{
        if(genre_set.includes(gen)){
          poster_path = each_data.poster_path
          title = each_data.title
          var recommendations = document.createElement('div')
          recommendations.classList.add('movie')
          if(poster_path != null && break_count != 1){
            recommendations.innerHTML = `
                  <div class="image-container" style="margin:40px 0 0 40px;">
                    <img class="images" src="${poster_path? IMG_URL+poster_path:"http://via.placeholder.com/1080x1580" }" alt="${title}">
                  </div>
                `
          }
          recom.appendChild(recommendations)
          break_count = 1
        }
      })
    }
  })
}

function showGenres(movie, i, id, title) {  
    movie.genres.forEach((genre) => {
        const {id, name} = genre;
    })
}

function getInput(){
    var inputVal = document.getElementById("searchbox").value;
    getMovies(inputVal);
}

// function get_movie_cast(movie_id,my_api_key){
//   cast_ids= [];
//   cast_names = [];

//   top_10 = [0,1,2,3,4,5,6,7,8,9];
//   $.ajax({
//     type:'GET',
//     url:"https://api.themoviedb.org/3/movie/"+movie_id+"/credits?"+my_api_key,
//     async:false,
//     success: function(my_movie){
//       if(my_movie.cast.length>=10){
//         top_cast = [0,1,2,3,4,5,6,7,8,9];
//       }
//       else {
//         top_cast = [0,1,2,3,4];
//       }
//       for(var my_cast in top_cast){
//         cast_ids.push(my_movie.cast[my_cast].id)
//         cast_names.push(my_movie.cast[my_cast].name);
//       }
//     },
//     error: function(){
//       alert("Invalid Request!");
//       $("#loader").delay(500).fadeOut();
//     }
//   });

//   return {cast_ids:cast_ids,cast_names:cast_names};
// }