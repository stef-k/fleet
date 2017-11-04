'use strict'

/*
|-----------------------------------------------------------------------------
| Web Socket
|-----------------------------------------------------------------------------
|
| WebSocket provider makes it so simple for you to write realtime applications
| with the power of channels and dynamic rooms. Make use of this file to
| define channels and bind controllers next to them.
|
|
| @example
| Ws.channel('/chat', 'ChatController')
*/

const Ws = use('Ws')

/**
 * Map update channel. Everytime a new report is posted
 * we use this channel to update the frontend in connected clients.
 * This will be available to authenticated clients only.
 */
Ws.channel('map-updates', 'MapUpdatesController')
