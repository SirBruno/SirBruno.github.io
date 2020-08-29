import gql from 'graphql-tag';

const GET_POSTS = gql`
{
  posts (pageSize: 8) {
    hasMore
    cursor
    posts {
      id
      postTitle
      postBody
      cursor
    }
  }
}
`

export default GET_POSTS;