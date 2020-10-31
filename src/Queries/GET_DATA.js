import gql from 'graphql-tag';

const GET_POSTS = (x, y, z) => {

  if (z !== null) {
    return gql`
    {
      posts (
        pageSize: ${x},
        after: ${y},
        category: ${z}
      ) {
        hasMore
        cursor
        posts {
          id
          postTitle
          author
          postBody
          postLikes
          userId
          categoryId
          postComments
          postStatus
          postVisibility
          postImageURL
          postTags
          cursor
          likedBy
          updatedAt
          createdAt
        }
      }
    }
    ` 
  } else {
    return gql`
{
  posts (
    pageSize: ${x},
    after: ${y}
  ) {
    hasMore
    cursor
    posts {
      id
      postTitle
      author
      postBody
      postLikes
      userId
      categoryId
      postComments
      postStatus
      postVisibility
      postImageURL
      postTags
      cursor
      likedBy
      updatedAt
      createdAt
    }
  }
}
`
  }
}

export default GET_POSTS;