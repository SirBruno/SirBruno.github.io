**URL base:** http://archetypeofficial.herokuapp.com

## 1. Registro
**Endpoint**: POST /register
**Body**:  

	{
	    "username": "bruno@mail.com",
	    "nickname": "brunyzz",
	    "password": "12341234"
	}

## 2. Login

**Endpoint**: GET /login?username=**bruno@mail.com**&password=**12341234**

## 3. Calcular userExp do usuário

  const getExp = async () => {
    const fetchPosts = await client.query({
      variables: { _id: topicId },
      query: gql`
      query user($_id: String){
          user(_id: $_id) {
            id
            userPosts
            userImageURL
            nickname
            userDescription
          }
        }
      `,
    })

    if (fetchPosts.data.user?.id) {
      setSingleUser(fetchPosts.data.user)
    }

    if (topicId) {

      const xxx = async () => {
        let counter = 0;
        let posts = [];
        let lel = 0;
        await fetchPosts.data.user?.userPosts.forEach(async (x) => {

          const postRes = await client.query({
            variables: { _id: x },
            query: gql`
            query post($_id: String){
              post(_id: $_id) {
                id
                postTitle
                likedBy
              }
            }
        `,
          })

          counter++;
          lel += postRes.data.post.likedBy.length
          posts.push({ id: postRes.data.post.id, postTitle: postRes.data.post.postTitle })

          if (stuff === null) {
            if (counter <= fetchPosts.data.user.userPosts.length) {
              setStuff(lel)
              setUserPosts(posts.slice(0, 10))
            }
          }

        })
      }

      xxx()
    }
  }