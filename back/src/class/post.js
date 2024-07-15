class Post {
  static #list = []
  //для створення унік ідентифікатора
  static #count = 1

  constructor(username, text) {
    this.id = Post.#count++

    this.username = username
    this.text = text
    //повертає час в мілісек - перетворимо
    //в норм на фронтенді
    this.date = new Date().getTime()

    //для коментарів
    this.reply = []
  }

  static create(username, text, post) {
    const newPost = new Post(username, text)

    //post - необов'язк аргумент, якщо прийшов
    if (post) {
      // то додаємо його в існуючий пост
      post.reply.push(newPost)

      console.log(post)
    } else {
      //додаємо в #list в якості звич норм поста
      this.#list.push(newPost)
    }

    //щоб побачити список створених постів
    console.log(this.#list)

    return newPost
  }

  static getById(id) {
    return (
      this.#list.find((item) => item.id === Number(id)) ||
      null
    )
  }

  static getList = () => this.#list
}

module.exports = { Post }
