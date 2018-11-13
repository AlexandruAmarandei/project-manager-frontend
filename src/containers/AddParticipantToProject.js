import React, { Component } from "react";
import { API } from "aws-amplify";
import {FormGroup, FormControl, ControlLabel, ListGroupItem,  Button} from "react-bootstrap";
import "./Login.css";
import LoaderButton from "../components/LoaderButton";
import {validateLink} from "../libs/urlValidator";
import {LinkContainer} from "react-router-bootstrap";


export default class AddParticipantToProject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            hasResults: false,
            results: [],
            disableButton: [],
            searchString: ""
        };
    }



    validateForm() {
        if(!validateLink(this.state.searchString)){
            return false;
        }
        return this.state.searchString.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = async event => {
        event.preventDefault();
        this.setState({ isLoading: true });
        this.setState({results: []});
        try{
            var qresults;
            if(this.state.searchString.indexOf("@") > -1) {
                qresults = await this.searchByEmail();
                this.setState({results :qresults })
                console.log(qresults);
            }else{
                qresults = await this.searchBySkill();
                this.setState({results :qresults })
                console.log(qresults);
            }
            this.setState({hasResults : true});
            this.setState({isLoading: false});
            var array = [];
            for(var i=0; i<qresults.length;i++){
                array[i] = 1;
            }
            this.setState({disableButton : array});
        }catch(e){
            this.setState({isLoading: false})
            alert(e);
        }
    }

    searchByEmail(){
        var toPass = {
            queryStringParameters:{
                email : this.state.searchString,
                creator: this.props.location.email,
                project : this.props.location.state
            }
        };
        console.log(toPass);
        return API.get("PMApp", "/searchUserByName", toPass);
    }


    searchBySkill(){
        var toPass = {
            queryStringParameters:{
                email : this.state.searchString,
                creator: this.props.location.email,
                project : this.props.location.state
            }
        };
        console.log(toPass);
        return API.get("PMApp", "/searchBySkill", toPass);
    }

    async addUserToProject(event, toUpdate, buttonId){
        event.preventDefault();
        try{
            await this.addUserToProjectApiCall(toUpdate);
            var array = this.state.disableButton;
            array[buttonId] = 0;
            this.setState({disableButton : array});
        }catch(e){
            alert(e);
        }
    }

     addUserToProjectApiCall(user){
        var toPass = {
            body : {
                projectName : this.props.location.state,
                email : user.userId,
                creatorId: this.props.location.email
            }
        }
         return API.post("PMApp", "/addUserToProject", toPass);

     }

    renderResults(){
        if(this.state.results.length === 0){
            return;
        }
        return(
                this.state.results.map(
                    (result, i) =>
                        <LinkContainer
                            key = {"Profile" + i}
                            to = {{pathname: "/profileSkills",  email :result.userId}}
                        >
                            <ListGroupItem key={i}>
                                {result.userId}
                                <span className="pull-right">
                                    <Button
                                        onClick={(e) => this.addUserToProject(e,result, i)}
                                        disabled={this.state.disableButton[i] === 0}
                                    >
                                        <b>{"\uFF0B"}</b> Add
                                    </Button>
                                </span>
                            </ListGroupItem>
                        </LinkContainer>

                )
        );
    }

    renderEmpty(){
        return ;
    }
    render() {
        return (
            <div className="Search">
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="searchString" >
                        <ControlLabel>Email or skill</ControlLabel>
                        <FormControl
                            autoFocus
                            value={this.state.searchString}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <LoaderButton
                        block
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                        isLoading={this.state.isLoading}
                        text="Search"
                        loadingText="Searching"
                    />
                </form>
                <span> </span>
                {this.state.hasResults ? this.renderResults() : this.renderEmpty()}

            </div>

        );
    }
}