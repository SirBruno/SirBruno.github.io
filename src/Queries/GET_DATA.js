import gql from 'graphql-tag';

const GET_POSTS = gql`
{
  posts {
    id
    postTitle
    postBody
    author
    postLikes
  }
}
`

export default GET_POSTS;