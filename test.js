const postArray = [
    { post_title: 'Post 1', post_content: 'Content 1' },
    { post_title: 'Post 2', post_content: 'Content 2' },
];

postArray.forEach((post, index) => {
    console.log(`Index: ${index}, Title: ${post.post_title}`);
});
