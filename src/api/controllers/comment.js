import { tryHandler } from "../utils/global";
import validate from 'uuid-validate'
import { badRequest, createdResponse, noContent, notFound, successResponse } from "../utils/http";
import { paginationOption, reqPaginationQuery } from "../utils/pagination";
import { deleteCommentById, findPostById, createAComment, getPostComments, findCommentById } from "../utils/query";

export const createComment = () =>
    tryHandler(async (req, res) => {
        const { body:{content}, params:{post_id}, user: { user_id } } = req;
        const reviewer_id = user_id
        
        if (!validate(reviewer_id)) {
            return badRequest(res, 'invalid id')
        }
        const post = await findPostById(post_id);
        if (!post) {
            return notFound(res, 'post not found')
        }
        const comment = await createAComment({content, created_at:new Date(), post_id, reviewer_id});
       
        post.increment('numberOfComments')

        return createdResponse(res, { comment })
    });

export const getCommentsOfPost = () =>
    tryHandler(async (req, res) => {
        const { post_id } = req.params;
        const { page, limit } = reqPaginationQuery(req)
        if (!validate(post_id, 4)) {
            return badRequest(res, 'invalid id')
        }
        const comments = await getPostComments(post_id, { page, limit })
        
        const commentsCount = comments.length;

        const pageQuery = paginationOption(req, commentsCount);

        return successResponse(res, { comments, pageQuery });
    });

export const deleteComment = () =>
    tryHandler(async (req, res) => {
        const { comment_id } = req.params;

        if (!validate(comment_id, 4)) {
            return badRequest(res, 'invalid id')
        }
        const comment = await findCommentById(comment_id);
        const post_id = comment.get('post_id')
        const post = await findPostById(post_id)
        
        await deleteCommentById(comment_id);
        post.decrement('numberOfComments');

        return noContent(res)
    });

export const updateAComment = () => 
    tryHandler(async (req, res) => {
        const { params: {comment_id}, body:{content}} = req;

        if (!validate(comment_id, 4)) {
            return badRequest(res, 'invalid id')
        }
        const comment = await findCommentById(comment_id);
        if (!comment) {
            return notFound(res, 'comment not found');
        };
        await comment.updateComment(content);
        return successResponse(res, 'update success')
    })