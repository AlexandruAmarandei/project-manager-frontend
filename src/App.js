import React, { Component, Fragment } from "react";
import { Nav, NavItem, Navbar } from "react-bootstrap";
import "./App.css";
import { LinkContainer } from "react-router-bootstrap";
import { Auth } from "aws-amplify";
import Routes from "./Routes";
import { Link, withRouter } from "react-router-dom";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false
        };
    }

    userHasAuthenticated = authenticated => {
        this.setState({ isAuthenticated: authenticated });
        this.setEmail();
    }

    async setEmail(){
        const e  = await Auth.currentAuthenticatedUser();
        this.setState({email: e.attributes.email});
    }

    handleLogout = async event => {
        event.preventDefault();
        await Auth.signOut();

        this.userHasAuthenticated(false);
        this.props.history.push("/login");
    }

    async componentDidMount() {
        if(this.isAuthenticated){
            this.setEmail();
        }
    }

    render() {
        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            userHasAuthenticated: this.userHasAuthenticated
        };

        return (
            <div className="App container">
                <Navbar fluid collapseOnSelect>
                    {this.state.isAuthenticated ?
                        <Navbar.Header>
                        <Navbar.Brand>
                        <Link to="/newProject">Create</Link>
                        </Navbar.Brand>
                        <Navbar.Brand>
                        <Link to="/searchProjects">Join</Link>
                        </Navbar.Brand>
                        <Navbar.Brand>
                        <Link
                            to = {{pathname: "/profileSkills", email :this.state.email}}
                        >Skills</Link>
                        </Navbar.Brand>
                        <Navbar.Brand>
                        <Link to="/">My projects</Link>
                        </Navbar.Brand>

                        <Navbar.Toggle />
                        </Navbar.Header>
                        :
                        <Navbar.Brand>
                            Log in into app ->
                        </Navbar.Brand>
                    }
                    <Navbar.Collapse>
                        <Nav pullRight>
                            {this.state.isAuthenticated
                                ?
                                <Fragment>
                                    <NavItem> {this.state.email} </NavItem>
                                    <NavItem onClick={this.handleLogout}>Logout</NavItem>
                                </Fragment>
                                : <Fragment>
                                    <LinkContainer to="/signup">
                                        <NavItem>Signup</NavItem>
                                    </LinkContainer>
                                    <LinkContainer to="/login">
                                        <NavItem>Login</NavItem>
                                    </LinkContainer>
                                </Fragment>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Routes childProps={childProps} />

            </div>
        );
    }
}

export default withRouter(App);
//export default withAuthenticator(App, true);
