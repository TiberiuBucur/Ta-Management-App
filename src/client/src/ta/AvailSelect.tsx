import React, {ChangeEventHandler, useState} from "react"

const AvailSelect = () => {

    return (
        <div>
            <Intro />
            <Selection />
        </div>
    )
}


const Selection = () => {
    const [userName, setUserName] = useState("");
    const [selection, setSelection] = useState({
        Mon: "None",
        Thu: "None",
        Fri: "None"
    })
    const handleSubmit = async () => {
        console.log("Submitted: " + selection)
        console.log("Username: " + userName)

        if (userName === "") {
            alert("Please enter a non-empty username");
            return;
        }

        const response = await fetch("/newavail", {
            method: 'POST',
            mode: 'same-origin', 
            cache: 'no-cache', 
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({...selection, "userName": userName})
          });
        const body = await response.json()

        console.log(body)
    }
    
    return (
        <div>
            <ul>
                <li>
                    Mon:
                    <select style={{marginLeft: "10px"}} defaultValue={selection.Mon}
                    onChange={(event) => {
                        const res = {...selection, "Mon": event.target.value};
                        console.log(res)
                        setSelection(res)
                    }}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="None">None</option>
                    </select>
                </li>
                <li>
                    Thu:
                    <select style={{marginLeft: "10px"}}defaultValue={selection.Thu}
                    onChange={(event) => {
                        const res = {...selection, "Thu": event.target.value};
                        console.log(res)
                        setSelection(res)
                    }}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="None">None</option>
                    </select>
                </li>
                <li>
                    Fri:
                    <select style={{marginLeft: "10px"}} defaultValue={selection.Fri}
                    onChange={(event) => {
                        const res = {...selection, "Fri": event.target.value};
                        console.log(res)
                        setSelection(res)
                    }}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="None">None</option>
                    </select>
                </li>
            </ul>
            <br/>
            <br/>
            <input type="text" value={userName} onChange={(event) => {
                setUserName(event.currentTarget.value)
            }} />
            <button onClick={handleSubmit}>SUBMIT</button>
        </div>
    )
}

const Intro = () => {
    return (
        <div>
            <h1>Select your preferences for this term:</h1>
            <ul>
                Enter a single number from 1 to 3 stating your preference
                <li>1 - most wanted slot</li>
                <li>2 - second most wanted slot</li>
                <li>3 - least prefered slot</li>
                <li>None - cannot attend</li>
            </ul>
        </div>
    )
}

export default AvailSelect
