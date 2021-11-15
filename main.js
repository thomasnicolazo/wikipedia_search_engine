const form = document.querySelector('form'); // form object (search query location)
const buttonNext = document.querySelector('#next');
const buttonPrevious = document.querySelector('#previous');
var tableResult = {}; // search ressult object
tableResult.pageCount = 1; // begin at page 1

function displayResult(i,results){
  let nbResults = results.continue.sroffset;
  let nbResultPage = 10; // number of serch results display on a page
  if (i<1){
    alert("can not go to the previous page");
    i=1;
  }
//  createButtonNav(nbResults,nbResultPage);
  results = results.query.search;
  let resToDisplay = results.slice((i-1)*nbResultPage,i*nbResultPage);
  const resultsPlace = document.querySelector('.js-search-results');
  resultsPlace.innerHTML = '';
  // Iterate over the `search` array. Each nested object in the array can be
  // accessed through the `result` parameter
  resToDisplay.forEach( result => {
    const url = `https://en.wikipedia.org/?curid=${result.pageid}`;
    // Append the search result to the DOM
    resultsPlace.insertAdjacentHTML(
      'beforeend',
      `<div class="result-item">
        <h3 class="result-title">
          <a href="${url}" target="_blank" rel="noopener">${result.title}</a>
        </h3>
        <a href="${url}" class="result-link" target="_blank" rel="noopener">${url}</a>
        <span class="result-snippet">${result.snippet}</span><br>
      </div>`
    );
  });

}

// fetch query from wikipedia and parse the reponce to json object
async function searchWiki(SearchQuery){
  // url contains qurey parameters to search on wikipedia
  const wikiSearchApi = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=200&srsearch=${SearchQuery}`;
  const reponce = await fetch(wikiSearchApi);
  if (!reponce.ok){
    throw Error('Failed to fetch wiki api' + reponce.statusText);
  }
  const json = await reponce.json();
  return json;
}

//handle query on submit
async function handleSubmit(event){
   // prevent page from reloading when form is submitted
  event.preventDefault();
  const inputValue = document.querySelector('#query_input').value;
  const searchQuery = inputValue.trim();
  // clear previous results
  const resultsPlace = document.querySelector('.js-search-results');
  resultsPlace.innerHTML = '';

  try{
    const result = await searchWiki(searchQuery);
    // alert if no result
    if(result.query.searchinfo.totalhits==0){
      alert("there is no results");
    }
    console.log(result);
    tableResult.list = result;
    displayResult(tableResult.pageCount,result);
  }
  catch(err){
  //  throw Error('Failed to get result');
    alert("Failed to search on Wikipedia \n" + err);
  }
}

form.addEventListener('submit',handleSubmit);
buttonNext.addEventListener('click', () =>{tableResult.pageCount+=1; displayResult(tableResult.pageCount,tableResult.list);});
buttonPrevious.addEventListener('click',() => {tableResult.pageCount-=1; displayResult(tableResult.pageCount,tableResult.list);});
