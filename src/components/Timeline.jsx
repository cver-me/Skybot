import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { format } from 'timeago.js';
import { Post } from './Post';
import { MediaModal } from './MediaModal';

const BLUESKY_SERVICE = 'https://bsky.social';

function Timeline() {
  const [posts, setPosts] = useState([]);
  const [newPostsCount, setNewPostsCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const timelineRef = useRef(null);
  const lastPostIdRef = useRef(null);

  // Restore scroll position when posts load
  useEffect(() => {
    const savedPosition = localStorage.getItem('timeline-position');
    const savedDate = localStorage.getItem('timeline-date');

    if (savedPosition && savedDate === new Date().toDateString()) {
      setTimeout(() => {
        if (timelineRef.current) {
          timelineRef.current.scrollTo(0, parseInt(savedPosition));
        }
      }, 100);
    }
  }, [posts]);

  // Auto-login if token exists
  useEffect(() => {
    const token = localStorage.getItem('bluesky-token');
    if (token) {
      setIsLoggedIn(true);
      handleRefresh();
    }
  }, []);

  function handleScroll() {
    const position = timelineRef.current?.scrollTop;
    localStorage.setItem('timeline-position', String(position));
    localStorage.setItem('timeline-date', new Date().toDateString());
  }

  async function handleLogin(identifier, appPassword) {
    try {
      const response = await fetch(`${BLUESKY_SERVICE}/xrpc/com.atproto.server.createSession`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password: appPassword }),
      });

      const data = await response.json();
      localStorage.setItem('bluesky-token', data.accessJwt);
      setIsLoggedIn(true);
      handleRefresh();
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  async function handleRefresh() {
    setIsRefreshing(true);
    try {
      const response = await fetch(`${BLUESKY_SERVICE}/xrpc/app.bsky.feed.getTimeline`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bluesky-token')}`
        }
      });
      const data = await response.json();

      if (lastPostIdRef.current) {
        const newPostsIndex = data.feed.findIndex(post =>
          post.post.cid === lastPostIdRef.current
        );
        if (newPostsIndex > 0) {
          setNewPostsCount(newPostsIndex);
        }
      }

      if (data.feed.length > 0) {
        lastPostIdRef.current = data.feed[0].post.cid;
      }

      setPosts(data.feed);
    } catch (error) {
      console.error('Failed to refresh timeline:', error);
    } finally {
      setIsRefreshing(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="h-screen flex items-center justify-center">
        <form
          className="p-6 space-y-4 w-full max-w-sm"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target;
            handleLogin(form.identifier.value, form.password.value);
          }}
        >
          <div>
            <input
              name="identifier"
              type="text"
              placeholder="handle.bsky.social"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              placeholder="App Password"
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h1 className="text-[17px] font-semibold">Home</h1>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
        >
          <RefreshCw className={`w-[18px] h-[18px] ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {newPostsCount > 0 && (
        <div className="sticky top-0 z-10 flex justify-center py-2">
          <div className="bg-[#9c5fff] text-white px-4 py-1 rounded-full text-[13px] font-medium">
            {newPostsCount} new {newPostsCount === 1 ? 'post' : 'posts'}
          </div>
        </div>
      )}

      <div ref={timelineRef} onScroll={handleScroll} className="flex-1 overflow-y-auto">
        {posts.map((post, index) => (
          <div key={`${post.post.cid}-${index}`} className="px-4 py-3 border-b">
            <Post post={post} onMediaSelect={setSelectedMedia} />
          </div>
        ))}
      </div>

      {selectedMedia && (
        <MediaModal
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </div>
  );
}

export default Timeline;