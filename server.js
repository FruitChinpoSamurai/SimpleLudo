const fs = require(`fs`)
const http = require(`http`)
const WebSocket = require(`ws`)

const readFile = (fileName) =>
  new Promise((resolve, reject) => {
    fs.readFile(fileName, (readErr, fileContents) => {
      if (readErr) {
        reject(readErr)
      } else {
        resolve(fileContents)
      }
    })
  })

const server = http.createServer(async (req, resp) => {
    if (req.url == `/ludo`) {
        const clientHtml = await readFile(`client.html`)
        resp.end(clientHtml)
    } else if (req.url == `/myjs`) {
        const clientJs = await readFile(`client.js`)
        resp.end(clientJs)
    } else if (req.url == `/ludo.css`) {
        const clientCss = await readFile(`ludo.css`)
        resp.end(clientCss)
    } else if (req.url == `/center.png`) {
        const clientCss = await readFile(`center.png`)
        resp.end(clientCss)
    } else {
        resp.end(`Not found`)
    }
})

server.listen(8000)

const wss = new WebSocket.Server({ port: 8080 })

const thisboard = [[['blue','blue','blue','blue'],[],[],[],[],[],[],[],[],[],[],[],[],[],['red','red','red','red']],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[['yellow','yellow','yellow','yellow'],[],[],[],[],[],[],[],[],[],[],[],[],[],['green','green','green','green']]]

const randomDice = [Math.floor(1 + Math.random()*6)]

const iskilled = (ox, oy) => (ox-7)*(ox-7)+(oy-7)*(oy-7)

const playersList = ['blue', 'yellow', 'green', 'red']

const colors = ['blue', 'yellow', 'green', 'red']

const safeBoxes = [[2, 6], [1, 8], [6, 12], [8, 13], [12, 8], [13, 6], [8, 2], [6, 1], [0, 0], [0, 14], [14, 14], [14, 0], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 8], [7, 9], [7, 10], [7, 11], [7, 12], [7, 13], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [8, 7], [9, 7], [10, 7], [11, 7], [12, 7], [13, 7]]

const DiddyDirtyHardCode = [[1, 7, 6], [2, 7, 6], [2, 7, 5], [3, 7, 6], [3, 7, 5], [3, 7, 4], [4, 7, 6], [4, 7, 5], [4, 7, 4], [4, 7, 3], [5, 7, 6], [5, 7, 5], [5, 7, 4], [5, 7, 3], [5, 7, 2], [7, 13, 6], [7, 12, 6], [7, 12, 5], [7, 11, 6], [7, 11, 5], [7, 11, 4], [7, 10, 6], [7, 10, 5], [7, 10, 4], [7, 10, 3], [7, 9, 6], [7, 9, 5], [7, 9, 4], [7, 9, 3], [7, 9, 2], [13, 7, 6], [12, 7, 6], [12, 7, 5], [11, 7, 6], [11, 7, 5], [11, 7, 4], [10, 7, 6], [10, 7, 5], [10, 7, 4], [10, 7, 3], [9, 7, 6], [9, 7, 5], [9, 7, 4], [9, 7, 3], [9, 7, 2], [7, 1, 6], [7, 2, 6], [7, 2, 5], [7, 3, 6], [7, 3, 5], [7, 3, 4], [7, 4, 6], [7, 4, 5], [7, 4, 4], [7, 4, 3], [7, 5, 6], [7, 5, 5], [7, 5, 4], [7, 5, 3], [7, 5, 2]]

const Comparator = (moves, currentMove) => moves.some(a => currentMove.every((v, i) => v === a[i]))

const homeMapper = color => { if ( color === `blue`) return ['blue', 0, 0] 
                              if ( color === `yellow`) return ['yellow', 14, 0]
                              if ( color === `green`) return ['green', 14, 14]
                              if ( color === `red`) return ['red', 0, 14] }

// This function is not original; was given with the assignment prompt.
const step = (color, ox, oy, steps) => {
  const transform = ([ox,oy]) => ({'blue': [+ox,+oy], 'green': [-ox,-oy], 'red': [-oy,+ox], 'yellow': [+oy,-ox]}[color])
  const path = ['-7,-7', '-1,-6', '-1,-5', '-1,-4', '-1,-3', '-1,-2', '-2,-1', '-3,-1', '-4,-1', '-5,-1', '-6,-1', '-7,-1', '-7,0', '-7,1', '-6,1', '-5,1', '-4,1', '-3,1', '-2,1', '-1,2', '-1,3', '-1,4','-1,5', '-1,6', '-1,7', '0,7', '1,7', '1,6', '1,5', '1,4', '1,3','1,2', '2,1', '3,1', '4,1', '5,1', '6,1', '7,1', '7,0', '7,-1', '6,-1', '5,-1', '4,-1', '3,-1', '2,-1', '1,-2', '1,-3', '1,-4', '1,-5','1,-6', '1,-7', '0,-7', '0,-6', '0,-5', '0,-4', '0,-3', '0,-2', '0,-1']
  const [x,y] = transform(transform(transform(path[path.indexOf(transform([ox-7, oy-7]).join(','))+steps].split(','))))
  return [x+7,y+7]
}

 wss.on(`connection`, (ws) => {
    ws.on(`message`, (toSend) => {
      const cleanedtoSend = JSON.parse(toSend)
      if (cleanedtoSend.turn === cleanedtoSend.color) {                               //Ensures movement is only in turn.
        let position = 0
        if ((iskilled(cleanedtoSend.x, cleanedtoSend.y) == 98) && (randomDice[0] === 6)) {  //If ghoti is at home and the Don assigns him a hit.
          position = step(cleanedtoSend.color, cleanedtoSend.x, cleanedtoSend.y, 1)
        } else if ((iskilled(cleanedtoSend.x, cleanedtoSend.y) == 98) && (randomDice[0] != 6)) {  //If ghoti is at home and the Don refuses to give him work.
          position = step(cleanedtoSend.color, cleanedtoSend.x, cleanedtoSend.y, 0)
        } else if ((iskilled(cleanedtoSend.x, cleanedtoSend.y) != 98)) {                   //Ghoti is now on the streets and wild.
          if (((Comparator(DiddyDirtyHardCode, [parseInt(cleanedtoSend.x), parseInt(cleanedtoSend.y), randomDice[0]]) === true)) || (iskilled(cleanedtoSend.x, cleanedtoSend.y) == 1)) {  //Ensures bodyguards for ghotis when going to Don's house.
            position = [parseInt(cleanedtoSend.x), parseInt(cleanedtoSend.y)]
          } else {
            position = step(cleanedtoSend.color, cleanedtoSend.x, cleanedtoSend.y, randomDice[0])
          }
        }
        thisboard[cleanedtoSend.x][cleanedtoSend.y].splice(thisboard[cleanedtoSend.x][cleanedtoSend.y].indexOf(cleanedtoSend.color), 1)
        if (Comparator(safeBoxes, position) === true) {                               //Ensures ghoti assassination does not occur in public spaces.
          thisboard[position[0]][position[1]].push(cleanedtoSend.color)
        } else {
          if (thisboard[position[0]][position[1]] != cleanedtoSend.color) {           //Essence of brotherhood and family discrimination.
            let goHome = thisboard[position[0]][position[1]].map(homeMapper)
            thisboard[position[0]][position[1]].splice(0)
            thisboard[position[0]][position[1]].push(cleanedtoSend.color)
            while (goHome.length != 0) {                                              //Killed ghotis are disposed of and new ones hired as replacement.
              thisboard[goHome[0][1]][goHome[0][2]].push(goHome[0][0])
              goHome.splice(0, 1)
            }
          } else {
            thisboard[position[0]][position[1]].push(cleanedtoSend.color)
          }
        }
        randomDice.splice(0, 1, Math.floor(1 + Math.random()*6))
        const sendboard = {
          type: `newboard`,
          board: thisboard
        }
        const senddice = {
          type: `dice`,
          number: randomDice[0]
        }
        colors.push(colors[0])
        colors.splice(0, 1)
        let Number = 2
        if ((thisboard[6][7].length === 4) || (thisboard[7][6].length === 4) || (thisboard[7][8].length === 4) || (thisboard[8][7].length === 4)) { //The winning family is decided here.
          Number = 5
        } 
        const sendturn = {
          type: `player`,
          user: [colors[0], Number]
        }
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(sendboard))
            client.send(JSON.stringify(senddice))
            client.send(JSON.stringify(sendturn))
          }
        })
      } else {
        const sendturn = {
          type: `player`,
          user: [cleanedtoSend.turn, 3]
        }
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(sendturn))
          }
        })
      }
    })

    if (wss.clients.size === 1) {
      ws.send(JSON.stringify({
        type: `start`,
        user: [playersList[0], 1]
      }))
      playersList.splice(0, 1)
    } else if (wss.clients.size === 2) {
      ws.send(JSON.stringify({
        type: `start`,
        user: [playersList[0], 1]
      }))
      playersList.splice(0, 1)
    } else if (wss.clients.size === 3) {
      ws.send(JSON.stringify({
        type: `start`,
        user: [playersList[0], 1]
      }))
      playersList.splice(0, 1)
    } else if (wss.clients.size === 4) {
      ws.send(JSON.stringify({
        type: `start`,
        user: [playersList[0], 1]
      }))
      playersList.splice(0, 1)
    }

    if(playersList.length === 0) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: `newboard`,
          board: thisboard
        }))
        client.send(JSON.stringify({
          type: `dice`,
          number: randomDice[0]
        }))
        client.send(JSON.stringify({
          type: `player`,
          user: [colors[0], 2]
        }))
      }
    })
  }
}) 