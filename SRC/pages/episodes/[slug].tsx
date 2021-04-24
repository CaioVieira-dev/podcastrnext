import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimestring';
import { FaAngleDoubleLeft } from 'react-icons/fa';
import styles from './episode.module.scss';
import { PlayerContext, usePlayer } from '../../contexts/PlayerContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useResponsive } from '../../contexts/ResponsiveContext';

type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    members: string;
    duration: number;
    durationAsString: string;
    url: string;
    publishedAt: string;
    description: string;
}

type EpisodeProps = {
    episode: Episode;
}


export default function Episode({ episode }: EpisodeProps) {
    //const router = useRouter();
    // if(router.isFallback){
    //     return <p>Carregando...</p>  
    // }

    const { play } = usePlayer();
    const { isDark } = useTheme();
    const { screenSize1080 } = useResponsive();

    return (
        <div className={isDark ? `${styles.dark} ${styles.relative}` : styles.relative}>
            <div className={isDark ? styles.darkEpisode : styles.episode}>
                <Head>
                    <title>{episode.title} | Podcastr</title>
                </Head>
                <div className={styles.showPlayerButton} > <FaAngleDoubleLeft onClick={screenSize1080} /></div>
                <div className={styles.thumbnailContainer}>
                    <Link href="/">
                        <button type="button">
                            <img src="/arrow-left.svg" alt="Voltar" />
                        </button>
                    </Link>

                    <Image
                        width={700}
                        height={160}
                        src={episode.thumbnail}
                        objectFit="cover"
                    />
                    <button type="button" onClick={() => play(episode)}>
                        <img src="/play.svg" alt="Tocar episódio" />
                    </button>
                </div>
                <header>
                    <h1>{episode.title}</h1>
                    <span>{episode.members}</span>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                </header>
                <div
                    className={styles.description}
                    dangerouslySetInnerHTML={{ __html: episode.description }}
                />

            </div>
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],   //no momento do build, o next não gera paginas de forma estatica
        fallback: 'blocking' //se a pagina ainda não foi criada, a pagina é criada pelo next, o usuario só ira para a pagina quando ela estiver carregada
        //usando true como parametro, a pagina é criada pelo browser, o usuario pode ver mensagem de carregamento(if(router.isFalback))
        //até a pagina ser criada e carregada
        //usando false como parametro, a pagina não é criada
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params;
    const { data } = await api.get(`/episodes/${slug}`)

    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,
    }


    return {
        props: {
            episode,
        },
        revalidate: 60 * 60 * 24, //24horas
    }
}