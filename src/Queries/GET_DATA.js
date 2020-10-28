import gql from 'graphql-tag';

const GET_POSTS = (x, y) => gql`
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

export default GET_POSTS;