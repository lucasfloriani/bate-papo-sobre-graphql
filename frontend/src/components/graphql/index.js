import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { print } from 'graphql'
import gql from 'graphql-tag'

const Graphql = () => {
  const [text, setText] = useState('')
  const [todos, setTodos] = useState([])

  // ===== QUERY =====
  useEffect(() => {
    axios({
      url: 'http://localhost:8080/query',
      method: 'post',
      data: {
        query: `
          query {
            todos {
              id
              text
            }
          }
        `
      }
    })
      .then(content => setTodos(content.data.data.todos))
      .catch(err => console.error(err))
  }, [setTodos])

  // ===== MUTATION =====
  const createTodo = (text) => {
    const MUTATION = gql`
      mutation createTodo($input: NewTodo!) {
        createTodo(input:$input) {
          id
          text
          done
          user {
            id
            name
          }
        }
      }
    `

    axios
      .post('http://localhost:8080/query', {
        query: print(MUTATION),
        variables: {
          input: {
            text,
            userId: '1',
          },
        },
      })
      .then(res => setTodos([...todos, res.data.data.createTodo]))
      .catch(err => console.log(err))
  }

  return (
    <div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <h2>{todo.id}</h2>
            <p>{todo.text}</p>
          </li>
        ))}
      </ul>
      <form onSubmit={(e) => {
        e.preventDefault()
        createTodo(text)
      }}>
        <label>Texto do novo TODO</label>
        <input value={text} onChange={({ target }) => setText(target.value)} />
        <button>Criar Todo</button>
      </form>
    </div>
  )
}

export default Graphql
