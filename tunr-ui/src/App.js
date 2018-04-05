import React, {Component} from 'react'
import axios from 'axios'

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import UsersList from './components/UsersList'
import NewUserForm from './components/NewUserForm'

class App extends Component {

    state = {
        users: []
    }

    async componentDidMount() {
        const usersResponse = await axios.get(process.env.REACT_APP_HOST+'/users')
        this.setState({
            users: usersResponse.data,
            usersResponse
        })
    }

    deleteUser = async (userId, index) => {
        try {
            await axios.delete(process.env.REACT_APP_HOST+`/users/${userId}`)

            const updatedUsersList = [...this.state.users]
            updatedUsersList.splice(index, 1)

            this.setState({users: updatedUsersList})

        } catch (error) {
            console.log(`Error deleting User with ID: ${userId}`)
        }
    }

    createUser = async (newUser) => {
        try {
            const newUserResponse = await axios.post(process.env.REACT_APP_HOST+'/users', newUser)
            const newUserFromDatabase = newUserResponse.data

            const updatedUsersList = [...this.state.users]
            updatedUsersList.push(newUserFromDatabase)

            this.setState({users: updatedUsersList})

        } catch (error) {
            console.log("Error creating new User")
        }
    }

    render() {

        const UsersListComponent = () => (
            <UsersList
                users={this.state.users}
                deleteUser={this.deleteUser}/>
        )

        const NewUserFormComponent = () => (
            <NewUserForm createUser={this.createUser}/>
        )

        return (
            <Router>
                <Switch>
                    <Route exact path="/" render={UsersListComponent}/>
                    <Route exact path="/new" render={NewUserFormComponent}/>
                </Switch>
            </Router>
        )
    }
}

export default App;
