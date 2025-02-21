"use client";

import {AuthenticatedSection, BookmarksPage, BookmarksPageMultSelectProvider} from "@/components";


export default function Home() {
    
  return (
    <AuthenticatedSection >
      <BookmarksPageMultSelectProvider>
        <BookmarksPage />
      </BookmarksPageMultSelectProvider>
    </AuthenticatedSection>
  );
}
