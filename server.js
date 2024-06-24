import express from 'express';
import http from 'http';
import { normalizePort } from './api/module/port.js';
import api from './api/api.js';

const app = express();
const port = normalizePort(process.env.PORT || '80');
app.set('port', port);

app.use(express.static('public', {
    extensions: ['html', 'htm']
}));

app.get('/', (req, res) => {
    res.redirect('/index.html');
});


app.use(express.urlencoded({ extended: true }));
app.use('/', api);


const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
server.on('error', (error) => {
    console.log(`Error: ${error}`);
});