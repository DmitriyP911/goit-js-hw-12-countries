import './styles.css';
import debounce from 'lodash.debounce';
import axios from 'axios';
import PNotify from '../node_modules/pnotify/dist/es/PNotify';
import template from './templates/countryTable.hbs';

const input = document.querySelector( `.search` );
const ul = document.querySelector( `.countries` );

input.addEventListener( `input`, debounce( getCounties, 500 ) );

function getCounties ( event ) {
    let inputValue = event.target.value;
    let baseUrl = `https://restcountries.eu/rest/v2/name/${inputValue}`;
    axios.get( baseUrl )
        .then( function ( response ) {
            return response.data;
        } )
        .then( data => {
            ul.innerHTML = ``;
            if( data.length === 1 ) {
                const markup = data.reduce( ( acc, el ) => `${acc}` + `${template( el )}`, `` );
                ul.insertAdjacentHTML( `beforeend`, markup );
            } else if( data.length > 1 && data.length <= 10 ) {
                const markup = data.reduce( ( acc, el ) => `${acc}` + `<li class="countries-list">${el.name}</li>`, `` );
                ul.insertAdjacentHTML( `beforeend`, markup );
            } else if( data.length > 10 ) {
                PNotify.error( {
                    text: "Too many matches found. Please enter a more specific query!",
                    delay: 8000,
                    addClass: `warning`,
                    width: '250px',
                    remove: true,
                    stack: {
                        context: ul
                    },
                } );
            }
        } )
        .catch( err => {
            ul.innerHTML = ``;
            console.dir( `Error: ${err.response.data.status}. Data ${err.response.data.message}` );
        } )
};