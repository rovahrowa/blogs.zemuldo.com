import React from 'react';
import Page from './pages/index'
import {  Switch, Route } from 'react-router-dom'

class Routes extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        };
    };
    render() {
        return (
            <main>
                <Switch>
                    <Route exact path='/' component={Page}/>
                    <Route path='/dev/:loadedDetails' component={Page}/>
                    <Route path='/tech/:loadedDetails' component={Page}/>
                    <Route path='/business/:loadedDetails' component={Page}/>
                    <Route path='/reviews/:loadedDetails' component={Page}/>
                    <Route path='/tutorials/:loadedDetails' component={Page}/>
                    <Route path='/about' component={Page}/>
                    <Route path='/:user/:details' component={Page}/>
                    <Route path='/login' component={Page}/>
                    <Route exact path='/*' component={Page}/>
                </Switch>
            </main>
        )
    }
}
export default Routes;