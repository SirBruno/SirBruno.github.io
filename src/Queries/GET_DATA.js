import gql from 'graphql-tag';

const GET_POSTS = gql`
{
  posts (
    pageSize: 8,
    # after: "2"
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