const { exec, escape } = require('../db/mysql')
const xss = require('xss')

const getList = async (author, keyword) => {
    author = escape(author)
    let sql = `select * from blogs where 1=1 `
    if (author) {
        sql += `and author=${author} `
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createtime desc;`
    return await exec(sql)
}

const getDetail = async (id) => {
    id = escape(id)
    let sql = `select * from blogs where id=${id};`
    const rows = await exec(sql)
    return rows[0]
}

const newBlog = async (blogData = {}) => {
    // blogData 是一个博客对象， 包含 title content author属性
    // console.log('newBlog blogData... ', blogData)
    let { title, content, author } = blogData
    title = xss(escape(title))
    content = xss(escape(content))
    author = xss(escape(author))
    const createtime = Date.now()
    const sql = `insert into blogs (title, content, createtime, author)
     values (${title}, ${content}, ${createtime}, ${author});`
    
    const insertData = await exec(sql) 
    return  {
        id: insertData.insertId
    }
}

const updateBlog = async (id, blogData = {}) => {
    // id 就是要更新博客的id
    // blogData 是一个博客对象, 包含 title content 属性
    // console.log('updateBlog id blogData...', id, blogData)
    let { title, content } = blogData
    title = xss(escape(title))
    content = xss(escape(content))
    const sql = `update blogs set title=${title}, content=${content} where id=${id};`
    const updateData = await exec(sql)
    if (updateData.affectedRows > 0) {
        return true
    }
    return false
}

const delBlog = async (id, author) => {
    id = escape(id)
    author = escape(author)
    // id 就是要删除博客的id
    const sql = `delete from blogs where id=${id} and author=${author}`;

    const delData = await exec(sql)
    if (delData.affectedRows > 0) {
        return true
    }
    return false
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}