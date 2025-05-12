'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { getUserNewsAndEventsAsync } from '@/redux-toolkit/slices/userSlice';
import { FaAngleUp } from 'react-icons/fa';
import './newsAndEvents.css';
import { API_URL } from '@/api/route';
import { INewsEvent, UserState } from '@/types';
import { AppDispatch } from '@/redux-toolkit/store';

interface RootState {
  user: UserState;
}

const NewsAndEvents: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { newsThumbnails, latestNews, newsEvents, isLoading, error } = useSelector(
    (state: RootState) => state.user
  );
  const [activeTab, setActiveTab] = useState<'news' | 'events'>('news');
  const [newsData, setNewsData] = useState<INewsEvent | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchAllNewsAndEvent = async () => {
      try {
        await dispatch(getUserNewsAndEventsAsync()).unwrap();
      } catch (err) {
        toast.error((err as string) || 'Server error');
      }
    };
    if (newsEvents.length === 0) {
      fetchAllNewsAndEvent();
    }
  }, [dispatch, newsEvents.length]);

  useEffect(() => {
    if (newsEvents.length > 0 && !newsData) {
      // Prefer an item with images
      const newsWithImages = newsEvents.find(event => event.images.length > 0);
      setNewsData(newsWithImages || newsEvents[0]);
    }
  }, [newsEvents, newsData]);

  const handleNewsClick = (news: INewsEvent) => {

    setNewsData(news);
  };

  const handleLoadMore = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsExpanded(!isExpanded);
  };

  if (isLoading) {
    return <div>Loading news and events...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!newsData) {
    return <div>No news data available</div>;
  }

  return (
    <section className="bg-grey typo-dark">
      <div className="container">
        <div className="row">
          <div className="col-md-9">
            <div className="tab-news">
              <div className="title-bg-line">
                <h6
                  className={`title ${activeTab === 'news' ? 'active' : ''}`}
                  onClick={() => setActiveTab('news')}
                >
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    News
                  </a>
                </h6>
                <h6
                  className={`title ${activeTab === 'events' ? 'active' : ''}`}
                  onClick={() => setActiveTab('events')}
                >
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    Events
                  </a>
                </h6>
              </div>

              {activeTab === 'news' && (
                <div className="row">
                  <div className="col-sm-6">
                    <div className="news-wrap">
                      <div className="image_grid_lg">
                        <div className="image-container">
                          {newsData.images.length > 0 ? (
                            newsData.images.map((image, index) => (
                              <>
                              {console.log("test image ",`${API_URL}${encodeURI(image)}`)
                              }
                              <img
                                key={index}
                                className="news-image"
                                src={`${API_URL}${encodeURI(image)}`}
                                alt={`News ${index}`}
                                onError={() => console.error(`Failed to load image: ${API_URL}${image}`)}
                              />
                              </>
                            ))
                          ) : (
                            <img
                              className="news-image"
                              src="#"
                              alt="No image"
                            />
                          )}
                        </div>
                      </div>
                      <div className="news-content">
                        <h5>
                          <a href="#" onClick={(e) => e.preventDefault()}>
                            {newsData.title}
                          </a>
                        </h5>
                        <span className="news-cat">
                          {newsData.description.length > 80 ? (
                            <>
                              {isExpanded
                                ? newsData.description
                                : `${newsData.description.slice(0, 80)}... `}
                              <a
                                href="#"
                                onClick={handleLoadMore}
                                style={{
                                  color: 'white',
                                  fontSize: '15px',
                                }}
                              >
                                {isExpanded ? (
                                  <span className="d-flex">
                                    Show less <FaAngleUp style={{ margin: '5px' }} />
                                  </span>
                                ) : (
                                  'Load more...'
                                )}
                              </a>
                            </>
                          ) : (
                            newsData.description
                          )}
                        </span>
                        <span className="news-meta">
                          {new Date(newsData.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="widget_no_box">
                      <ul className="thumbnail-widget">
                        {newsEvents
                          .filter((news) => news.category === 'news')
                          .map((news) => (
                            <li
                              key={news._id}
                              onClick={() => handleNewsClick(news)}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className="thumb-wrap">
                                {news.images.length > 0 && (
                                  <div className="image-grid-container">
                                    <div className="image-grid">
                                      {news.images.map((image, index) => (
                                        <img
                                          key={index}
                                          width="60"
                                          height="60"
                                          alt="Thumb"
                                          className="img-responsive"
                                          src={`${API_URL}${encodeURI(image)}`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                )}
                                <div className="grid-text">
                                  <span className="color">{news.title}</span>
                                  <p>
                                    {news.description.length > 80
                                      ? news.description.slice(0, 80) + '...'
                                      : news.description}
                                  </p>
                                  <small>
                                    {new Date(news.date).toLocaleDateString()}
                                  </small>
                                </div>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'events' && (
                <div className="row">
                  <div className="col-sm-12">
                    <div className="events-wrap">
                      <h5>Upcoming Events</h5>
                      <ul className="events-list">
                        {newsEvents
                          .filter((item) => item.category === 'event')
                          .map((item) => (
                            <li key={item._id}>
                              <strong>Event Name:</strong> {item.title}
                              <br />
                              <strong>Date:</strong>{' '}
                              {item.eventDate
                                ? new Date(item.eventDate).toLocaleDateString()
                                : 'TBD'}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {activeTab !== 'events' && (
            <div className="col-md-3">
              <aside className="right_sidebar">
                <div className="widget_lates_box">
                  <h5 className="widget-title">
                    Latest News<span></span>
                  </h5>
                  <ul className="thumbnail_latest_widget">
                    {latestNews.length > 0 ? (
                      latestNews
                        .filter((news) => news.category === 'news')
                        .slice(0, 5)
                        .map((news) => (
                          <li
                            key={news._id}
                            onClick={() => handleNewsClick(news)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="thumb-wrap">
                              {news.images.length > 0 && (
                                <div className="image-grid-container">
                                  <div className="image-grid">
                                    {news.images.map((image, index) => (
                                      <img
                                        key={index}
                                        width="60"
                                        height="60"
                                        alt="Thumb"
                                        className="img-responsive"
                                        src={`${API_URL}${encodeURI(image)}`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                              <div className="grid-text">
                                <a href="#" onClick={(e) => e.preventDefault()}>
                                  {news.title}
                                </a>
                                <p className="latest_grid_description">
                                  {news.description.length > 60
                                    ? news.description.substring(0, 60) + '...'
                                    : news.description}
                                </p>
                                <span>
                                  {new Date(news.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </li>
                        ))
                    ) : (
                      <p className="no-news-message">No latest news available</p>
                    )}
                  </ul>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsAndEvents;