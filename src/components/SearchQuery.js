import React, { Component } from 'react';
import axios from 'axios'


class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            results:{},
            loading: '',
            message: '',
            totalResults: 0,
            totalPages: 0,
            currentPageNo: 0

        };
        this.cancel = ''
    }

    getPageCount = (total,denominator) =>  {
        const divisible = 0 === total % denominator;
        const valueTobeAdded = divisible ? 0 : 1;
        return Math.floor( total/denominator ) + valueTobeAdded;
    };


    fetchSearchResults = (updatedPageNo, query) => {
        const pageNumber = updatedPageNo ? `&page=${updatedPageNo}` : '';
        const searchUrl = (`http://www.omdbapi.com/?&apikey=72983b7b&s=${query}${pageNumber}`);

        if( this.cancel ){
            this.cancel.cancel();
        }

        this.cancel = axios.CancelToken.source();

        axios.get(searchUrl, {
            cancelToken: this.cancel.token

        })
            .then( res => {
                const total = res.data.total;
                const totalPagesCount = this.getPageCount(total, 20);
                const resultNotFoundMsg = ! res.data.Search.length
                                ? 'There are no more search results'
                                : '';
                this.setState( {
                    results: res.data.Search,
                    message: resultNotFoundMsg,
                    totalResults: total,
                    totalPages: totalPagesCount,
                    currentPageNo: updatedPageNo,
                    loading: false
                });
                console.warn(res.data)
            } )
            .catch(  error =>   {
               if (axios.isCancel(error) || error ){
                   this.setState( {
                       loading: false,
                       // message: ''
                   })
               }
            })
    };
    handleOnInputChange = (event) => {
        const query = event.target.value;
      if( ! query){
        this.setState({ query, results: {}, message:''})
      }else {
          console.warn(query);
          this.setState( { query: query, loading: true, message: '' }, () => {
              this.fetchSearchResults( 1, query)
          } )
      }

    };


    renderSearchResults = () => {
        const {results} = this.state;

        if (Object.keys( results ).length && results.length) {
            return(
                <div className="results-container">
                    {results.map(result => {
                        return (
                            <a key={ result.omdbID } href={ result.Poster } >

                                <div>
                                    <p>{result.Title}</p>
                                    <img className="image" src={result.Poster} alt={`${result.Year} poster imges of moves with title from omdapi`}/>
                                </div>
                            </a>
                        )
                    })}
                </div>
            )
        }
    };

    render() {
        const {query,message} = this.state;
        console.warn(this.state);
        return (
            <div className="container">
                {/*{Heading}*/}
                <div className="heading"> Live Search React Application</div>
                {/*{Search Input}*/}
                <label className="search-label" htmlFor="search-input">
                    <input type="text"
                           name="query"
                           value={ query }
                           id="search-input"
                           placeholder="Search..."
                           onChange={this.handleOnInputChange}
                    />
                </label>
                {/*{Results}*/}
                {message && <p className="message">{message}</p>}
                <ul>

                {this.renderSearchResults()}

                </ul>
            </div>
        );
    }
}



export default Search;