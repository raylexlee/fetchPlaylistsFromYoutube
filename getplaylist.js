#!/usr/bin/env node
const urls = process.argv;
urls.splice(0,2);
if (urls.length === 0) {
   process.exit(1);
}
const playlistJSONpath = './playlist.json';
const syncRequest = require('sync-request');
const fs = require('fs');
const Playlist = require('./lib/getPlaylist.js')();
const vpattern = /window\["ytInitialData"\]\s=\s(\{.*"\}\]\}\}\});/m;
const upattern = /https:\/\/www\.youtube\.com\/(.*)\/(.*)\/playlists/;
urls.forEach(url => {
   const umatch = upattern.exec(url);
   if (umatch === null) return;
   const user = umatch[2];
   const newChannel = (umatch[1] !== 'c');
   const res = syncRequest('GET', url);
   const contents = res.getBody('utf8');
   const match = vpattern.exec(contents);
   // fs.writeFileSync(`./${user}.json`, match[1]);
   // process.exit(11);   
   const data = JSON.parse(match[1]);
   const sectionListContents = data.contents.twoColumnBrowseResultsRenderer.tabs[2].tabRenderer.content.sectionListRenderer.contents;
   sectionListContents.forEach(sectionListContent => {
      const shelfItems = newChannel
         ? sectionListContent.itemSectionRenderer.contents[0].gridRenderer.items 
         : sectionListContent.itemSectionRenderer.contents[0].shelfRenderer.content.horizontalListRenderer.items;
      shelfItems.forEach(shelfItem => {
         const gridPlaylist = shelfItem.gridPlaylistRenderer;
         const playlistId = gridPlaylist.playlistId;
         const title = gridPlaylist.title.runs[0].text;
         const videoCount = gridPlaylist.videoCountShortText.simpleText;
         Playlist[playlistId] = {title: title, videoCount: videoCount};
         });
      });
   });
fs.writeFileSync(playlistJSONpath, JSON.stringify(Playlist));
