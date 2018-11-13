import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./Login.css";
import { Auth } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            email: "",
            password: ""
        };
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = async event => {
        event.preventDefault();
        this.setState({ isLoading: true });

        try {
            await Auth.signIn(this.state.email, this.state.password);
            this.props.userHasAuthenticated(true);
            this.setState({ isLoading: false });
            this.props.history.push({
                pathname: '/',
                email: this.state.email,
                password: this.state.password
            });
        } catch (e) {
            this.setState({ isLoading: false });
            if(e.message === "User is not confirmed."){
                alert("Account is not verified, press ok to go to confirmation page!");
                this.props.history.push({
                    pathname: '/confirm',
                    email: this.state.email,
                });
            }else{
                alert("Invalid user or password!");
            }
        }
    }

    render() {
        return (
            <div className="Login">
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="email" bsSize="large">
                        <ControlLabel>Email</ControlLabel>
                        <FormControl
                            autoFocus
                            type="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="password" bsSize="large">
                        <ControlLabel>Password</ControlLabel>
                        <FormControl
                            value={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                        />
                    </FormGroup>
                    <LoaderButton
                        block
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                        isLoading={this.state.isLoading}
                        text="Login"
                        loadingText="Logging in…"
                    />
                </form>
            </div>
        );
    }
}