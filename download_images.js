const fs = require('fs');
const https = require('https');
const dns = require('dns');

dns.setServers(['8.8.8.8', '1.1.1.1']);

const urls = {
  "iphone15.jpg": "https://z.nooncdn.com/products/tr:n-t_400/v1694762319/N53433265A_1.jpg",
  "airfryer.jpg": "https://m.media-amazon.com/images/I/61S8n4X-7PL._AC_SL1500_.jpg",
  "redmi15c.jpg": "https://m.media-amazon.com/images/I/71I3u7+8f6L._AC_SL1500_.jpg",
  "ssd.jpg": "https://ae01.alicdn.com/kf/S7e764724c9c148488e6a56b6b6b6b6b6C.jpg",
  "joyroom.jpg": "https://m.media-amazon.com/images/I/41-S+N-R8yL._AC_SL1000_.jpg",
  "t500.jpg": "https://m.media-amazon.com/images/I/51rYgUe1f4L._AC_SL1000_.jpg",
  "powerbank.jpg": "https://m.media-amazon.com/images/I/51bE8UaU1cL._AC_SL1500_.jpg",
  "clipper.jpg": "https://m.media-amazon.com/images/I/61k3Y5p78jL._AC_SL1500_.jpg",
  "scale.jpg": "https://m.media-amazon.com/images/I/61S-vP0lEWL._AC_SL1500_.jpg"
};

if (!fs.existsSync('img')) {
    fs.mkdirSync('img');
}

let downloads = 0;
const total = Object.keys(urls).length;

const agent = new https.Agent({
    lookup: (hostname, options, callback) => {
        dns.resolve4(hostname, (err, addresses) => {
            if (err) return callback(err);
            callback(null, addresses[0], 4);
        });
    }
});

function download(name, url) {
    https.get(url, { agent }, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
            download(name, res.headers.location);
        } else if (res.statusCode === 200) {
            const file = fs.createWriteStream('img/' + name);
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                downloads++;
                console.log(`Downloaded: ${name} (${downloads}/${total})`);
            });
        } else {
            console.error(`Failed ${name}: ${res.statusCode}`);
        }
    }).on('error', (err) => {
        console.error(`Error ${name}: ${err.message}`);
    });
}

for (let [name, url] of Object.entries(urls)) {
    download(name, url);
}
