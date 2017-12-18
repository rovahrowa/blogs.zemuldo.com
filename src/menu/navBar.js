import React from 'react'
import CompMenu from './main';
import MobileMenu from './fixedMenu'

class NavBar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        };
    };
    componentDidMount(){}
    render() {
        return (
            <div>
                {
                    window.innerWidth>800?
                        <CompMenu/>:
                        <MobileMenu
                        />
                }
            </div>
        )
    }
}
export default NavBar