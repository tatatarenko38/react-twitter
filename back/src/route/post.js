//підключаємо технологію express для back-end сервера
const express = require('express')

//створюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const { Post } = require('../class/post')

//======================================================

//router.get створює нам один ендпоїнт

//вводимо шлях до сторінки

//створює пост
router.post('/post-create', function (req, res) {
  try {
    //щоб створити replay post - треба вказати postId
    const { username, text, postId } = req.body

    if (!username || !text) {
      return res.status(400).json({
        message:
          'Потрібно передати всі данні для створення поста',
      })
    }

    let post = null

    console.log(postId, 'postId')

    if (postId) {
      post = Post.getById(Number(postId))
      console.log('post', post)

      if (!post) {
        return res.status(400).json({
          message: 'Пост з таким ID не існує',
        })
      }
    }

    //якщо postId нема, то буде звичайний пост і попаде сюди post === null
    // y create(y class Post) також попаде null
    const newPost = Post.create(username, text, post)

    return res.status(200).json({
      post: {
        id: newPost.id,
        text: newPost.text,
        username: newPost.username,
        date: newPost.date,
      },
    })
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

//==========================================================

// для отримання списку постів

router.get('/post-list', function (req, res) {
  try {
    //отримаємо список постів
    const list = Post.getList()

    if (list.length === 0) {
      return res.status(200).json({
        list: [],
      })
    }

    return res.status(200).json({
      // витягуємо потрібні данні
      list: list.map(({ id, username, text, date }) => ({
        //їх же і повертаємо(можуть ще бути тех.данні, які не потрібні користувачу)
        id,
        username,
        text,
        date,
      })),
    })
  } catch (e) {
    return res.status(400).json({ message: e.message })
  }
})

router.get('/post-item', function (req, res) {
  try {
    // витягуємо id
    const { id } = req.query

    if (!id) {
      return res
        .status(400)
        .json({ message: 'Потрібно передати ID поста' })
    }

    //по id шукаємо post
    const post = Post.getById(Number(id))

    if (!post) {
      return res.status(400).json({
        message: 'Пост з таким ID не існує',
      })
    }

    return res.status(200).json({
      //повертаємо пост та інфу про цей пост
      post: {
        id: post.id,
        text: post.text,
        username: post.username,
        date: post.date,

        //повертаємо reply та інфу про reply
        reply: post.reply.map((reply) => ({
          id: reply.id,
          text: reply.text,
          username: reply.username,
          date: reply.date,
        })),
      },
    })
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

//підключаємо роутер до бек-енду
module.exports = router
