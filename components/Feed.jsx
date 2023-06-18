"use client";

import { useState, useEffect} from 'react'
import PromptCard from './PromptCard';

const PromptCardList = ({ data, handleTagClick}) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post) => ( 
        <PromptCard 
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        /> 
      ))}
    </div>
  )
}

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);

  // Search states
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const fetchPosts = async () => {
    const response = await fetch("/api/prompt");
    const data = await response.json();

    setAllPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
    return allPosts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);

    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
  };
  
  return ( 
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input 
          type='text'
          placeholder='Search for a tag or a username'
          value={searchText}
          onChange={handleSearchChange}
          required
          className='search_input peer'
        />  
      </form>

      {/* All Prompts */}
      {searchText ? (
        <PromptCardList
          data={searchedResults}
          handleTagClick={handleTagClick}
        />
      ) : (
        <PromptCardList data={allPosts} handleTagClick={handleTagClick} />
      )}
    </section>
  )
}

export default Feed;

/*

setSearchTimeout:
This is a function created through the useState hook provided by React. 
It's used to hold a timeout ID for a search delay. When the user types 
into the search box, the code waits for a half-second (500 milliseconds) 
before it actually performs the search operation (by calling filterPrompts). 
This delay is known as "debouncing" and it's useful to prevent the app 
from performing a search operation every time the user presses a key, 
which can be very inefficient and could potentially overwhelm the server 
if the list of posts is very large. If the user types another character 
into the search box before the half-second is up, the previous timeout 
is cleared and a new one is set. Only when the user stops typing for at 
least half a second does the search operation actually get carried out. 
This makes the search experience smoother and more efficient.

setSearchTimeout:
This is a function created through the useState hook provided by React. 
It's used to hold a timeout ID for a search delay. 
When the user types into the search box, the code waits for a half-second 
(500 milliseconds) before it actually performs the search operation 
(by calling filterPrompts). This delay is known as "debouncing" 
and it's useful to prevent the app from performing a search operation 
every time the user presses a key, which can be very inefficient and 
could potentially overwhelm the server if the list of posts is very large. 
If the user types another character into the search box before the 
half-second is up, the previous timeout is cleared and a new one is set. 
Only when the user stops typing for at least half a second does the search 
operation actually get carried out. This makes the search experience 
smoother and more efficient.

*/