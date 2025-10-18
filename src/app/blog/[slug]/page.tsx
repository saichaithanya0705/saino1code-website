interface PostPageProps {
  params: {
    slug: string
  }
}

export default function PostPage({ params }: PostPageProps) {
  return (
    <div className="container mx-auto max-w-screen-lg py-12 px-4 sm:px-6 lg:px-8">
      <div className="prose dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold">Blog Post: {params.slug}</h1>
        <p className="text-lg text-muted-foreground mt-2">
          This is a placeholder for a full blog post.
        </p>
        <hr className="my-6" />
        <p>
          [Placeholder content for the blog post with slug: <strong>{params.slug}</strong>.]
        </p>
        <p>
          The full content for this article will be displayed here. This will include formatted text, images, and code snippets relevant to the topic.
        </p>
      </div>
    </div>
  )
}