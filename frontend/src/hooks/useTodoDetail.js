import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../api';

export function useTodoDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [todo, setTodo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        status: 'pending'
    });

    const fetchTodoDetail = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.readTodo(id);
            setTodo(response.data);
            setEditForm({
                title: response.data.title,
                description: response.data.description || '',
                status: response.data.status
            });
            setError(null);
        } catch (error) {
            console.error('Error fetching todo detail:', error);
            setError('TODOの詳細を取得できませんでした。');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchTodoDetail();
    }, [fetchTodoDetail]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        // 変更がある場合は確認ダイアログを表示
        const hasChanges =
            editForm.title !== todo.title ||
            editForm.description !== (todo.description || '') ||
            editForm.status !== todo.status;

        if (hasChanges && !window.confirm('変更を破棄しますか？')) {
            return;
        }

        setIsEditing(false);
        setEditForm({
            title: todo.title,
            description: todo.description || '',
            status: todo.status
        });
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!editForm.title.trim()) {
            setError('タイトルは必須です。');
            return;
        }

        try {
            setSaving(true);
            await api.updateTodo(id, editForm);
            setTodo({ ...todo, ...editForm, updated_at: new Date().toISOString() });
            setIsEditing(false);
            setError(null);
        } catch (error) {
            console.error('Error updating todo:', error);
            setError('TODOの更新に失敗しました。');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('このTODOを削除しますか？')) {
            try {
                await api.deleteTodo(id);
                navigate('/');
            } catch (error) {
                console.error('Error deleting todo:', error);
                setError('TODOの削除に失敗しました。');
            }
        }
    };
    return {
        todo,
        loading,
        saving,
        error,
        isEditing,
        editForm,
        setError,
        setEditForm,
        fetchTodoDetail,
        handleEdit,
        handleCancelEdit,
        handleSaveEdit,
        handleDelete,
        navigate
    };
}
