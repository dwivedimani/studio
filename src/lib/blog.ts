
'use server';

import fs from 'fs/promises';
import path from 'path';
import type { BlogPost, NewBlogPost } from '@/types/blog';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'blogs.json');

// Local helper function, not exported
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars (alphanumeric, underscore, hyphen)
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const jsonData = await fs.readFile(dataFilePath, 'utf-8');
    const posts = JSON.parse(jsonData) as BlogPost[];
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Failed to read blog posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const posts = await getAllPosts();
    return posts.find(post => post.slug === slug);
  } catch (error) {
    console.error(`Failed to get post by slug ${slug}:`, error);
    return undefined;
  }
}

export async function getPostById(id: string): Promise<BlogPost | undefined> {
  try {
    const posts = await getAllPosts();
    return posts.find(post => post.id === id);
  } catch (error) {
    console.error(`Failed to get post by ID ${id}:`, error);
    return undefined;
  }
}

export async function addPost(newPostData: NewBlogPost): Promise<BlogPost> {
  const posts = await getAllPosts();
  const newPost: BlogPost = {
    id: Date.now().toString(),
    slug: generateSlug(newPostData.title),
    title: newPostData.title,
    author: newPostData.author || 'Admin',
    date: new Date().toISOString(),
    content: newPostData.content,
    excerpt: newPostData.excerpt || newPostData.content.substring(0, 150) + (newPostData.content.length > 150 ? '...' : ''),
  };

  let potentialSlug = newPost.slug;
  let counter = 1;
  // Ensure slug uniqueness for new posts
  while (posts.some(post => post.slug === potentialSlug)) {
    potentialSlug = `${generateSlug(newPostData.title)}-${counter}`;
    counter++;
  }
  newPost.slug = potentialSlug;

  posts.unshift(newPost); // Add to the beginning to keep it sorted by recent

  try {
    await fs.writeFile(dataFilePath, JSON.stringify(posts, null, 2), 'utf-8');
    return newPost;
  } catch (error) {
    console.error('Failed to write new blog post:', error);
    throw new Error('Could not save the blog post.');
  }
}

export async function updatePost(postId: string, dataToUpdate: NewBlogPost): Promise<BlogPost | null> {
  const posts = await getAllPosts();
  const postIndex = posts.findIndex(post => post.id === postId);

  if (postIndex === -1) {
    console.error(`Post with ID ${postId} not found for update.`);
    return null; // Or throw an error
  }

  const originalPost = posts[postIndex];
  const updatedPost = { ...originalPost, ...dataToUpdate };

  // If title changed, regenerate slug and ensure uniqueness
  if (dataToUpdate.title && dataToUpdate.title !== originalPost.title) {
    let newSlug = generateSlug(dataToUpdate.title);
    let counter = 1;
    // Ensure new slug is unique among OTHER posts
    while (posts.some(p => p.slug === newSlug && p.id !== postId)) {
      newSlug = `${generateSlug(dataToUpdate.title)}-${counter}`;
      counter++;
    }
    updatedPost.slug = newSlug;
  }
  
  // Update excerpt if not provided or if content changed
  if (dataToUpdate.content || !dataToUpdate.excerpt) {
      updatedPost.excerpt = dataToUpdate.excerpt || dataToUpdate.content.substring(0,150) + (dataToUpdate.content.length > 150 ? '...' : '');
  }
  
  // Ensure author is set
  updatedPost.author = dataToUpdate.author || originalPost.author || 'Admin';


  posts[postIndex] = updatedPost;
  // No need to re-sort here if we are just updating, date doesn't change unless explicitly updated

  try {
    await fs.writeFile(dataFilePath, JSON.stringify(posts, null, 2), 'utf-8');
    return updatedPost;
  } catch (error) {
    console.error(`Failed to write updated blog post (ID: ${postId}):`, error);
    throw new Error('Could not update the blog post.');
  }
}


export async function deletePost(postId: string): Promise<boolean> {
  let posts = await getAllPosts();
  const initialLength = posts.length;
  posts = posts.filter(post => post.id !== postId);

  if (posts.length === initialLength) {
    console.warn(`Post with ID ${postId} not found for deletion.`);
    return false;
  }

  try {
    console.log(`Attempting to write updated posts to: ${dataFilePath}`);
    const dataToWrite = JSON.stringify(posts, null, 2);
    console.log(`Data to write snippet (${posts.length} posts, first ~500 chars): ${dataToWrite.substring(0, 500)}${dataToWrite.length > 500 ? '...' : ''}`);
    
    await fs.writeFile(dataFilePath, dataToWrite, 'utf-8');
    console.log(`Successfully wrote updated posts to: ${dataFilePath}`);
    return true;
  } catch (error) {
    const underlyingErrorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Failed to write updated posts to ${dataFilePath}. Underlying error:`, underlyingErrorMessage, error);
    throw new Error(`Could not write to blog data file. Path: ${dataFilePath}. Details: ${underlyingErrorMessage}`);
  }
}
