const ws = new WebSocket(`ws://localhost:8080`)

const Ludo = () => {
    const [board, setboard] = React.useState([])
    const [dice, setdice] = React.useState()
    const [begin, setbegin] = React.useState()
    const [messageType, setmessageType] = React.useState() 
    const [player, setplayer] = React.useState()

    ws.onmessage = (event) => {
        const clientReceive = JSON.parse(event.data)
        if (clientReceive.type === `newboard`) {
            setboard(clientReceive.board)
        } else if (clientReceive.type === `dice`) {
            setdice(clientReceive.number)
        } else if (clientReceive.type === `start`) {
            setbegin(clientReceive.user[0])
            setmessageType(clientReceive.user[1])
        } else if (clientReceive.type === `player`) {
            setplayer(clientReceive.user[0])
            setmessageType(clientReceive.user[1])
        }
    }
    
    const handleClick = async (ev) => {
        if (begin != ev.target.className) {
            setmessageType(4)
        } else {
            const toSend = {
                color: ev.target.className,
                x: ev.target.align,
                y: ev.target.id,
                turn: ev.target.title,
            }
            ws.send(JSON.stringify(toSend))
        }
    }

    return (
        <div>
            {board.map((board1, index1) => (
                <div key={index1}>
                    {board1.map((board2, index2) => (
                        <div key={index2} className={`cell${index1}${index2}`}>
                            {board2.map((board3, index3) => (
                                <div key={index3} className={board3} align={index1} id={index2} title={player} onClick={handleClick}>
                                </div>
                        ))}
                        </div>
                ))}
                </div>
            ))}
            <div className="dice"> {dice} </div>
            <div className={`color ${begin}`}> </div>
            { (messageType === 1) && <div className="text_box"> Player {`${begin}`} has connected. Wait for 3 more players.</div> }
            { (messageType === 2) && <div className="text_box"> It is {`${player}`}'s turn.</div> }
            { (messageType === 3) && <div className="text_box"> Someone is messing around. It is {`${player}`}'s turn.</div> }
            { (messageType === 4) && <div className="text_box"> Someone is attempting to play out of turn. It is {`${player}`}'s turn.</div> }
            { (messageType === 5) && <div className="text_box"> It is {`${begin}`}'s victory. Everyone else is a failure.</div> }
        </div>
    )
}

ReactDOM.render(<Ludo />, document.querySelector(`#root`))