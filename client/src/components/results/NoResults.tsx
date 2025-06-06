export const NoResults = ({ isError }: { isError: boolean }) => (
  <div className="text-center p-8">
    <p className="font-light text-muted-foreground">
      No results found for your search.
      { isError ? 'Seems that something went wrong.' : ''}
    </p>
  </div>
);
