import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_KEY, TMDB_BASE_URL } from '../utils/constants';
import styled from 'styled-components';
import {BsArrowLeft} from 'react-icons/bs'
import { useNavigate } from "react-router-dom";
const Trailer = () => {
    const { id } = useParams();
    const [trailer, setTrailer] = useState(null);
    const [trailerNotFound, setTrailerNotFound] = useState(false);
    const navigate=useNavigate();


    useEffect(() => {
        const fetchTrailer = async () => {
            try {
                const response = await axios.get(
                    `${TMDB_BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
                );
                const videos = response.data.results;
                const trailer = videos.find((video) => video.type === 'Trailer');
                if (trailer) {
                    setTrailer(trailer.key);
                    setTrailerNotFound(false);
                } else {
                    setTrailer(null);
                    setTrailerNotFound(true);
                }
            } catch (error) {
                console.error('Error fetching trailer:', error);
                setTrailer(null);
                setTrailerNotFound(true);
            }
        };
        fetchTrailer();
    }, [id]);

    return (
        <PlayContainer>
            <div className='player'>
                <div className='backArrow'>
                    <BsArrowLeft onClick={() => navigate(-1)} />
                </div>
                {trailer ? (
                    <iframe
                        width="560"
                        height="315"
                        src={`https://www.youtube.com/embed/${trailer}?autoplay=1&muted=1`}
                        title="Movie Trailer"
                        allowFullScreen
                        autoPlay loop controls 
                    ></iframe>
                ) : trailerNotFound ? (
                    <p>Trailer not found</p>
                ) : (
                    <p>Loading...</p>
                )}
            </div>

        </PlayContainer>
    );
};
const PlayContainer = styled.div`
    .player{
      width: 100vw;
      height: 100vh;
      position:relative;
      p{
        color:white;
        color: white;
        font-size: 2rem;
        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
       
      }
      .backArrow{
         position: absolute;
         padding: 2rem;
         z-index: 1;
         svg{
          font-size: 3rem;
          cursor: pointer;
          color: white;
         }
      }
     iframe{
      height: 100vh;
      width: 100vw;
     }
    }
`


export default Trailer;