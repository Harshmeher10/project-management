import React, { useState } from 'react';
import Modal from '@/component/Modal';
import { Comment, Task, useAddCommentMutation, useDeleteCommentMutation, useGetTaskCommentsQuery } from '@/state/api';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { useGetAuthUserQuery } from '@/state/api';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
};

const TaskComments = ({ isOpen, onClose, task }: Props) => {
  const [newComment, setNewComment] = useState('');
  const { data: comments, isLoading } = useGetTaskCommentsQuery(task.id);
  const [addComment] = useAddCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const { data: currentUser } = useGetAuthUserQuery({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment({
        taskId: task.id,
        content: newComment.trim()
      }).unwrap();
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await deleteComment({
        taskId: task.id,
        commentId
      }).unwrap();
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Task Comments">
      <div className="mt-4 flex flex-col space-y-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{task.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Comments ({comments?.length || 0})</p>
        </div>

        {/* Comments List */}
        <div className="flex-1 space-y-4 overflow-y-auto max-h-[400px]">
          {isLoading ? (
            <div className="text-center text-gray-500 dark:text-gray-400">Loading comments...</div>
          ) : comments?.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">No comments yet</div>
          ) : (
            comments?.map((comment) => (
              <div key={comment.id} className="flex space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                {comment.author?.profilePictureUrl && (
                  <img
                    src={`https://pm-s2-images.s3.ap-south-1.amazonaws.com/${comment.author.profilePictureUrl}`}
                    alt={comment.author.username}
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {comment.author?.username || 'Unknown User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    {comment.authorId === currentUser?.userDetails?.userId && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Comment Form */}
        <form onSubmit={handleSubmit} className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            rows={3}
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Comment
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default TaskComments; 