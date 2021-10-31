import axios from 'axios';
import cheerio from 'cheerio';
// import querystring from 'querystring';
import { stripString, youtubeDurationConverter } from '@/util/util';

export const getImage = async (url) => {
  return await axios.request({
    responseType: 'arraybuffer',
    url: url,
    method: 'get',
    headers: {
      'Content-Type': 'image/jpeg'
    }
  }).then(res => res.data);
};

export const searchBugsSong = (keyword, option, pageNumber) => {
  return axios.get('https://music.bugs.co.kr/search/track', {
    params: {
      q: keyword,
      page: pageNumber,
      target: option,
      flac_only: 'false',
      sort: 'A'
    }
  }).then(res => {
    const $ = cheerio.load(res.data);
    const songList = [];
    const pageList = [];
    $('table.trackList tbody tr').each((index, item) => {
      const key = $(item).attr('trackid');
      const songName = $(item).find('th > p.title > a').first().attr('title');
      const artistName = $(item).find('td > p.artist > a').first().text();
      const albumName = $(item).find('td > .album').first().text();
      const albumCoverUrl = $(item).find('td > a.thumbnail > img').first().attr('src').replace('/50/', '/300/');
      songList.push({ key, songName, artistName, albumName, albumCoverUrl });
    });
    $('div.paging > a').each((index, item) => {
      let isSelected = false;
      const pageHref = $(item).attr('href');
      const regex = new RegExp('[0-9]+');
      const result = pageHref.match(regex)[0];
      const classNameList = $(item).attr('class').split(/\s+/);
      if (classNameList) {
        if (classNameList[0] === 'selected') {
          isSelected = true;
        }
      }
      pageList.push({ index: result, isSelected });
    });
    return { songList, pageList };
  }).catch(e => console.error(e));
};

export const getMusicDetail = (musicId) => {
  const url = `https://music.bugs.co.kr/track/${musicId}?wl_ref=list_tr_08_search`;
  return axios.get(url)
    .then(res => {
      const $ = cheerio.load(res.data);
      const musicDetail = {
        infoMapper: {},
        albumHref: ''
      };
      const lyrics = $('div.lyricsContainer > xmp');
      if (lyrics.text()) {
        musicDetail.lyrics = lyrics.text();
      }
      $('div.basicInfo > table.info > tbody > tr').each((index, tr) => {
        const thElement = $(tr).find('th');
        if (thElement) {
          const thText = thElement.text();
          if (thText === '아티스트') {
            const artists = [];
            $(tr).find('a').each((i, item) => {
              artists.push(stripString($(item).text()));
            });
            // let artistName = stripString($(tr).find('a').text());
            musicDetail.artist = artists;
          } else if (thText === '앨범') {
            const album = $(tr).find('a');
            musicDetail.albumName = album.text();
            musicDetail.albumHref = album.attr('href');
          } else if (thText === '재생 시간') {
            const duration = $(tr).find('time').text();
            musicDetail.duration = duration || '';
          } else if (thText === '참여 정보') {
            const items = $('#participatingArtists table.info > tbody > tr');
            items.each((index, data) => {
              const metaDataTitle = $(data).find('th').first().text();
              $(data).find('td > *').each((i, detail) => {
                if (!musicDetail.infoMapper[metaDataTitle]) {
                  musicDetail.infoMapper[metaDataTitle] = [];
                }
                musicDetail.infoMapper[metaDataTitle].push($(detail).text());
              });
            });
          }
          const songName = stripString(($('#container > header > div > h1').first().text() || '').replace('\[19금\]\n', ''));
          musicDetail.songName = songName;
          const albumCoverUrl = $('div.basicInfo > div > ul > li > a > img').first();
          if (albumCoverUrl) {
            musicDetail.imgSrc = albumCoverUrl.attr('src').split('?')[0].replace('/200/', '/500/');
            // logger.error(musicDetail)
          }
          musicDetail.bugsId = musicId;
        }
      });
      return musicDetail;
    }).then(async musicDetail => {
      const albumDetail = await getAlbumDetail(musicDetail.albumHref);
      return { musicDetail, albumDetail };
    }).catch(err => console.error(err));
};
export const getAlbumDetail = async (albumHref) => {
  return await axios.get(albumHref)
    .then(res => {
      const albumData = {
        albumType: '',
        artist: [],
        releaseDate: '',
        genre: [],
        style: []
      };
      const $ = cheerio.load(res.data);
      $('table.info > tbody > tr').each((index, item) => {
        const metaDataText = $(item).find('th').first().text();
        const td = $(item).find('td > *');
        if (metaDataText === '아티스트') {
          td.each((index, item) => {
            albumData.artist.push(stripString($(item).text()));
          });
        } else if (metaDataText === '앨범 종류') {
          albumData.albumType = stripString($(item).find('td').first().text());
        } else if (metaDataText === '발매일') {
          td.each((index, item) => {
            albumData.releaseDate = (stripString($(item).text()));
          });
        } else if (metaDataText === '장르') {
          td.each((index, item) => {
            albumData.genre.push(stripString($(item).text()));
          });
        } else if (metaDataText === '스타일') {
          td.each((index, item) => {
            albumData.style.push(stripString($(item).text()));
          });
        } else if (metaDataText === '기획사') {
          albumData.company = stripString($(item).find('td').first().text());
        } else if (metaDataText === '유통사') {
          albumData.distributor = stripString($(item).find('td').first().text());
        }
      });
      return albumData;
    });
};
export const getBugsTop100 = () => {
  const url = 'https://music.bugs.co.kr/chart/track/realtime/total';
  return axios.get(url, { headers: { 'Access-Control-Allow-Origin': '*' } }).then(res => res.data).then(data => {
    const $ = cheerio.load(data);
    const musicList = [];
    $('#CHARTrealtime > table > tbody > tr').each((index, item) => {
      const musicId = $(item).attr('trackid');
      const albumId = $(item).attr('albumid');
      const ranking = $(item).find('td:nth-child(4) > div > strong').text();
      const albumCoverUrl = $(item).find('td:nth-child(5) > a > img').attr('src').replace('/50/', '/300/');
      const songName = $(item).find('th > p > a').text();
      const artistName = $(item).find('td:nth-child(8) > p > a').text();
      const albumName = $(item).find('td:nth-child(9) > a').text();
      musicList.push({ ranking, albumCoverUrl, songName, artistName, albumName, key: musicId, albumId });
    });
    return musicList;
  });
};

export const searchYoutube = async (apiKey, query) => {
  console.log(query);
  let idSearchResult;
  try {
    idSearchResult = await axios.get(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${query}&maxResults=50`).catch(e => e);
  } catch (e) {
    console.log(e);
  }
  console.log(idSearchResult);
  console.log(idSearchResult.data);
  const youtubeIdList = idSearchResult.data.items.map(item => item.id.videoId);
  if (!youtubeIdList.length) {
    return null;
  }
  console.log(youtubeIdList);
  const videoDetails = await axios.get(`https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&part=snippet,contentDetails&id=${youtubeIdList.join(',')}`);
  const searchResult = videoDetails.data;
  searchResult.items.forEach(item => {
    item.contentDetails.durationStr = youtubeDurationConverter(item.contentDetails.duration);
  });
  searchResult.nextPageToken = idSearchResult.data.nextPageToken;
  searchResult.prevPageToken = idSearchResult.data.prevPageToken;
  searchResult.pageInfo = idSearchResult.data.pageInfo;
  console.log(searchResult);
  return searchResult;
};
