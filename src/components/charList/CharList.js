import { Component } from 'react';

import PropTypes from 'prop-types'
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../../errorMessage/ErrorMessage'
import Spinner from '../../spinner/spinner';
import './charList.scss';

class CharList extends Component  {
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest()
    }

    onRequest = (offset) => {
        this.onCharLoading();
        this.marvelService.getAllCharacters()
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if(newCharList < 9) {
            ended = true;
        }

        this.setState(({charList, offset}) => ( {
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }   

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    renderData = (arr) => {
        const items = arr.map(item => {
            let itemStyle = {'objectFit': 'cover'};
            if(item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'){
                itemStyle = {'objectFit' : 'unset'}
            }

            return(
                <li className="char__item"
                key={item.id}
                onClick={() => this.props.onCharSelected(item.id)}>
                        <img src={item.thumbnail} alt="abyss" style={itemStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        })

        return(
            <ul className="char__list" style={{display: 'inline-block'}}>
                {items}
            </ul>
        )
   
    }

    render() {
        const {charList, loading, error, newItemLoading, offset, charEnded} = this.state;

        const items = this.renderData(charList)

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                
                {errorMessage}
                {spinner}
                {content}
                
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded? 'none' : 'block'}}
                    onClick={() => this.onRequest(offset)}
                    >
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected : PropTypes.func.isRequired
}

export default CharList;