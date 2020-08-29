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
      postBody
      cursor
      postImageURL
    }
  }
}
`

export default GET_POSTS;