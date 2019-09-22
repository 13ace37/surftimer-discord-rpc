console.clear(); //clears console

const http = require('http'); //http module

const port = 5555; //defines server port    
const host = '127.0.0.1'; //defines server host

const rpc = require('discord-rich-presence')("559388357654872064"); //discord rich-presence module

const server = http.createServer((req, res) => { //sorry but im to fcking lazy to comment all this ._.
    if (req.method == 'POST') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        let body = '';
        req.on('data', (data) => {
            body += data;
        });
        req.on('end', () => {
            try {
                body = JSON.parse(body);
                res.end('');
                setRP(body);
            } catch (error) {
                console.error(error);
            }

        });
    } else {
        res.writeHead(500, {
            'Content-Type': 'text/html'
        });
        res.end('');
    }
});

server.listen(port, host);
console.log(`Server is listening to ${host}:${port}`);

var locktime = false;
var idle;

function setRP(data) {
    if (!data.map) {
        // idle prob
        try {
            confirm({
                details: '- Not in game -',
                state: 'N/A',
                largeImageKey: 'icon',
                smallImageText: data.player.name,
            });
        } catch (e) {
            throw (e);
        }
    } else {
        let surfing = 'surfing';
        if (data.provider.steamid != data.player.steamid) surfing = 'spectating';
        var time = "--:--";
        var rank = "N/A";
        if (!data.previously || data.previously == undefined) idle = setTimeout(function() {locktime = true;}, 25000);
        else {
            clearTimeout(idle);
            locktime = false;
        } 
        if (locktime) surfing = "idling";

        if (data.player.match_stats.kills > 0) {
            let ms = data.player.match_stats.kills * 1000;
            let round = ms > 0 ? Math.floor : Math.ceil;
            let minutes = fixTime(round(ms / 60000) % 60);
            let seconds = fixTime(round(ms / 1000) % 60);
            let milli = round(ms) % 1000;
            if (milli.length > '2') milli = fixTime(milli.slice(0, -1));
            else milli = fixTime(milli);
            time = `${minutes}:${seconds}`;
        } else time = "--:--";
        var map = data.map.name.split('/')[2] || data.map.name;
        if (map.startsWith('surf_')) {
            if (Number(String(data.player.match_stats.score).slice(1)) < 99999) rank = String(data.player.match_stats.score).slice(1);
            try {
                confirm({
                    details: `${surfing} on ${map}`,
                    state: `Timer: ${time} | Rank: ${rank}`,
                    largeImageKey: 'icon',
                    largeImageText: data.player.clan + " " + data.player.name,
                    smallImageText: data.player.name,
                });
            } catch (e) {
                throw (e);
            }
        } else {
            confirm(fix);
        }

    }
}

const fix = {
    details: "- Playing on a non surf_ map -",
    state: "N/A",
    largeImageKey: '',
    largeImageText: "",
    smallImageText: "",
};

function confirm(rp) {
    if (!rp) rp = fix;
    try {
        rpc.updatePresence(rp);
    } catch (e) {
        throw (e);
    }
}

function fixTime(number) {
    if (number < 10) number = '0' + number;
    return number;
}