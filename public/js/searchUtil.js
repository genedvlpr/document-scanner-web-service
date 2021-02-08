// For the default version
const algoliasearch = require('algoliasearch');

// For the default version
import algoliasearch from 'algoliasearch';

// For the search only version
import algoliasearch from 'algoliasearch/lite';

const client = algoliasearch('c6b922ea386e6d0bb94c7c67b3ab1b05');
const index = client.initIndex('indicators_list');

function keywordSearch() {
   var keyword = document.getElementById('keyword').value;
   
   // only query string
   index.search(keyword).then(({ hits }) => {
      console.log(hits);
   });

   // with params
   index.search('query string', {
      attributesToRetrieve: ['firstname', 'lastname'],
      hitsPerPage: 50,
   }).then(({ hits }) => {
      console.log(hits);
   });
}
