import models from '../../database/models';
import { paginate } from './pagination';
const { User, Post, Comment, Unit, Auth } = models; 

// User Queries
export const createUser = async (user) => {
    return await User.create(user)
}

export const getAllUsers = async (page, limit) => {
    return await User.findAll({}, paginate({page, limit}))
}

export const findUserByEmail = async (email) => {
    return await User.findOne({ where: { email } });
}

export const findUserById = async (id) => {
    return await User.findOne({ where : {user_id: id}})
}

export const getAllWorkers = async (page, limit) => {
    return await User.findAll({where: {worker: true}}, ...paginate({page, limit}))
} 

export const getAllFirstTimers = async (page, limit) => {
    return await User.findAll({where: {first_timer: true}}, ...paginate({page, limit}))
}

export const getAllHODs = async (page, limit) => {
    return await User.findAll({
        where: { account_type: 'HOD' },
        include: [{
            model: Unit,
            attribute: ['unit_id', 'name']
        }], 
    }, ...paginate({ page, limit }))
}

export const getAllWorkersInUnit = async (id, {page, limit}) => {
    return await User.findAll(
        {
            where: { unit: id },
             include: [{
            model: Unit,
            attribute: ['unit_id', 'name']
        }],
        }, ...paginate({page, limit}))
}

// Posts Queries
export const createPost = async (content, description, author_id) => {
    return await Post.create({content, description, author_id})
}

export const findPostById = async (id) => {
    return await Post.findOne({where: {post_id:id}})
}

export const getAllPosts = async () => {
    return await Post.findAll()
}

export const getPostByAuthor = async (id) => {
    return await Post.findAll({where: {author_id: id}})
}

export const getCommentsOfPost = async (id) => {
    return await Post.findOne({
        where: { post_id: id },
        include: {
            model: Comment, 
            attributes: ['content', 'reviewer_id']
    }})
}

export const deletePostById = async (id) => {
    return await Post.destroy({where: {post_id: id}})
}

//Comments Queries 
export const createComment = async (content, post_id, reviewer_id) => {
    return await Comment.create({content, post_id, reviewer_id})
}

export const getPostComments = async (id) => {
    return await Comment.findAll({where : {post_id: id}})
}

export const deleteCommentById = async (id) => {
    return await Comment.destroy({where: {comment_id: id}})
}

// Unit Queries
export const createUnit = async (name) => {
    return await Unit.create({name})
}

export const getPeopleInUnit = async (id, name) => {
    return await Unit.findOne({
        where: { unit_id: id, name },
        include: {
            model: User,
            attributes: ['user_id', 'name']
        }
    })
} 

export const getAllUnits = async (page, limit) => {
    return await Unit.findAll({}, ...paginate(page, limit))
}

export const deleteUnitById = async (id) => {
    return await Unit.destroy({where: {unit_id: id}})
}

export const getUnitById = async (id) => {
    return await Unit.findOne({where: {unit_id: id}})
}

//auth query 
export const createAuth = async (auth) => {
    return await Auth.create(auth)
}

export const findUserAuth = async (id) => {
    return await Auth.findOne({user_id:id})
}