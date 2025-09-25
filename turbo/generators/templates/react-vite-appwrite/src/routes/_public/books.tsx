import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@repo/react-components/ui'

import { books, QUERY_KEYS } from 'src/lib/api'

function BooksPage() {
  const {
    data: booksData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.books,
    queryFn: async () => {
      const response = await books.getAll();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch books');
      }
      return response.data;
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading books...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md">
            <h3 className="text-destructive font-semibold mb-2">Error loading books</h3>
            <p className="text-destructive/80 mb-4">
              {error instanceof Error ? error.message : 'An unknown error occurred'}
            </p>
            <Button
              onClick={() => refetch()}
              variant="destructive"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Books Database Demo</h1>
        <p className="text-muted-foreground">
          This page demonstrates Appwrite database integration with a simple books collection.
        </p>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground">
          Books ({booksData?.total || 0})
        </h2>
        <Button onClick={() => refetch()}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </Button>
      </div>

      {booksData && booksData.total > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(booksData?.rows || []).map((book) => (
            <Card key={book.$id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{book.title}</CardTitle>
                <CardDescription>by {book.author}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Year:</span>
                    <span className="font-medium">{book.year}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Genre:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      book.genre === 'Fiction'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : book.genre === 'Science'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : book.genre === 'History'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {book.genre}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground pt-2">
                    Added: {new Date(book.$createdAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No books found</h3>
          <p className="text-muted-foreground mb-4">
            No books are available in the database. Add some books through the Appwrite console to see them here.
          </p>
          <p className="text-sm text-muted-foreground">
            Make sure your Appwrite database is configured with the BOOKS collection.
          </p>
        </div>
      )}

      <div className="mt-8 p-6 bg-muted/50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Database Information</h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• Collection: Books</p>
          <p>• Fields: title, author, year, genre</p>
          <p>• Features: Create, Read, Update, Delete (CRUD)</p>
          <p>• Query support: Filter by genre, sort by date</p>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_public/books')({
  component: BooksPage,
})