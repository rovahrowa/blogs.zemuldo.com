import React from 'react'
import {Button, Modal, Header, Icon, Image, Dropdown} from 'semantic-ui-react'
import {connect} from 'react-redux'
import BlogEditor from '../blogEditor/renderBlog'
import axios from 'axios'
import config from '../environments/conf'
import {bindActionCreators} from 'redux'
import * as BlogActions from '../state/actions/blog'
import PropTypes from 'prop-types'

const env = config[process.env.NODE_ENV] || 'development'

class Blog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      youLike: false,
      showDelete: false,
      userLoggedIn: false,
      likes: this.props.blog ? this.props.blog.likes : 0,
      authorAvatar: null
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.updateLikes = this.updateLikes.bind(this)
    this.getAauthorAvatar = this.getAauthorAvatar.bind(this)
    this.closeDelete = this.closeDelete.bind(this)
    this.openDelete = this.openDelete.bind(this)
    this.getFBCount = this.getFBCount.bind(this)
    this.getTWTCount = this.getTWTCount.bind(this)
    this.getGCCount = this.getGCCount.bind(this)
  }

  closeDelete () {
    this.setState({showDelete: false})
  }

  openDelete () {
    this.setState({showDelete: true})
  }

  setBlogCounts () {
    let thisBlog = this.props.blog
    let shareURL = thisBlog.type + '/' + thisBlog.topics[0] + '/' + thisBlog.userName + '_' + thisBlog.title.split(' ').join('-') + '_' + thisBlog.date.split(' ').join('-') + '_' + thisBlog.id.toString()
    let gplusPost = {
      'method': 'pos.plusones.get',
      'id': 'p',
      'params': {
        'nolog': true,
        'id': 'https://zemuldo/' + shareURL,
        'source': 'widget',
        'userId': '@viewer',
        'groupId': '@self'
      },
      'jsonrpc': '2.0',
      'key': 'p',
      'apiVersion': 'v1'
    }
    window.scrollTo(0, 0)
    this.getFBCount(shareURL)
    this.getTWTCount(shareURL)
    this.getGCCount(gplusPost)
  }

  getFBCount (shareURL) {
    return axios.get('https://graph.facebook.com/?id=https://zemuldo.com/' + shareURL, {})
            .then((res) => {
              this.props.blogActions.updateBlog({
                fbC: (res.data.share.share_count) ? res.data.share.share_count : 0
              })
              return true
            })
            .catch((err) => {
              this.props.blogActions.updateBlog({
                fbC: 0
              })
            })
  };

  twtC

  getTWTCount (shareURL) {
    return axios.get('https://public.newsharecounts.com/count.json?url=https://zemuldo.com/' + shareURL, {})
            .then((res) => {
              this.props.blogActions.updateBlog({
                twtC: (res.data.count) ? res.data.count : 0
              })
            })
            .catch((err) => {
              this.props.blogActions.updateBlog({
                twtC: 0
              })
            })
  };

  getGCCount (gplusPost) {
    return axios.post(' https://clients6.google.com/rpc', gplusPost)
            .then((res) => {
              this.props.blogActions.updateBlog({
                gplsC: (res.data.result.metadata.globalCounts.count) ? res.data.result.metadata.globalCounts.count : 0
              })
              return true
            })
            .catch((err) => {
              this.props.blogActions.updateBlog({
                gplsC: 0
              })
            })
  };

  getAauthorAvatar () {
    axios.post(env.httpURL, {
      'queryMethod': 'getAvatar',
      'queryData': {
        'id': this.props.blog.authorID
      }
    })
            .then(function (res) {
              if (!res) {
                return false
              }
              if (!res.data) {
                return false
              }
              if (res.data.imageURL) {
                this.setState({authorAvatar: JSON.parse(res.data.imageURL)})
              }
            }.bind(this))
            .catch(function (err) {

            })
  }

  componentDidMount () {
    this.props.blogActions.updateBlog({editMode: false})
    if (this.props.blog) {
      this.getAauthorAvatar()
      this.setBlogCounts()
    }
    this.setState({youLike: true})
    if (localStorage.getItem('user')) {
      this.setState({userLoggedIn: true})
      axios.post(env.httpURL, {
        'queryMethod': 'getLike',
        'queryData': {
          postID: this.props.blog.id,
          title: this.props.blog.title,
          userID: JSON.parse(localStorage.getItem('user')).id
        }
      })
                .then(function (response) {
                  if (!response.data) {
                    this.setState({youLike: false})
                    return false
                  }
                  if (!response.data.state) {
                    this.setState({youLike: false})
                    return false
                  }
                  if (response.data.state === false) {
                    this.setState({youLike: false})
                    return false
                  }
                  if (response.data.state === true) {
                    if (response.data.n) {
                      this.setState({youLike: true})
                      return true
                    } else {
                      return false
                    }
                  }
                }.bind(this))
                .catch(function (err) {
                  this.setState({youLike: false})
                  return false
                }.bind(this))
    }
  }

  fbShare () {
    let fbShareURL = 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fzemuldo.com%2F'
    if (this.props.blog) {
      let thisBlog = this.props.blog
      let postURL = thisBlog.type + '/' + thisBlog.topics[0] + '/' + thisBlog.userName + '_' + thisBlog.title.split(' ').join('-') + '_' + thisBlog.date.split(' ').join('-') + '_' + thisBlog.id.toString()
      let shareURL = fbShareURL + postURL + "&amp;src=sdkpreparse'"
      window.open(shareURL, 'sharer', 'toolbar=0,status=0,width=548,height=325')
    }
  }

  tweetShare () {
    if (this.props.blog) {
      let hashTgs = '%2F&hashtags=' + this.props.blog.topics.join(',')
      let via = '&via=zemuldo'
      let related = '&related=https%3A%2F%2Fpic.twitter.com/Ew9ZJJDPAR%2F'
      let thisBlog = this.props.blog
      let url = '&url=https%3A%2F%2Fzemuldo.com/' + thisBlog.type + '/' + thisBlog.topics[0] + '/' + thisBlog.userName + '_' + thisBlog.title.split(' ').join('-') + '_' + thisBlog.date.split(' ').join('-') + '_' + thisBlog.id.toString()
      let fullURL = url + related + hashTgs + via
      let shareURL = 'https://twitter.com/intent/tweet?text=pic.twitter.com/Ew9ZJJDPAR ' + this.props.blog.title + fullURL
      window.open(shareURL, 'sharer', 'toolbar=0,status=0,width=548,height=325')
    }
  }

  gplusShare () {
    let thisBlog = this.props.blog
    let url = '&url=https%3A%2F%2Fzemuldo.com/' + thisBlog.type + '/' + thisBlog.topics[0] + '/' + thisBlog.userName + '_' + thisBlog.title.split(' ').join('-') + '_' + thisBlog.date.split(' ').join('-') + '_' + thisBlog.id.toString()
    if (this.props.blog) {
      url = 'https://plus.google.com/share?url=https://zemuldo.com/' + url
      window.open(url)
    }
  }

  linkdnShare () {
    let thisBlog = this.props.blog
    let url = '&url=https%3A%2F%2Fzemuldo.com/' + thisBlog.type + '/' + thisBlog.topics[0] + '/' + thisBlog.userName + '_' + thisBlog.title.split(' ').join('-') + '_' + thisBlog.date.split(' ').join('-') + '_' + thisBlog.id.toString()
    window.open('https://www.linkedin.com/cws/share?url=https%3A%2F%2Fzemuldo.com/' + url, '', 'height=550,width=525,left=100,top=100,menubar=0')
  }

  updateLikes = (id) => {
    if (localStorage.getItem('user')) {
      return axios.post(env.httpURL, {
        'queryMethod': 'updateBlogLikes',
        'queryData': {
          id: id,
          title: this.props.blog.title,
          userID: JSON.parse(localStorage.getItem('user')).id
        }
      })
                .then(function (response) {
                  if (response.data.state === false) {
                    return
                  }
                  if (response.data.n) {
                    if (response.data.n) {
                      this.setState({likes: this.state.likes + 1, youLike: true})
                    }
                  }
                }.bind(this))
                .catch(function (err) {
                })
    }
  };
  deletBlog = (id) => {
    if (localStorage.getItem('user')) {
      return axios.post(env.httpURL, {
        'queryMethod': 'deleteBlog',
        'queryData': {
          id: id
        }
      })
                .then(function (response) {
                  this.closeDelete()
                  this.props.deletedBlog()
                }.bind(this))
                .catch(function (err) {
                  this.closeDelete()
                }.bind(this))
    }
  };

  render () {
    return (
      <div>
        <Modal dimmer open={this.state.showDelete}>
          <Modal.Header>This Post will be deleted</Modal.Header>
          <Modal.Content image>
            <Modal.Description>
              <Header style={{textAlign: 'left', alignment: 'center'}} color={this.props.vars.color} as='h1'>
                {
                                    this.props.blog.title
                                }
              </Header>
              <span className='info'>
                                   Published on:
                                   <br />
                {this.props.blog.date}
              </span>
              <br />
              <br />
              <span className='info'>
                {this.props.blog.author} {' '}
              </span>
              <div style={{margin: '2em 0em 3em 0em', fontSize: '16px', fontFamily: 'georgia'}}>
                <br />
                <BlogEditor body={this.props.blog.body} />
              </div>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button color='black' onClick={() => this.closeDelete()}>
                            Cancel
                        </Button>
            <Button color='red' positive icon='checkmark' labelPosition='right' content='Delete'
              onClick={() => this.deletBlog(this.props.blog.id)} />
          </Modal.Actions>
        </Modal>
        {
                    this.props.blog
                        ? <div>
                          <Header style={{textAlign: 'left', alignment: 'center'}} color={this.props.vars.color} as='h1'>
                            {
                                    this.props.blog.title
                                }
                          </Header>
                          <div className='shareIcon clearElem'
                            style={{display: 'block', fontSize: '16px', fontFamily: 'georgia'}}>
                            {
                                    this.state.userLoggedIn
                                        ? <span>
                                          {
                                                this.state.youLike
                                                    ? <Icon color={this.props.vars.color} name='like' />
                                                    : <button onClick={() => this.updateLikes(this.props.blog.id)}>
                                                      <Icon color='green' name='thumbs up' />
                                                    </button>
                                            }
                                        </span>
                                        : <span>
                                            Likes:
                                        </span>
                                }
                            <span>
                              <span style={{color: this.props.vars.color}}>
                                {' '}{this.state.likes}
                              </span>
                            </span>
                            <br />
                            <Icon size='large' color='green' name='external share' />
                                Share this on: {}
                            {'  '}
                            <Button
                              onClick={() => {
                                this.tweetShare()
                              }}
                              circular color='twitter' icon='twitter' />
                            <sup>{this.props.blog.twtC}</sup>
                            {'   '}
                            <Button
                              onClick={() => {
                                this.fbShare()
                              }}
                              circular color='facebook' icon='facebook' />
                            <sup>{this.props.blog.fbC}</sup>
                            {'   '}
                            <Button
                              onClick={() => {
                                this.linkdnShare()
                              }}
                              circular color='linkedin' icon='linkedin' />
                            <sup>{this.props.blog.gplsC}</sup>
                            {'   '}
                            <Button
                              onClick={() => {
                                this.gplusShare()
                              }}
                              circular color='google plus' icon='google plus' />
                            <sup>{this.props.blog.gplsC}</sup>
                            <br />
                            <br />
                            <span>
                              {
                                        this.state.authorAvatar

                                            ? <Image
                                              floated='left'
                                              avatar
                                              id='photo'
                                              size='tiny'
                                              src={this.state.authorAvatar.img}
                                              style={{
                                                borderRadius: `${(Math.min(
                                                        this.state.authorAvatar.height,
                                                        this.state.authorAvatar.width
                                                        ) +
                                                        10) *
                                                    this.state.authorAvatar.borderRadius / 2 / 100}px`
                                              }}
                                            />
                                            : <span />
                                    }
                            </span>
                            <span className='info'>
                                   Published on:
                                   <br />
                              {this.props.blog.date}
                            </span>
                            <br />
                            <br />
                            <span className='info'>
                              {this.props.blog.author} {' '}
                            </span>
                            {
                                    this.props.user && this.props.user.id && this.props.user.userName === this.props.blog.userName
                                        ? <div>
                                          <Dropdown text='Manage' pointing className='link item info'>
                                            <Dropdown.Menu>
                                              <Dropdown.Item color='red'
                                                onClick={() => this.openDelete()}>Delete</Dropdown.Item>
                                              <Dropdown.Item
                                                onClick={() => this.props.blogActions.updateBlog({editMode: true})}
                                                    >
                                                       Edit
                                                    </Dropdown.Item>
                                              <Dropdown.Item
                                                onClick={() => this.props.blogActions.updateBlog({editMode: false})}
                                                   >
                                                      Save
                                                   </Dropdown.Item>
                                              <Dropdown.Item>Hide</Dropdown.Item>
                                            </Dropdown.Menu>
                                          </Dropdown>
                                        </div>
                                        : null
                                }
                          </div>
                          <hr color='green' />
                          <div style={{margin: '2em 0em 3em 0em', fontSize: '16px', fontFamily: 'georgia'}}>
                            <br />
                            <BlogEditor editorState={this.props.blog.body} />
                          </div>
                        </div>
                        : <div>
                            Content not found!
                        </div>
                }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    blog: state.blog,
    vars: state.vars,
    user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    blogActions: bindActionCreators(BlogActions, dispatch)
  }
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.oneOf([null])
  ]),
  vars: PropTypes.object.isRequired,
  blogActions: PropTypes.object.isRequired,
  deletedBlog: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Blog)
