import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IoPlayCircleSharp } from "react-icons/io5";
import { AiOutlinePlus } from "react-icons/ai";
import { RiThumbUpFill, RiThumbDownFill } from "react-icons/ri";
import { BiChevronDown } from "react-icons/bi";
import { BsCheck } from "react-icons/bs";
import axios from "axios";
import { API_KEY, TMDB_BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";

import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import { removeMovieFromLiked } from "../store";

export default React.memo(function Card({ index, movieData, isLiked = false }) {
  const [onHovered, setOnHovered] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState(undefined);
  const [trailer, setTrailer] = useState(null);
  const dispatch = useDispatch(); // Move useDispatch inside the functional component body

  const { id } = movieData;

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const response = await axios.get(
          `${TMDB_BASE_URL}/movie/${movieData.id}/videos?api_key=${API_KEY}&language=en-US`
        );
        const videos = response.data.results;
        const trailer = videos.find((video) => video.type === "Trailer");
        if (trailer) {
          setTrailer(trailer.key);
        }
      } catch (error) {
        console.error("Error fetching trailer:", error);
      }
    };

    fetchTrailer();

    // Cleanup function
    return () => {
      setTrailer(null);
    };
  }, [movieData.id]);

  //add todo
  const addToList = async () => {
    try {
      await axios.post(`https://net-resume-1.onrender.com/api/user/add`, {
        email,
        data: movieData,
      });
    } catch (error) {
      console.log(error);
    }
  };

  onAuthStateChanged(firebaseAuth, (currentUser) => {
    if (currentUser) {
      setEmail(currentUser.email);
    } else navigate("/login");
  });

  return (
    <CardContainer
      onMouseEnter={() => setOnHovered(true)}
      onMouseLeave={() => setOnHovered(false)}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
        alt="movie poster"
        onClick={() => navigate("/player")}
      />
      {onHovered && (
        <div className="hover">
          <div className="image-video-wrapper">
            <img
              src={`https://image.tmdb.org/t/p/w500/${movieData.poster_path}`}
              alt={movieData.title}
            />
            {trailer ? (
              <iframe
                src={`https://www.youtube.com/embed/${trailer}?autoplay=1&muted=1`}
                title={movieData.title}
                allowFullScreen
                onClick={() => navigate(`/trailer/${id}`)}
              ></iframe>
            ) : (
              <p>Trailer not found</p>
            )}
          </div>
          <div className="info-container">
            <h3
              className="movieName"
              onClick={() => navigate(`/trailer/${id}`)}
            >
              {movieData.name}
            </h3>
            <div className="icons">
              <div className="controls">
                <IoPlayCircleSharp
                  title="play"
                  onClick={() => navigate(`/trailer/${id}`)}
                />
                <RiThumbUpFill title="like" />
                <RiThumbDownFill title="Dis like" />
                {isLiked ? (
                  <BsCheck
                    title="Remove from List"
                    onClick={() =>
                      dispatch(
                        removeMovieFromLiked({ movieId: movieData.id, email })
                      )
                    }
                  />
                ) : (
                  <AiOutlinePlus
                    title="Add to my list"
                    onClick={addToList}
                  />
                )}
              </div>
              <div className="info">
                <BiChevronDown title="More Info" />
              </div>
            </div>
            <div className="genres">
              <ul>
                {movieData.genres.map((genre) => (
                  <li key={index}>{genre}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </CardContainer>
  );
});

const CardContainer = styled.div`
  margin-top: 1rem;
  max-width: 230px;
  width: 230px;
  height: 100%;
  cursor: pointer;
  position: relative;

  img {
    border-radius: 0.2rem;
    width: 100%;
    height: 100%;
    z-index: 10;
  }
  .hover {
    z-index: 99;
    height: max-content;
    width: 20rem;
    position: absolute;
    top: -18vh;
    left: 0;
    border-radius: 0.2rem;
    border: 0.1rem solid gray;
    background-color: #181818;
    transition: 0.3s ease-out;
    .image-video-wrapper {
      position: relative;
      height: 140px;
      p{
        color:white;
        color: white;
        font-size: 1rem;
        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      img {
        width: 100%;
        height: 150px;
        object-fit: cover;
        border-radius: 0.3rem;
        top: 0;
        z-index: 4;
        position: absolute;
      }
      iframe {
        width: 100%;
        height: 150px;
        object-fit: cover;
        border-radius: 0.3rem;
        top: 0;
        z-index: 4;
        position: absolute;
      }
    }
    .info-container {
      display: flex;
      flex-direction: column;
      padding: 1rem;
      gap: 0.5rem;
      .movieName {
        color: white;
      }
    }
    .icons {
      display: flex;
      justify-content: space-between;
      .controls {
        display: flex;
        gap: 0.5rem;
      }

      svg {
        color: white;
        border: 0.1rem solid white;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        transition: 0.3s ease-in-out;
        &:hover {
          color: #b8b8b8;
        }
      }
    }
    .genres {
      display: flex;
      color: white;
      ul {
        display: flex;
        gap: 1rem;
        li {
          padding-right: 0.7rem;
          &:first-of-type {
            list-style-type: none;
          }
        }
      }
    }
  }
`;
