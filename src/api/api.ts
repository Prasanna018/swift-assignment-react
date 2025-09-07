import type { CommentItem, User } from "../types/types"


export async function fetchUsers(): Promise<User[]> {
    const res = await fetch('https://jsonplaceholder.typicode.com/users')
    if (!res.ok) throw new Error('Failed to fetch users')
    return res.json()
}

export async function fetchComments(): Promise<CommentItem[]> {
    const res = await fetch('https://jsonplaceholder.typicode.com/comments')
    if (!res.ok) throw new Error('Failed to fetch comments')
    return res.json()
}
