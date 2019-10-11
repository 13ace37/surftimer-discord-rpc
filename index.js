console.clear(); //clears console

const http = require('http'); //http module

const port = 5555; //defines server port    
const host = '127.0.0.1'; //defines server host

const rpc = require('discord-rich-presence')("632010579464290304"); //discord rich-presence module

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

const date = new Date();

function setRP(data) {
    if (!data.map) {
        // idle prob
        try {
            confirm({
                details: '- Not in game -',
                state: 'N/A',
                largeImageKey: 'icon',
                smallImageText: data.player.name,
                startTimestamp: date
            });
        } catch (e) {
            throw (e);
        }
    } else {
        let surfing = 'surfing';
        if (data.provider.steamid != data.player.steamid) surfing = 'spectating';
        var maps = "N/A";
        var mapRank = "N/A";
        var serverRank = "N/A";

        if (data.player.match_stats.deaths > 0) mapRank = data.player.match_stats.deaths;
        if (data.player.match_stats.kills > 0) maps = data.player.match_stats.kills;
        if (data.player.match_stats.score < 0 && data.player.match_stats.score != -99999) serverRank = String(data.player.match_stats.score).slice(1);
        var map = data.map.name.split('/')[2] || data.map.name;
        if (map.startsWith('surf_')) {
            if (Number(String(data.player.match_stats.score).slice(1)) < 99999) rank = String(data.player.match_stats.score).slice(1);
            try {
                confirm({
                    details: `${surfing} on ${map}`,
                    state: `Maps: ${maps} | Ranks: ${mapRank} / ${serverRank}`,
                    largeImageKey: 'icon',
                    largeImageText: data.player.clan + " " + data.player.name,
                    smallImageText: data.player.name,
                    startTimestamp: date
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
    startTimestamp: date
};

function confirm(rp) {
    if (!rp) rp = fix;
    try {
        rpc.updatePresence(rp);
    } catch (e) {
        throw (e);
    }
}