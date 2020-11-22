const fs = require('fs');

module.exports = () => {
  const playlistJSONpath = './playlist.json';
  let Playlist = {};
  if (fs.existsSync(playlistJSONpath)) {
    const rawdata = fs.readFileSync(playlistJSONpath);
    Playlist = JSON.parse(rawdata);
  } 
  return Playlist;
};
