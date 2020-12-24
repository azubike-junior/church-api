import { tryHandler } from "../utils/global";
import { badRequest, createdResponse, noContent, notFound, successResponse } from "../utils/http";
import { createAPost, findPostById, getAllPosts, getAllPostByAuthor, deletePostById } from "../utils/query";
import validate from 'uuid-validate'
import { paginationOption, reqPaginationQuery } from "../utils/pagination";

export const createPost = () =>
    tryHandler(async (req, res) => {
        const {user:{user_id},  body: { content, description } } = req;

        const author_id = user_id;

        if (!validate(author_id, 4)) {
            return badRequest(res, 'invalid id')
        }
        await createAPost({ author_id, content, created_at: new Date(), description });
        return createdResponse(res, 'post created')
    });

export const getPost = () =>
    tryHandler(async (req, res) => {
        const { post_id } = req.params;
        if (!validate(post_id, 4)) {
            return badRequest(res, 'invalid id')
        }
        const post = await findPostById(post_id);
        if (!post) {
            return notFound(res, 'no post found')
        }
        return successResponse(res, { post })
    });


export const getPosts = () =>
    tryHandler(async (req, res) => {
        const { page, limit } = reqPaginationQuery(req);
        const posts = await getAllPosts(page, limit);
        
        const postsCount = posts.length;

        const pageQuery = paginationOption(req, postsCount);

        return successResponse(res, { posts, pageQuery })
    });


export const getPostByAuthor = () =>
    tryHandler(async (req, res) => {
        const {page, limit} = reqPaginationQuery(req)

        const { author_id } = req.params;
        if (!validate(author_id, 4)) {
            return badRequest(res, 'invalid id')
        }
        const posts = await getAllPostByAuthor(author_id, page, limit )
        
        const postsCount = posts.length;

        const pageQuery = paginationOption(req, postsCount)

        return successResponse(res, { posts, pageQuery })
    });

export const deletePost = () =>
    tryHandler(async (req, res) => {
        const { post_id } = req.params;
        if (!validate(post_id, 4)) {
            return badRequest(res, 'invalid id')
        }
        const post = await findPostById(post_id);
        if (!post) {
            return notFound(res, 'no post with this id')
        }
        await deletePostById(post_id);
        return noContent(res)
    });

export const updateAPost = () =>
    tryHandler(async (req, res) => {
        const { body: { content, description }, params:{post_id}} = req;
        if (!validate(post_id, 4)) {
            return badRequest(res, 'invalid id')
        }
        const post = await findPostById(post_id);
        if (!post) {
            return notFound(res, 'no post with this id')
        }
        await post.updatePost(content, description);
        
        return successResponse(res, 'update success');
    });
