//** Given a query string, return array of matching shows: { id, name, summary, episodesUrl }


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove hard coded data.
  let url = `http://api.tvmaze.com/search/shows?q=${query}`;
  let res = await axios.get(url);
  // console.log(res.data);
  
  const shows = res.data.map(info => {
    let show = info.show;    
    return {
        id: show.id,
        name: show.name,
        summary: show.summary,        
        image: show.image ? show.image.original : "http://tinyurl.com/missing-tv",
        language: show.language,
        genres: show.genres,
        rating: show.rating
      };    
  });
  // console.log(shows);
  return shows;  
};

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();
  

  for (let show of shows) {    
    let $item = $(
      `<div class="col-md-6 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text"> Language: ${show.language}</p>
             <p class="card-text"> Genres: ${show.genres}</p>
             <p class="card-text"> Rating: ${show.rating.average}</p>
             <p class="card-text">${show.summary}</p>             
             <button class="btn btn-primary get-episodes" data-toggle="modal" data-target="#staticBackdrop">Episodes</button>
           </div>           
         </div>
       </div>
      `);      
    $showsList.append($item);
  };
};


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  const response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
  console.log(response);
  const episodes = response.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number
  }));
  // console.log(episodes);
  return episodes;
  // console.log(episodes);
};

function populateEpisodes(episodes) {
  const $episodeList = $('#episodes-list');
  $episodeList.empty();

  for (let episode of episodes) {
    let $item = $(`<li>${episode.name} (season ${episode.season}, number ${episode.number})</li>`);
    $episodeList.append($item);
  };
  $('#episodes-area').show(); 
};

$('#shows-list').on('click',".get-episodes", async function handleEpisodeClick(event){       
  let showId = $(event.target).closest(".Show").data("show-id");
  let episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
});