function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        {/* Spinner */}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>

        {/* Loading text */}
        <h3 className="text-lg font-medium text-foreground mb-2">Loading...</h3>
        <p className="text-sm text-muted-foreground">
          Please wait while we load your content
        </p>
      </div>
    </div>
  )
}

export default PageLoader

