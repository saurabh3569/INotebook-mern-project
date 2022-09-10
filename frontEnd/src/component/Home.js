import Notes from './Notes'
import React from 'react'

const Home = (props) => {
    const {showAlert} = props
    return (
        <div>
            <Notes showAlert={showAlert}/>
        </div>
    )
}

export default Home
