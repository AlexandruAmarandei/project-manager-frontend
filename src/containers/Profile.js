import React, { Component } from "react";
import { ListGroup, ListGroupItem, Button, FormGroup, ControlLabel, FormControl} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Auth } from "aws-amplify";

import "./Home.css";
import { API } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";

export default class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            email: "",
            profileEmail: "",
            skills: [],
            userInfo: undefined,
            newSkill: ""
        };
    }

    async componentDidMount() {
        console.log(this.props);
        if (!this.props.isAuthenticated) {
            return;
        }
        this.setState({profileEmail: this.props.location.email});

        const e = await Auth.currentAuthenticatedUser();
        this.setState({email: e.attributes.email});
        try {
            const userInfo = await this.getUserInfo();
            if(userInfo.projects[0] === "!!!empty!!!"){
                userInfo.projects = [];
            }
            this.setState({ userInfo: userInfo });
            if(userInfo.skills[0] === "!!!empty!!!"){
                this.setState({skills:[]});
            }else {
                this.setState({skills: userInfo.skills});
            }
            console.log(userInfo);
            this.setState({ isLoading: false });
            console.log(this.state);
        } catch (e) {
            this.setState({ isLoading: false });
            console.log(e.message);
            alert(e);
        }

    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    getUserInfo(){
        var toPass = {
            queryStringParameters: {
                email : this.state.profileEmail
            }
        }
        return API.get("PMApp", "/getUserInfo", toPass);
    }

    renderNothing(){
        return;
    }

    async removeSkill (event, position, skill){
        event.preventDefault();
        let skills = this.state.skills;
        skills.splice(position, 1);
        console.log(skills);
        this.setState({skills: skills});


    }

    renderDeleteButtonForSkill(position, skill){
        return(
          <Button
            onClick={(e) => this.removeSkill(e,position, skill)}
          >
              X
          </Button>
        );
    }

    renderSkills(skills){
        return skills.map(
            (skill, i) =>
                    <ListGroupItem key={i}>
                        { i + ": " +skill}
                        {this.state.email === this.props.location.email ? this.renderDeleteButtonForSkill(i, skill) : this.renderNothing()}

                    </ListGroupItem>
        );
    }

    renderProjects(){
        if(this.state.userInfo === undefined) return;
        let projArr = [];
        for(let i=0;i <this.myLength(this.state.userInfo.projects);i++){
            projArr[i] = this.mySubstring( this.state.userInfo.projects[i],this.myLastIndexOf(":", this.state.userInfo.projects[i]));
        }
        return projArr.map(
            (project, i)=>
                <LinkContainer
                    key={i}
                    to={{pathname: `/project/${ this.state.email + project }`, state: {projectId: this.state.userInfo.projects[i]}, email: this.state.email}}
                >
                    <ListGroupItem>
                    {project}
                    </ListGroupItem>
                </LinkContainer>
        );
    }

    myLength(jsonArry){
        var key, count = 0;
        for(key in jsonArry) {
            if(jsonArry.hasOwnProperty(key)) {
                count++;
            }
        }
        return count;
    }

    myLastIndexOf(toFind, s){
        let pos = -1;
        for(let i=0; i<this.myLength(s);i++){
            if(toFind === s[i]){
                pos = i;
            }
        }
        return pos;
    }

    mySubstring(stringToSplit, from){
        let toReturn = String(stringToSplit).substring(from + 1);
        return toReturn;
    }

    validateForm() {
        return (
            this.state.newSkill.length > 0
        );
    }

    addToLocalList = async event =>{
        event.preventDefault();
        let newSkills = this.state.skills;
        console.log(newSkills);

        newSkills[this.myLength(newSkills)] = this.state.newSkill;
        console.log(newSkills);
        this.setState({skills: newSkills});
    }

    updateSkills = async event => {
        event.preventDefault();
        const toPass = {
            body : {
                skills: this.state.skills,
                userId: this.props.location.email
            }
        }
        return API.post("PMApp", "/updateUser", toPass);
    }

    render() {
        return (
            <div className="Home">
                <h4> Name</h4>
                <ListGroup>
                    <ListGroupItem>
                        Name : {this.state.profileEmail}
                    </ListGroupItem>
                </ListGroup>
                <h4>Projects</h4>
                <ListGroup>
                    {this.renderProjects()}
                </ListGroup>
                <h4>Skills</h4>
                { this.state.email === this.props.location.email?
                    <div>
                    <form onSubmit={this.addToLocalList}>
                        <FormGroup controlId="newSkill">

                            <ControlLabel>New skill</ControlLabel>
                            <FormControl
                                autoFocus
                                value={this.state.newSkill}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <LoaderButton
                            block
                            bsStyle="primary"
                            bsSize="large"
                            disabled={!this.validateForm()}
                            type="submit"
                            isLoading={this.state.isLoading}
                            text="Add new skill"
                            loadingText="Adding…"
                        />
                    </form>
                    <ListGroup>
                        <span></span>
                    {this.renderSkills(this.state.skills)}
                    </ListGroup>

                    <form onSubmit={this.updateSkills}>
                    <LoaderButton
                    block
                    bsStyle="primary"
                    bsSize="large"
                    type="submit"
                    isLoading={this.state.isLoading}
                    text="Update skills"
                    loadingText="Updating…"
                    />
                    </form>
                    </div>:
                    this.renderSkills(this.state.skills)
                }
            </div>
        );
    }
}