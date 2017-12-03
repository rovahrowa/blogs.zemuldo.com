import React, { Component } from 'react';
import { Header} from 'semantic-ui-react'
import _ from 'lodash'
import util from '../util'
import {topics} from '../environments/conf'

class Topics extends Component {
    constructor(props){
        super(props);
        this.state = {
        };
    };
    render() {
        return (
            <div className='topicsWrapper'>
                <Header color='blue' as='h3'>Topics</Header>
                <button
                    disabled={window.location.pathname.split('/')[2]==='all' || !window.location.pathname.split('/')[2]}
                    className="topicButton"
                    onClick={ this.props.onAllcClick.bind('all')}
                    name='all'

                >
                            <span>
                                {'All '+ '|'}
                            </span>
                </button>
                { _.times(topics.length, i =>
                    <button
                        disabled={window.location.pathname.split('/')[2]===topics[i].name}
                        key={topics[i].key}
                        className="topicButton"
                        onClick={ this.props.onTopicClick.bind(this,topics[i].text)}
                        name={topics[i].name}
                    >
                            <span>
                                {util.toTitleCase(topics[i].name)}
                                {' '+ '|'}
                            </span>
                    </button>
                )
                }
            </div>
        )
    }
}
export default Topics;
