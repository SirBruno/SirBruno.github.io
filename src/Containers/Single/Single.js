import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export default function Single() {
  const { topicId } = useParams();
  const client = useApolloClient();
  const [book, setBook] = useState(0);

  const dataTitle = React.createRef();
  const dataAuthor = React.createRef();
  const dataDescription = React.createRef();

  useEffect(() => {

    const getBook = async () => {
      const res = await client.query({
        variables: { _id: topicId },
        query: gql`
          query book($_id: String){
            book(_id: $_id) {
              id
              title
              author
              description
            }
          }
      `,
      })

      const bookRes = await res.data.book
      setBook(bookRes);
      console.log(book)
    }

    getBook()
  });

  const updateBook = async (_id) => {

    console.log('*********************')
    console.log(_id);
    console.log(dataTitle.current.value);
    console.log('*********************')
    const res = await client.mutate({
      variables: {
        _id,
        title: dataTitle.current.value,
        author: dataAuthor.current.value,
        description: dataDescription.current.value
      },
      mutation: gql`
        mutation updateBook($_id: String, $title: String, $author: String, $description: String){
          updateBook(_id: $_id, title: $title, author: $author, description: $description) {
            id
            title
            author
            description
          }
        }
    `,
    })

    console.log(res);
  }

  if (book === 0) {
    return <h3>Loading...</h3>
  } else return (
    <div>
      <h3>{book.title}</h3>
      <p>{book.author}</p>
      <p>{book.description}</p>
      <input ref={dataTitle} defaultValue={book.title} />
      <br />
      <input ref={dataAuthor} defaultValue={book.author} />
      <br />
      <input ref={dataDescription} defaultValue={book.description} />
      <br />
      <button onClick={() => updateBook(book.id)}>Submit</button>
    </div>
  )
}