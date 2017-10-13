import React from 'react'
import { Button,Modal, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import AvatarEditor from '../avatarEditor/creatAvatar'
import Pofile from './profile'
import axios from 'axios';
import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'
function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
function dataURItoBlob(dataURI, callback) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    let byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    let bb = new Blob([ab]);
    console.log(bb)
    return bb;
}
class LoginForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
           user:this.props.user,
            currentUser:null,
            password:null,
            confirmPass:null,
            userName:null,
            firstName:null,
            lastName:null,
            email:null,
            avatar:null,
            warning:true,
            success:false,
            hideMessage:true,
            creatAvatarOpen:false,
            imagePreviewUrl:'',
            file:'',
            error:false,
            errorDetails:null,
            signUp:false,
            userBlogs:null
        };
        this.componentDidMount=this.componentDidMount.bind(this)
        this.componentWillUnmount=this.componentWillUnmount.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleUnameChange = this.handleUnameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleFNameChange = this.handleFNameChange.bind(this);
        this.handleLNameChange = this.handleLNameChange.bind(this);
        this.handleConPassChange = this.handleConPassChange.bind(this);
        this.handleSignUp=this.handleSignUp.bind(this)
        this.onLoginClick = this.onLoginClick.bind(this);
        this.handSwichReg = this.handSwichReg.bind(this)
        this._handleFileChange = this._handleFileChange.bind(this);
        this.loadHandler = this.loadHandler.bind(this)
        this.closeCreateAvatar = this.closeCreateAvatar.bind(this)
        this.showCreateAvatar = this.showCreateAvatar.bind(this)
        this.setAvatar=this.setAvatar.bind(this)
        this.setBlogs = this.setBlogs.bind(this)
    };
    handleSignUp(){
        if(!this.state.userName || this.state.userName.length<4){
            this.setState({error:true,hideMessage:false,errorDetails:{field:'Username',message:"Username is required and must be more tha 5 characters"}})
            setTimeout(function () {
                this.setState({hideMessage:true,error:false})
            }.bind(this),2000)
            return
        }
        if(!this.state.firstName || this.state.firstName.length<3){
            this.setState({error:true,hideMessage:false,errorDetails:{field:'First Name',message:"First Name is required and must be more tha 3 characters"}})
            setTimeout(function () {
                this.setState({hideMessage:true,error:false})
            }.bind(this),2000)
            return
        }
        if(!this.state.lastName || this.state.lastName.length<3){
            this.setState({error:true,hideMessage:false,errorDetails:{field:'Last Name',message:"Last Name is required and must be more tha 3 characters"}})
            setTimeout(function () {
                this.setState({hideMessage:true,error:false})
            }.bind(this),2000)
            return
        }
        if(!this.state.email){
            this.setState({error:true,hideMessage:false,errorDetails:{field:'Email',message:"Email Address is required"}})
            setTimeout(function () {
                this.setState({hideMessage:true,error:false})
            }.bind(this),2000)
            return
        }
        if(typeof this.state.imagePreviewUrl !=='object'){
            this.setState({error:true,hideMessage:false,errorDetails:{field:'Avatar',message:"You have not created profile picture"}})
            setTimeout(function () {
                this.setState({hideMessage:true,error:false})
            }.bind(this),2000)
            return
        }
        if(!this.state.password || !this.state.confirmPass){
            this.setState({error:true,hideMessage:false,errorDetails:{field:'Password',message:"Password is required"}})
            setTimeout(function () {
                this.setState({hideMessage:true,error:false})
            }.bind(this),2000)
            return
        }
        if(this.state.password !== this.state.confirmPass){
            this.setState({error:true,hideMessage:false,errorDetails:{field:'Password',message:"Passwords don't match"}})
            setTimeout(function () {
                this.setState({hideMessage:true,error:false})
            }.bind(this),2000)
            return
        }
        let userData ={
            firstName: toTitleCase(this.state.firstName.toLowerCase()),
            lastName:toTitleCase(this.state.lastName.toLowerCase()),
            userName:this.state.userName.toLowerCase(),
            email:this.state.email.toLowerCase(),
            password:this.state.password,
            avatar:JSON.stringify(this.state.imagePreviewUrl)
        }
        dataURItoBlob(this.state.imagePreviewUrl.img)
        axios.post(env.httpURL,{
            "queryMethod":"registerUser",
            "queryData":userData
        })
            .then(function (success) {
                if(!success.data){
                    this.setState({error:true,hideMessage:false,errorDetails:{field:'Failed',message:"An error occured. Check your Internet"}})
                    setTimeout(function () {
                        this.setState({hideMessage:true})
                    }.bind(this),4000)
                    return false
                }
                if(success.data.code===200){
                    this.setState({success:true,hideMessage:false,errorDetails:{field:'Success',message:"Success"}})
                    setTimeout(function () {
                        this.setState({signUp:false,success:false,hideMessage:true})
                    }.bind(this),2000)
                }
                else {
                    this.setState({error:true,hideMessage:false,errorDetails:{field:'Failed',message:success.data.error}})
                    setTimeout(function () {
                        this.setState({hideMessage:true})
                    }.bind(this),4000)

                }
            }.bind(this))
            .catch(function (error) {
                this.setState({error:true,hideMessage:false,errorDetails:{field:'Failed',message:error.message}})
                setTimeout(function () {
                    this.setState({hideMessage:true})
                }.bind(this),4000)
                return false
            }.bind(this))
    }
    handlePasswordChange(e) {
        e.preventDefault();
        this.setState({password:e.target.value})

    }
    handleUnameChange(e) {
        e.preventDefault();
        this.setState({userName:e.target.value})

    }
    handleEmailChange(e) {
        e.preventDefault();
        this.setState({email:e.target.value})

    }
    handleFNameChange(e) {
        e.preventDefault();
        this.setState({firstName:e.target.value})

    }
    handleLNameChange(e) {
        e.preventDefault();
        this.setState({lastName:e.target.value})

    }
    handleConPassChange(e) {
        e.preventDefault();
        this.setState({confirmPass:e.target.value})

    }
    setAvatar(img){
        this.setState({imagePreviewUrl:img})
    }
    showCreateAvatar=()=>{
        this.setState({ creatAvatarOpen: true })
    }
    closeCreateAvatar=()=>{
        this.setState({ creatAvatarOpen: false })
    }
    componentDidMount() {
        this.setState({hideMessage:true})
        console.log("_______at login now")
        if(!this.state.user){
            let known = localStorage.getItem('user')
            if(known){
                let user = JSON.parse(known)
                if(user.firstName && user.lastName && user.userName){
                    this.setState({user:user})
                    this.props.successLogin(user)
                    this.setBlogs(user.userName)
                }
                else {
                    localStorage.removeItem('user')
                }
            }
        }
    }
    componentWillUnmount() {
    }
    onLoginClick= () => {
        if(!this.state.userName || !this.state.password){
            this.setState({error:true,hideMessage:false,errorDetails:{field:'Login',message:"Invalid login details"}})
            setTimeout(function () {
                this.setState({error:false,hideMessage:true})
            }.bind(this),2000)
            return false
        }
        let userData = {
            userName:this.state.userName,
            password:this.state.password,
        }
        axios.post(env.httpURL,{
            "queryMethod":"loginUser",
            "queryData":userData
        })
            .then(function (success) {
                if(!success.data){
                    this.setState({error:true,hideMessage:false,errorDetails:{field:'Login',message:"An error occurred, Check your Internet"}})
                    setTimeout(function () {
                        this.setState({error:false,hideMessage:true})
                    }.bind(this),2000)
                    return false
                }
                if(success.data.id){
                    success.data.name = success.data.userName
                    this.setState({currentUser:success.data})
                    this.props.successLogin(success.data)
                }
                else {
                    this.setState({error:true,hideMessage:false,errorDetails:{field:'Login',message:success.data.error}})
                    setTimeout(function () {
                        this.setState({error:false,hideMessage:true})
                    }.bind(this),2000)
                }
            }.bind(this))
            .catch(function (error) {
                this.setState({error:true,hideMessage:false,errorDetails:{field:'Login',message:"An erro occured, Check your Internet"}})
                setTimeout(function () {
                    this.setState({error:false,hideMessage:true})
                }.bind(this),2000)
            }.bind(this))

    }
    setBlogs(userName){
        console.log('+++++++++starting fetch blogs by you')
        axios.post(env.httpURL, {
            "queryMethod":"getPosts",
            "queryData":{
                userName:userName
            }
        })
            .then(function (response) {
                console.log('+++++++++got some blogs by u')
                console.log(response.data)
                if(response.data[0]){
                    this.setState({userBlogs:response.data})
                    console.log(this.state.blogsLoaded)

                }
                else {
                    this.setState({userBlogs:[]});

                }
                console.log(this.state.userBlogs)
            }.bind(this))
            .catch(function (err) {
                console.log('+++++++++got go nothing')
                this.setState({userBlogs:[]})
                console.log(err)
            }.bind(this))
    }

    handSwichReg = function (state){
        this.setState({signUp:state})
    }
    _handleFileChange(e) {
        e.preventDefault();
        if (window.FileReader) {
            let reader = new FileReader();
            let file = e.target.files[0];

            reader.onloadend = () => {
                this.setState({
                    file: file,
                    imagePreviewUrl: reader.result
                });
            }
            reader.readAsDataURL(file)
        } else {
            alert('FileReader are not supported in this browser.');
        }
    }
    loadHandler(event) {
        this.setState({avatar:event.target.result})
    }
    errorHandler(evt) {
        return new Promise((resolve, reject) => {
            if (evt.target.error.name === "NotReadableError") {
                reject("Can't read file !");
            }
            else {
                reject("Can't read file !");
            }
        })
    }
    onClickSave = () => {
        if (this.editor) {
            // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
            // drawn on another canvas, or added to the DOM.
            const canvas = this.editor.getImage()

            // If you want the image resized to the canvas size (also a HTMLCanvasElement)
            const canvasScaled = this.editor.getImageScaledToCanvas()
        }
    }

    setEditorRef = (editor) => this.editor = editor

    render(){
      let $imagePreview = null;
      if (this.state.imagePreviewUrl!=='') {
          $imagePreview = (<img src={this.state.imagePreviewUrl} />);
      } else {
          $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
      }
    return(
        <div>
            <Modal open ={this.state.creatAvatarOpen}>
                <Modal.Header ><Header style={{ margin:'1em 0em 0em 0em', textAlign :'left',alignment:'center'}} color='green' as='h1'>
                    Create your Profile Picture.
                </Header></Modal.Header>
                <Modal.Content>
                    <div>
                        <p>
                           Click preview to see your picture as it will appear.
                        </p>
                    </div>
                    <hr/>
                    <Modal.Description>
                        <AvatarEditor setAvatar = {this.setAvatar}/>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button.Group>
                        <Button color="blue" onClick={this.closeCreateAvatar}>Cancel</Button>
                        <Button.Or />
                        <Button color="green" onClick={this.closeCreateAvatar}>Save</Button>
                    </Button.Group>
                </Modal.Actions>
            </Modal>
            {
                this.props.loggedin?
                    <div>
                        <Pofile
                            userBlogs ={this.state.userBlogs}
                            user={this.props.user}
                            currentUser={this.state.currentUser}
                            _goToEditor = {this.props._goToEditor}
                            _exitEditMode={this.props._exitEditMode}
                            editingMode={this.props.editingMode}
                            createNew={this.props.createNew}
                            _handleCreateNew={this.props._handleCreateNew}
                            colors = {this.props.colors}/>
                    </div> :
                    <div>
                        {
                            this.state.signUp?
                                <div className='login-form'>
                                    <Header as='h2' color={this.props.color} textAlign='center'>
                                        Sign Up to Join Us
                                    </Header>
                                    <Grid
                                        textAlign='center'
                                        style={{ height: '100%',marginTop:25 }}
                                        verticalAlign='middle'
                                    >
                                        <Grid.Column style={{ maxWidth: 400 ,border: '2px solid green'}}>
                                            <Header as='h2' color='teal' textAlign='center'>
                                            </Header>
                                            <Form size='large'>
                                                <Form.Field>
                                                    {
                                                        this.state.imagePreviewUrl===''?
                                                            <Button color='green' onClick={()=>this.showCreateAvatar(false)}> Create Avatar</Button>:
                                                            <div>
                                                                {!!this.state.imagePreviewUrl &&
                                                                <img
                                                                    src={this.state.imagePreviewUrl.img}
                                                                    style={{
                                                                        borderRadius: `${(Math.min(
                                                                            this.state.imagePreviewUrl.height,
                                                                            this.state.imagePreviewUrl.width
                                                                            ) +
                                                                            10) *
                                                                        (this.state.imagePreviewUrl.borderRadius / 2 / 100)}px`
                                                                    }}
                                                                />}
                                                                <br/>
                                                                <Button color='green' onClick={()=>this.showCreateAvatar(false)}> Change Avatar</Button>
                                                            </div>
                                                    }
                                                </Form.Field>

                                                <Form.Group widths='equal'>
                                                    <Form.Input
                                                        size="small"
                                                        label='First Name'
                                                        fluid
                                                        type="text"
                                                        placeholder='First Name'
                                                        onChange={this.handleFNameChange}
                                                    />
                                                    <Form.Input
                                                        label='Last Name'
                                                        fluid
                                                        type="text"
                                                        placeholder='Last Name'
                                                        onChange={this.handleLNameChange}
                                                    />
                                                </Form.Group>
                                                <Form.Input
                                                    label='Email Address'
                                                    fluid
                                                    type="email"
                                                    placeholder='E-mail address'
                                                    onChange={this.handleEmailChange}
                                                />
                                                <Form.Group widths='equal'>
                                                    <Form.Input
                                                        label='Username'
                                                        fluid
                                                        type="text"
                                                        placeholder='Username'
                                                        onChange={this.handleUnameChange}
                                                    />
                                                </Form.Group>
                                                <Form.Group widths='equal'>
                                                    <Form.Input
                                                        label='Password'
                                                        fluid
                                                        type="password"
                                                        placeholder='Password'
                                                        onChange={this.handlePasswordChange}
                                                    />
                                                    <Form.Input
                                                        label='Confirm Password'
                                                        fluid
                                                        type="password"
                                                        placeholder='Confirm Password'
                                                        onChange={this.handleConPassChange}
                                                    />
                                                </Form.Group>

                                                <Button onClick={()=>this.handleSignUp()} color='green' type='submit'>Submit</Button>
                                            </Form>
                                            <Message
                                                hidden={this.state.hideMessage}
                                                error={this.state.error}
                                                success={this.state.success}
                                            >
                                                <Message.Header>
                                                    {this.state.errorDetails?this.state.errorDetails.message:'There are errors in your Input'}
                                                    </Message.Header>
                                            </Message>
                                            <Message>
                                                Have an Account?  <button onClick={()=>this.handSwichReg(false)}> Login</button>
                                            </Message>
                                        </Grid.Column>
                                    </Grid>
                                </div>:
                                <div className='login-form'>
                                    <Grid
                                        textAlign='center'
                                        style={{ height: '100%',marginTop:25 }}
                                        verticalAlign='middle'
                                    >
                                        <Grid.Column style={{ maxWidth: 300 }}>
                                            <Header as='h2' color='teal' textAlign='center'>
                                                <Image src='/img/login/login.png' />
                                            </Header>
                                            <Form size='large'>
                                                <Segment stacked>
                                                    <Form.Input
                                                        fluid
                                                        icon='user'
                                                        iconPosition='left'
                                                        placeholder='E-mail address'
                                                        onChange={this.handleUnameChange}
                                                    />
                                                    <Form.Input
                                                        fluid
                                                        icon='lock'
                                                        iconPosition='left'
                                                        placeholder='Password'
                                                        type='password'
                                                        onChange={this.handlePasswordChange}
                                                    />
                                                    <Button  type="button" onClick={this.onLoginClick}  color={this.props.color} fluid size='large'>Login</Button>
                                                </Segment>
                                            </Form>
                                            <Message
                                                hidden={this.state.hideMessage}
                                                error={this.state.error}
                                                success={this.state.success}
                                            >
                                                <Message.Header>
                                                    {this.state.errorDetails?this.state.errorDetails.message:'Something happened. Please check your Internet'}
                                                </Message.Header>
                                            </Message>
                                            <Message>
                                                Want to Join Us?  <button onClick={()=>this.handSwichReg(true)}> Sign Up</button>
                                            </Message>
                                        </Grid.Column>
                                    </Grid>
                                </div>
                        }
                    </div>
            }
        </div>

    )
  }
}
export default LoginForm