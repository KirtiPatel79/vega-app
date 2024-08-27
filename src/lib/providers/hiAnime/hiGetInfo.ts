import axios from 'axios';
import {Info, EpisodeLink, Link} from '../types';
import {getBaseUrl} from '../getBaseUrl';

export const hiGetInfo = async function (link: string): Promise<Info> {
  try {
    const baseUrl = await getBaseUrl('consumet');
    const url = `${baseUrl}/anime/zoro/info?id=` + link;
    console.log(url);
    const res = await axios.get(url);
    const data = res.data;
    const meta = {
      title: data.title,
      synopsis: data.description,
      image: data.image,
      tags: [
        data?.type,
        data?.subOrDub === 'both' ? 'Sub And Dub' : data?.subOrDub,
      ],
      imdbId: '',
      type: data.episodes.length > 0 ? 'series' : 'movie',
    };

    const linkList: Link[] = [];
    const subLinks: EpisodeLink[] = [];
    data.episodes.forEach((episode: any) => {
      const title = 'Episode ' + episode.number;
      const link = episode.id;
      if (link && title) {
        subLinks.push({
          title,
          link,
        });
      }
    });

    linkList.push({
      title: meta.title + ' (Sub)',
      episodesLink: '',
      movieLinks: '',
      directLinks: subLinks,
      quality: '',
    });

    if (data?.subOrDub === 'both') {
      const dubLinks: EpisodeLink[] = [];
      data.episodes.forEach((episode: any) => {
        const title = 'Episode ' + episode.number;
        const link = episode.id?.replace('both', 'dub');
        console.log(link);
        if (link && title) {
          dubLinks.push({
            title,
            link,
          });
        }
      });

      linkList.push({
        title: meta.title + ' (Dub)',
        episodesLink: '',
        movieLinks: '',
        directLinks: dubLinks,
        quality: '',
      });
    }

    return {
      ...meta,
      linkList: linkList,
    };
  } catch (err) {
    console.error(err);
    return {
      title: '',
      synopsis: '',
      image: '',
      imdbId: '',
      type: 'movie',
      linkList: [],
    };
  }
};