import React, { Component } from 'react';
import { Button,Image,Icon,List,Header} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'
class Blog extends Component {
    constructor(props){
        super(props);
        this.state = {

        };

    };
    fbShare () {
        if(this.props.blog){
            let shareURL = 'https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fzemuldo.com%2F'+this.props.blog.title.split(' ').join('%2520')+"&amp;src=sdkpreparse'"
            window.open(shareURL, 'sharer', 'toolbar=0,status=0,width=548,height=325');

        }
    }
    tweetShare () {
        if(this.props.blog){
            let shareURL = 'https://twitter.com/intent/tweet?text='+this.props.blog.title.split(' ').join('%20')+'&url=http%3A%2F%2Fzemuldo.com/'+this.props.blog.title.split(' ').join('-')+'%2F'+'&via=zemuldo'
            window.open(shareURL, 'sharer', 'toolbar=0,status=0,width=548,height=325');

        }
    }
    componentDidMount() {
    }
    render() {
        return (
            <div>
                <Header style={{}} color={this.props.color} as='h1'>
                    {
                        this.props.blog.title
                    }
                </Header>
                <div style={{display:'block',fontSize:"16px",fontFamily:"georgia"}}>
                    Share:
                    {'  '}
                    <Button
                        onClick={() => {this.tweetShare();}}
                        circular color='twitter' icon='twitter' />
                    <sup>{this.props.counts.twtC}</sup>
                    {'   '}
                    <Button
                        onClick={() => {this.fbShare();}}
                        circular color='facebook' icon='facebook' />
                    <sup>{this.props.counts.fbC}</sup>
                    {'   '}
                    <Button
                        onClick={() => {this.fbShare();}}
                        circular color='linkedin' icon='linkedin' />
                    <sup>{this.props.counts.fbC}</sup>
                    {'   '}
                    <Button
                        onClick={() => {this.gplusShare();}}
                        circular color='google plus' icon='google plus' />
                    <sup>{this.props.counts.gplsC}</sup>
                    <br/>
                    <br/>
                    Published on:  {this.props.blog.date}  By {this.props.blog.author}
                </div>
                <hr color={this.props.color}/>
                <div style={{margin: '3em 1em 3em 2em', display:'block',fontSize:"16px",fontFamily:"georgia"}}>
                    <Image width={1} size='big' shape='rounded' src='/img/blogs/blogs_pic.jpg' />
                    <br/>
                    <p>
                        {
                            this.props.blog.body
                        }
                    </p>
                </div>

            </div>
        )
    }
}
export default Blog;
